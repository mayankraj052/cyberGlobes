<script lang="ts">
	// Svelte
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';

	// Mapbox
	import mapboxgl from 'mapbox-gl';
	import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
	import * as turf from '@turf/turf';

	// Environment variables
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';

	// Services
	import { MapService } from '$lib/services/map-service';

	// Constants
	import {
		API_BASE_URL,
		MAP_PRIMARY_COLOR,
		MAPBOX_THEMES,
		MARKER_FONT_SIZE,
		SOCIAL_MARKER_CLASS,
		SOCIAL_MEDIA_PLATFORMS
	} from '$lib/constants/constants';

	// Utility functions
	import {
		getDataFromURL,
		putDataInURL,
		removeDataFromURL,
		toggleFullScreen
	} from '$lib/utils/generalUtils';
	import {
		addCircleRadius,
		addPulsingDotAnimation,
		parseCoordinates,
		resetMap
	} from '$lib/utils/mapUtils';

	// UI Components
	import LoadingOverlay from '$lib/components/ui/spinners/LoadingOverlay.svelte';
	import { toast } from 'svelte-sonner';

	// Icon Component
	import MapTopbar from '$lib/components/ui/map/MapTopbar.svelte';
	import MapSidebarV1 from '$lib/components/ui/map/MapSidebarV1.svelte';
	import {
		dataLoadingState,
		hoveredPostId,
		mapDataLoaded,
		searchRequestID,
		socialMediaJson,
		visibility
	} from '$lib/stores/mapStore';
	import ErrorDialog from '$lib/components/general/dialog/ErrorDialog.svelte';
	import { parseSocialMediaResponse } from '$lib/utils/socialMediaUtils';
	import MapExportJson from '$lib/components/ui/map/MapExportJson.svelte';
	import MapDataInsights from './MapDataInsights.svelte';
	import { user } from '$lib/stores/authStore';
	import { formatCoordinates, getUserLocation } from '$lib/utils/locationUtils';

	// Default Data...
	let showLoadingOverlay = false;
	let overlayLoadingText = 'Loading';
	let searchQuery: string = '';
	let socialMediaIcons;
	let circle;
	let map: mapboxgl.Map;
	let mapContainer: HTMLElement;
	let geocoder: MapboxGeocoder; // Declare geocoder variable
	let showSidebar = false;
	let reqId: number;
	let reqLat: number;
	let reqLong: number;
	let request_id: number;
	let showErrorDialog = false;
	let errorResponse = {};

	let lastSseId = 0;

	const rawRadius = getDataFromURL('radius');
	const radiusValue = [parseInt(rawRadius, 10) || 1];
	const radiusValueInMeters = radiusValue[0] * 1000;

	let hasMounted = false;

	dataLoadingState.set(
		Object.fromEntries(SOCIAL_MEDIA_PLATFORMS.map(({ slug }) => [slug, 'initial']))
	);

	/**
	 * A boolean variable that indicates the visibility state of a sidebar component.
	 *
	 * When set to `true`, the sidebar is visible to the user.
	 * When set to `false`, the sidebar is hidden.
	 */
	let isSidebarVisible = false;

	let mapMarker = null; // set by onclick on a map

	// Markers for social media types
	let markers: { [key: string]: mapboxgl.Marker[] } = {};

	// Map service
	const mapService = new MapService();

	/**
	 * A variable that holds the unsubscribe function returned by the subscription to the `page` store.
	 * The subscription listens to changes in the `$page` object, particularly to retrieve the `search`
	 * query parameter from the URL's `searchParams`. This value is assigned to the `searchQuery` variable.
	 *
	 * Calling the `unsubscribe` function stops the subscription and prevents further updates to the
	 * `$page` object.
	 */
	const unsubscribe = page.subscribe(($page) => {
		searchQuery = $page.url.searchParams.get('search') || '';
		reqId = $page.url.searchParams.get('req_id') || '';
		reqLat = $page.url.searchParams.get('lat') || '';
		reqLong = $page.url.searchParams.get('long') || '';
		request_id = $page.url.searchParams.get('request_id') || '';

		// save request id to store, to use in the save search popup.
		searchRequestID.set(Number(request_id || reqId));
	});

	$: mode = getDataFromURL('mode');
	$: request_id = getDataFromURL('request_id');
	$: if(hasMounted && mode === 'agent' && request_id > 0) {
		console.log('request_id', request_id);
				
		const search = getDataFromURL('search');
		// Handle search query if it exists
		if (search) {
			geocoder.setInput(search);
			geocoder.query(search);
		} else {
			geocoder.setInput(formatCoordinates(reqLong, reqLat));
			geocoder.query(formatCoordinates(reqLong, reqLat));
		}


		// Store coordinates in localStorage
		localStorage.setItem('lat', reqLat);
		localStorage.setItem('lng', reqLong);
		console.log("local set - done");
		renderGeocoder();
		console.log("geocoder end - done");
	}

	/**
	 * Creates a custom style switcher control for a Mapbox map, allowing users
	 * to dynamically switch map styles from a dropdown menu.
	 *
	 * This control includes a dropdown selector populated with available themes
	 * and applies the selected style to the map. The control also updates the
	 * URL with the chosen theme for persistence and resets when removed from the map.
	 *
	 * @return {Object} A new instance of the StyleSwitcherControl class, which can be added to a Mapbox map as a control to switch map styles.
	 */
	function createStyleSwitcherControl() {
		class StyleSwitcherControl {
			onAdd(map) {
				this.map = map;
				this.container = document.createElement('div');
				this.container.className =
					'mapboxgl-ctrl mapboxgl-ctrl-group cyberglobes-map-control relative bottom-9 sm:bottom-14';

				const mapActiveTheme = getDataFromURL('theme');
				const select = this.createStyleSelector(mapActiveTheme);
				this.container.appendChild(select);
				return this.container;
			}

			// Create Style Switch Dropdown
			createStyleSelector(mapActiveTheme) {
				const select = document.createElement('select');
				select.className = 'style-switcher p-3 shadow-md rounded-md bg-white dark:bg-gray-950';

				MAPBOX_THEMES.forEach(({ style, name }) => {
					const option = document.createElement('option');
					option.value = style;
					option.textContent = name;
					option.selected = `mapbox://styles/mapbox/${mapActiveTheme}` === style;
					select.appendChild(option);

					if (option.selected) {
						map.setStyle(style);
					}
				});

				select.addEventListener('change', this.handleStyleChange.bind(this));
				return select;
			}

			// Handle theme change
			handleStyleChange(event) {
				let selectedStyle = event.target.value;
				map.setStyle(selectedStyle);

				// Extract theme name and update URL
				const theme = selectedStyle.replace('mapbox://styles/mapbox/', '');
				putDataInURL('theme', theme);
			}

			// Reset when a map removed!
			onRemove() {
				this.container.parentNode.removeChild(this.container);
				this.map = undefined;
			}
		}

		return new StyleSwitcherControl();
	}

	/**
	 * Creates a full-screen control for a Mapbox map.
	 *
	 * The full-screen control allows the user to toggle full-screen mode
	 * for the specified map container. It includes a button with an SVG icon
	 * that triggers the full-screen functionality when clicked.
	 *
	 * @return {Object} An instance of FullScreenControl, which can be added to a Mapbox map.
	 */
	function createFullScreenControl() {
		class FullScreenControl {
			onAdd(map) {
				this.map = map;
				this.container = document.createElement('div');
				this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group cyberglobes-map-control';
				const button = this.createFullScreenButton();
				this.container.appendChild(button);
				return this.container;
			}

			createFullScreenButton() {
				const button = document.createElement('button');
				button.className =
					'mapboxgl-ctrl-icon mapboxgl-ctrl-fullscreen cyberglobes-map-control-btn';
				button.type = 'button';
				button.title = 'Toggle Fullscreen';
				button.style.padding = '2px';
				button.innerHTML =
					'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 9V6a2 2 0 0 1 2-2h3m11 11v3a2 2 0 0 1-2 2h-3m0-16h3a2 2 0 0 1 2 2v3M9 20H6a2 2 0 0 1-2-2v-3"/></svg>';

				button.onclick = () => {
					toggleFullScreen('map-container');
				};

				return button;
			}

			onRemove() {
				this.container.parentNode.removeChild(this.container);
				this.map = undefined;
			}
		}

		return new FullScreenControl();
	}

	// Add Reset Map to Center controller
	function createResetMapControl() {
		class ResetMapControl {
			onAdd(map) {
				this.map = map;
				this.container = document.createElement('div');
				this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group cyberglobes-map-control';
				const button = this.createResetMapControlBtn();
				this.container.appendChild(button);
				return this.container;
			}

			createResetMapControlBtn() {
				const button = document.createElement('button');
				button.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-resetBtn cyberglobes-map-control-btn';
				button.type = 'button';
				button.title = 'Center Results';
				button.style.padding = '2px';
				button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 16v-2.5q0-.625.438-1.062T13.5 12H16v1.5h-2.5V16zm1.5 6q-.625 0-1.062-.437T12 20.5V18h1.5v2.5H16V22zm7-6v-2.5H18V12h2.5q.625 0 1.063.438T22 13.5V16zM18 22v-1.5h2.5V18H22v2.5q0 .625-.437 1.063T20.5 22zm2.775-12H18.7q-.65-2.2-2.475-3.6T12 5Q9.075 5 7.037 7.038T5 12q0 1.8.813 3.3T8 17.75V15h2v6H4v-2h2.35Q4.8 17.75 3.9 15.938T3 12q0-1.875.713-3.512t1.924-2.85t2.85-1.925T12 3q3.225 0 5.663 1.988T20.775 10"/></svg>`;

				button.onclick = () => {
					centerMapOnCircle();
				};

				return button;
			}

			onRemove() {
				this.container.parentNode.removeChild(this.container);
				this.map = undefined;
			}
		}

		return new ResetMapControl();
	}

	/**
	 * Centers the map view on a circular area defined by coordinates.
	 * This method ensures the map displays the entire circular area
	 * by fitting its bounds to the map view with padding applied.
	 *
	 * @return {void} No return value. Logs an error if the `circle` object
	 *                or its required properties are undefined or invalid.
	 */
	function centerMapOnCircle() {
		if (!circle || !circle.geometry || !circle.geometry.coordinates) {
			console.error('Error: circle is undefined or missing required properties.');
			return;
		}

		// Fit map bounds
		const bounds = circle.geometry.coordinates[0].reduce(
			(bounds, coord) => bounds.extend(coord),
			new mapboxgl.LngLatBounds(
				circle.geometry.coordinates[0][0],
				circle.geometry.coordinates[0][0]
			)
		);
		map.fitBounds(bounds, { padding: 20 });
	}

	onMount(() => {
		mapDataLoaded.set(false);

		mapboxgl.accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;

		map = new mapboxgl.Map({
			container: mapContainer, // Container ID
			style: 'mapbox://styles/mapbox/streets-v12', // Map style to use
			center: [-122.25948, 37.87221], // Starting position [lng, lat]
			zoom: 12 // Starting zoom level
		});

	
		geocoder = new MapboxGeocoder({
			accessToken: mapboxgl.accessToken,
			localGeocoder: parseCoordinates,
			mapboxgl: mapboxgl,
			marker: false,
			placeholder: 'Search by lng,lat or address...'
		});

		map.addControl(geocoder);

		// Now that map and geocoder exist, we can handle getUserLocation
		getUserLocation()
            .then(position => {
                let lng = position.coords.longitude;
                let lat = position.coords.latitude;
                const coords = [lng, lat];
                
                // Center map and add marker
                map.setCenter(coords);
                map.setZoom(14);

                new mapboxgl.Marker().setLngLat(coords).addTo(map);

				const search = getDataFromURL('search');
                
                // Store coordinates in localStorage
                localStorage.setItem('lat', lat);
                localStorage.setItem('lng', lng);

                // Handle search query if it exists
                if (search) {
                    geocoder.setInput(search);
                    geocoder.query(search);
                } else {
					geocoder.setInput(formatCoordinates(lng, lat));
					geocoder.query(formatCoordinates(lng, lat));
				}
            })
            .catch(error => {
                console.error("Geolocation error:", error.message);
                alert('Unable to retrieve your location: ' + error.message);
            });

		map.addControl(
			new mapboxgl.NavigationControl({
				showCompass: false,
				showZoom: true
			}),
			'top-right'
		);

		map.addControl(createStyleSwitcherControl(), 'bottom-right');
		map.addControl(createFullScreenControl(), 'top-right');

		map.on('load', () => {
			showErrorDialog = false;
			errorResponse = {};

			map.addSource('single-point', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: []
				}
			});

			map.addLayer({
				id: 'point',
				source: 'single-point',
				type: 'circle',
				paint: {
					'circle-radius': 10,
					'circle-color': MAP_PRIMARY_COLOR
				}
			});

			map.addSource('circle', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: []
				}
			});

			map.addLayer({
				id: 'line',
				source: 'circle',
				type: 'line',
				paint: {
					'line-color': MAP_PRIMARY_COLOR,
					'line-width': 2
				}
			});

			hasMounted = true;

			renderGeocoder();

			if (searchQuery) {
				geocoder.query(searchQuery);
				const activeSuggestion = document.querySelector('.suggestions');
				if (activeSuggestion) {
					setTimeout(() => {
						activeSuggestion.style.display = 'none';
					}, 500);
				}
			}

			// const handleResults = (event) => {
			// 	const firstSuggestion = event.features[0];
			// 	if(undefined === firstSuggestion) {
			// 		return;
			// 	}
			// 	geocoder.setInput(firstSuggestion.place_name);
			// 	geocoder.query(firstSuggestion.place_name);
			// 	geocoder.off('results', handleResults);
			// };

			// geocoder.off('results', handleResults);
			// geocoder.on('results', handleResults);
		});
	});

	function renderGeocoder() {
		geocoder.on('result', async (event: any) => {
				if (event.result && event.result.center) {
					// check if url contains mode=agent
					let mode = "";
					if (getDataFromURL('mode') && getDataFromURL('mode') === 'agent') {
						mode = 'agent';
					}

					// reload url, when user re-search location
					if($mapDataLoaded === true) {
						putDataInURL('search', event.result.place_name);
						window.location.reload();
						return;
					}
					mapDataLoaded.set(false);
					resetMap(map, mapMarker);

					// Clear previous markers
					Object.keys(markers).forEach((key) => {
						markers[key].forEach((marker) => marker.remove());
					});
					markers = {};

					// Reset visibility
					SOCIAL_MEDIA_PLATFORMS.forEach(({ slug }) => {
						visibility.update((state) => ({ ...state, [slug]: false }));
					});

					// Set loading state
					SOCIAL_MEDIA_PLATFORMS.forEach(({ slug }) => {
						dataLoadingState.update((state) => ({ ...state, [slug]: 'loading' }));
					});

					// extract lat/lng, address
					const address = event.result.place_name;
					const [lng, lat] = event.result.center;

					// update url
					putDataInURL('search', address);
					putDataInURL('lat', lat);
					putDataInURL('long', lng);

					// Fly to a new location
					map.flyTo({
						center: [lng, lat],
						zoom: 14,
						essential: true // make animation smooth
					});

					// Add pulsing dot effect
					addPulsingDotAnimation(map, [lng, lat]);

					// Create radius circle
					circle = addCircleRadius(map, [lng, lat], turf, radiusValueInMeters);

					// map.addControl(createResetMapControl(), 'top-right');

					let searchId = 0;
					if(mode !== "agent") {
						// Prepare payload for API request
						let payload = {
							address,
							latitude: lat,
							longitude: lng,
							features: SOCIAL_MEDIA_PLATFORMS.map(({ slug }) => slug)
						};

						// Use features from URL if available
						if (getDataFromURL('features[]') && getDataFromURL('features[]').length > 0) {
							payload.features = getDataFromURL('features[]');
						}

						if (getDataFromURL('radius')) {
							payload.radius = getDataFromURL('radius');
						}

						if (getDataFromURL('resolution')) {
							payload.resolution = getDataFromURL('resolution');
						}

						if (getDataFromURL('timeframe')) {
							payload.timeframe = getDataFromURL('timeframe');
							if (payload.timeframe === 'custom') {
								payload.from = getDataFromURL('from');
								payload.to = getDataFromURL('to');
							}
						}

						// xFilters from url
						// check if features are in url and contains x-twitter
						if (payload.features && payload.features.includes('x-twitter')) {
							if (getDataFromURL('xKeywords')) {
								payload.xKeywords = getDataFromURL('xKeywords');
							}
							if (getDataFromURL('xUsernames')) {
								payload.xUsernames = getDataFromURL('xUsernames');
							}
							if (getDataFromURL('xPostTypes[]') && getDataFromURL('xPostTypes[]').length > 0) {
								payload.xPostTypes = getDataFromURL('xPostTypes[]');
							}
						} else {
							removeDataFromURL('xKeywords');
							removeDataFromURL('xUsernames');
							removeDataFromURL('xPostTypes[]');
						}

						// Facebook filters from url
						// check if features are in url and contains facebook
						if (payload.features && payload.features.includes('facebook')) {
							if (getDataFromURL('fbKeywords')) {
								payload.fbKeywords = getDataFromURL('fbKeywords');
							}
							if (getDataFromURL('fbPostTypes[]') && getDataFromURL('fbPostTypes[]').length > 0) {
								payload.fbPostTypes = getDataFromURL('fbPostTypes[]');

								if (payload.fbPostTypes.includes('posts')) {
									payload.fbPublicPosts = getDataFromURL('fbPublicPosts');
									payload.fbRecentPosts = getDataFromURL('fbRecentPosts');
								}

								if (payload.fbPostTypes.includes('users')) {
									payload.fbEducationId = getDataFromURL('fbEducationId');
									payload.fbWorkId = getDataFromURL('fbWorkId');
								}

								if (payload.fbPostTypes.includes('pages')) {
									payload.fbCategoryId = getDataFromURL('fbCategoryId');
								}
							}
						} else {
							removeDataFromURL('fbKeywords');
							removeDataFromURL('fbPostTypes[]');
							removeDataFromURL('fbPublicPosts');
							removeDataFromURL('fbRecentPosts');
							removeDataFromURL('fbEducationId');
							removeDataFromURL('fbWorkId');
							removeDataFromURL('fbCategoryId');
						}

						// Facebook Marketplace filters from url
						// check if features are in url and contains facebook-marketplace
						if (payload.features && payload.features.includes('facebook-marketplace')) {
							if (getDataFromURL('fbmKeywords')) {
								payload.fbmKeywords = getDataFromURL('fbmKeywords');
							}

							if (getDataFromURL('fbmCategoryId') && getDataFromURL('fbmCategoryId').length > 0) {
								payload.fbmCategoryId = getDataFromURL('fbmCategoryId');
							}

							if (getDataFromURL('fbmMinPrice')) {
								payload.fbmMinPrice = getDataFromURL('fbmMinPrice');
							}

							if (getDataFromURL('fbmMaxPrice')) {
								payload.fbmMaxPrice = getDataFromURL('fbmMaxPrice');
							}

							if (getDataFromURL('fbmSort')) {
								payload.fbmSort = getDataFromURL('fbmSort');
							}
						} else {
							removeDataFromURL('fbmKeywords');
							removeDataFromURL('fbmCategoryId');
							removeDataFromURL('fbmMinPrice');
							removeDataFromURL('fbmMaxPrice');
							removeDataFromURL('fbmSort');
						}

						if (!request_id && !reqId) {
							// Fetch data
							const response = await mapService.getMapResults(payload);
							if (!response.success) {
								// show MapError Dialog
								showErrorDialog = true;
								errorResponse = response;
								return false;
							}

							searchId = response.search_id;
						}
					} // mode !== "agent"

					if (reqId && reqId > 0) {
						searchId = reqId;
					}

					if (request_id && request_id > 0) {
						if(mode === "agent") {
							removeDataFromURL('request_id');
							removeDataFromURL('mode');
						}
						searchId = request_id;
					}

					// Show sidebar
					showSidebar = true;
					isSidebarVisible = true;

					centerMapOnCircle();

					if (searchId < 1 && mode !== "agent") {
						// show MapError Dialog
						showErrorDialog = true;
						errorResponse = {
							success: false,
							message: 'No search results found.',
							error: 'No search results found.'
						};
						return false;
					}

					if(searchId > 0 && searchId !== lastSseId) {
						lastSseId = searchId;
						searchRequestID.set(Number(searchId));

						// Start SSE
						const source = new EventSource(`${API_BASE_URL}map/search-sse/${searchId}/?mode=${mode}`);
						let socialData = [];

						let addedPostIds = [];
						// update the respective state for each platform.
						SOCIAL_MEDIA_PLATFORMS.map(({ slug }) => {
							// Clear existing markers for the platform before adding new ones
							if (markers[slug]) {
								markers[slug].forEach((marker) => marker.remove());
							}
							markers[slug] = [];

							let markersForType: mapboxgl.Marker[] = [];

							source.addEventListener(slug, function (e) {
								// update loading state
								dataLoadingState.update((state) => ({ ...state, [slug]: 'done' }));

								// Parse data to display
								const data = JSON.parse(e.data);

								const parsedData = parseSocialMediaResponse(data, slug);
								socialData.push(parsedData);
								socialMediaJson.update((state) => {
									const updatedSocialData = [...(state.socialData || []), parsedData];
									return { ...state, socialData: updatedSocialData };
								});

								// Visibility
								visibility.update((state) => ({ ...state, [slug]: true }));

								// Add markers
								socialData.forEach(({ type, count, posts }) => {
									if (slug !== type) return;

									let pointsAdded = 0;
									if (slug === 'x-twitter') {
										const twitterPosts = Object.entries(posts);
										twitterPosts[0][1].forEach((post) => {
											if (slug !== type) return;
											if (addedPostIds.includes(post.id)) return false;

											const randomPoints = generateRandomValidPoints(1, circle);
											const randomPoint = randomPoints[0];
											if (randomPoint && randomPoint.length === 2) {
												const mapIcon = post?.historical
													? SOCIAL_MEDIA_PLATFORMS.find((platform) => platform.slug === slug)
															?.mapIconHistorical
													: SOCIAL_MEDIA_PLATFORMS.find((platform) => platform.slug === slug)
															?.mapIcon;
												markersForType[post.id] = createMarker(
													mapIcon,
													[randomPoint[0], randomPoint[1]] as [number, number],
													$visibility[slug],
													post
												);
												pointsAdded++;

												addedPostIds.push(post.id);
											}
										});
										markers[type] = markersForType;
									} else if (slug === 'facebook') {
										const fbPosts = Object.entries(posts);
										if (!fbPosts.length) return;
										fbPosts[0][1].forEach((post) => {
											if (slug !== type) return;
											if (addedPostIds.includes(post.id)) return false;

											const randomPoints = generateRandomValidPoints(1, circle);
											const randomPoint = randomPoints[0];
											if (randomPoint && randomPoint.length === 2) {
												const mapIcon = post?.historical
													? SOCIAL_MEDIA_PLATFORMS.find((platform) => platform.slug === slug)
															?.mapIconHistorical
													: SOCIAL_MEDIA_PLATFORMS.find((platform) => platform.slug === slug)
															?.mapIcon;
												markersForType[post.id] = createMarker(
													mapIcon,
													[randomPoint[0], randomPoint[1]] as [number, number],
													$visibility[slug],
													post
												);
												pointsAdded++;

												addedPostIds.push(post.id);
											}
										});
										markers[type] = markersForType;
									} else if (slug === 'facebook-marketplace') {
										if (!posts.length) return;
										posts.forEach((post) => {
											if (post && pointsAdded < count) {
												if (addedPostIds.includes(post.id)) return false;

												const randomPoints = generateRandomValidPoints(1, circle);
												const randomPoint = randomPoints[0];
												if (randomPoint && randomPoint.length === 2) {
													const mapIcon = post?.historical
														? SOCIAL_MEDIA_PLATFORMS.find((platform) => platform.slug === slug)
																?.mapIconHistorical
														: SOCIAL_MEDIA_PLATFORMS.find((platform) => platform.slug === slug)
																?.mapIcon;
													markersForType[post.id] = createMarker(
														mapIcon,
														[randomPoint[0], randomPoint[1]] as [number, number],
														$visibility[slug],
														post
													);
													pointsAdded++;

													addedPostIds.push(post.id);
												}
											}
										});
										markers[type] = markersForType;
									} else {
										const validPosts = filterValidPosts(posts, circle);
										validPosts.forEach((post) => {
											if (post && pointsAdded < count) {
												const mapIcon = post?.historical
													? SOCIAL_MEDIA_PLATFORMS.find((platform) => platform.slug === slug)
															?.mapIconHistorical
													: SOCIAL_MEDIA_PLATFORMS.find((platform) => platform.slug === slug)
															?.mapIcon;
												markersForType[post.id] = createMarker(
													mapIcon,
													[post.lng, post.lat],
													$visibility[slug],
													post
												);

												pointsAdded++;
											}
										});

										const invalidPosts = posts.filter(
											(post) => post && !validPosts.some((validPost) => validPost.id === post.id)
										);
										invalidPosts.forEach((post) => {
											if (slug !== type) return;
											if (post && pointsAdded < count) {
												const randomPoints = generateRandomValidPoints(1, circle);
												const randomPoint = randomPoints[0];
												if (randomPoint && randomPoint.length === 2) {
													const mapIcon = post?.historical
														? SOCIAL_MEDIA_PLATFORMS.find((platform) => platform.slug === slug)
																?.mapIconHistorical
														: SOCIAL_MEDIA_PLATFORMS.find((platform) => platform.slug === slug)
																?.mapIcon;
													markersForType[post.id] = createMarker(
														mapIcon,
														[randomPoint[0], randomPoint[1]] as [number, number],
														$visibility[slug],
														post
													);
													pointsAdded++;
												}
											}
										});

										markers[type] = markersForType;
									}
								});
							});

							// Handle errors
							source.addEventListener(`${slug}_error`, function (e) {
								dataLoadingState.update((state) => ({ ...state, [slug]: 'error' }));
							});
						});

						// SSE global error handler
						source.addEventListener('error', function (e) {
							const data = JSON.parse(e.data);
							source.close();
							showErrorDialog = true;
							errorResponse = {
								success: false,
								message: data.message,
								error: data.error
							};

							return false;
						});

						// SSE complete event
						source.addEventListener('done', function (e) {
							// close the SSE
							source.close();

							// show button to export the data into the JSON
							mapDataLoaded.set(true);

							// notify user that, request fetching is done.
							toast('🚀 All set! Explore the data now.', { position: 'bottom-center' });

							// Add Static dot to indicate that the response is complete.
							map.addSource('static-dot', {
								type: 'geojson',
								data: {
									type: 'FeatureCollection',
									features: [
										{
											type: 'Feature',
											geometry: {
												type: 'Point',
												coordinates: [lng, lat] // Longitude, latitude
											},
											properties: {}
										}
									]
								}
							});
							map.addLayer({
								id: 'static-dot-layer',
								source: 'static-dot',
								type: 'circle',
								paint: {
									'circle-radius': 10,
									'circle-color': MAP_PRIMARY_COLOR,
									width: 200,
									height: 200
								}
							});

							// Remove the animation dot
							map.removeLayer('layer-with-pulsing-dot');
						});
					}
				}

				// mapDataLoaded.set(true); // show icons to export data
				isSidebarVisible = true; // show sidebar wrapper
				showSidebar = true; // show the content inside the sidebar

				// get lat and lng from the event
				const coordinates = event.result.geometry.coordinates;
				const lng = coordinates[0];
				const lat = coordinates[1];
				// store in local storage
				localStorage.setItem('lat', lat);
				localStorage.setItem('lng', lng);
			});

			const handleResults = (event) => {
				// First check if we have results
				if (!event.features || event.features.length === 0) {
					return;
				}
				
				// Remove the event handler immediately to prevent recursion
				geocoder.off('results', handleResults);
				
				const firstSuggestion = event.features[0];
				
				// Set input but don't trigger additional queries
				geocoder.setInput(firstSuggestion.place_name);
				
				// Hide the suggestions dropdown immediately
				const suggestionsEl = document.querySelector('.mapboxgl-ctrl-geocoder .suggestions');
				if (suggestionsEl) {
					suggestionsEl.style.display = 'none';
				}
				
				// Debounce the actual selection to avoid too many API calls
				clearTimeout(window._geocoderTimeout);
				window._geocoderTimeout = setTimeout(() => {
					// Create a simplified result object
					const resultEvent = {
					result: {
						place_name: firstSuggestion.place_name,
						center: firstSuggestion.center,
						geometry: firstSuggestion.geometry,
						properties: firstSuggestion.properties,
						id: firstSuggestion.id,
						text: firstSuggestion.text
					}
					};
					
					// Trigger the result event manually
					geocoder._eventEmitter.emit('result', resultEvent);
				}, 300); // Add a delay to prevent rapid API calls
				};

				// Set up the event handler when needed, not continuously
				geocoder.off('results', handleResults);
				geocoder.on('results', handleResults);
	}

	onDestroy(() => {
		if (map) {
			map.remove();
		}

		unsubscribe();
	});

	function createMarker(
		icon: string,
		coordinates: [number, number],
		isVisible: boolean,
		post: number
	): mapboxgl.Marker {
		const el = document.createElement('div');
		el.className = SOCIAL_MARKER_CLASS;
		el.innerHTML = icon;
		el.style.fontSize = MARKER_FONT_SIZE;
		el.style.display = !isVisible ? 'none' : 'block';
		el.style.cursor = 'pointer';
		el.id = post.toString();

		// Ensure the map instance is valid before adding marker
		if (!map || !map.getCanvasContainer()) {
			console.error('Map instance is not ready.');
			return null;
		}

		// Add click event to highlight the associated sidebar item
		el.addEventListener('click', (event) => {
			event.stopPropagation();
			hoveredPostId.set(post.id);
		});

		// Create the marker
		return new mapboxgl.Marker(el).setLngLat(coordinates).addTo(map);
	}

	function filterValidPosts(posts: { lat: number; lng: number }[], shape: any) {
		return posts.filter((post) => {
			if (post && post.lat !== null && post.lng !== null) {
				return true;
			}
		});
	}

	function generateRandomValidPoints(count: number, circle: any) {
		const points = [];
		while (points.length < count) {
			const randomPoints = turf.randomPoint(count - points.length, { bbox: turf.bbox(circle) });

			randomPoints.features.forEach((feature) => {
				if (turf.booleanPointInPolygon(feature, circle)) {
					points.push(feature.geometry.coordinates);
				}
			});
		}

		return points;
	}

	/**
	 * Toggles the visibility of markers for a specified type.
	 *
	 * @param {string} type - The type of markers whose visibility needs to be toggled.
	 * @return {void} This function does not return a value.
	 */
	function toggleVisibility(type: string) {
		// Update the visibility object
		$visibility[type] = !$visibility[type];

		// Show or hide markers
		Object.values(markers[type]).forEach((marker) => {
			marker.getElement().style.display = $visibility[type] ? 'block' : 'none';
		});
	}

	/**
	 * Toggles the visibility of the sidebar and adjusts the map size accordingly.
	 *
	 * @return {void} Does not return a value.
	 */
	function toggleSidebar() {
		isSidebarVisible = !isSidebarVisible;
		setTimeout(() => {
			map.resize();
		}, 100);
	}
</script>

<svelte:head>
	<link href="https://api.tiles.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" rel="stylesheet" />
	<link
		href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.2/mapbox-gl-geocoder.css"
		rel="stylesheet"
	/>
</svelte:head>

<ErrorDialog bind:isOpen={showErrorDialog} error={errorResponse} />
<LoadingOverlay isLoading={showLoadingOverlay} loadingText={overlayLoadingText} />
<div
	class={`h-screen flex flex-col ${isSidebarVisible ? 'sidebar-visible' : ''}`}
	id="map-container"
>
	<!-- Topbar -->
	<MapTopbar
		{isSidebarVisible}
		{showSidebar}
		{socialMediaIcons}
		toggleSidebarVisibility={toggleSidebar}
		{toggleVisibility}
	/>

	<div class="flex h-full flex-1 relative">
		{#if showSidebar}
			<!-- Sidebar -->
			<div class="sidebar {isSidebarVisible ? 'visible' : ''}">
				<MapSidebarV1 {isSidebarVisible} {markers} {map} hasChatbot={true} />
			</div>
		{/if}

		<div class="h-full relative flex-1">
			<!-- Map Area -->
			<div bind:this={mapContainer} id="map"></div>
		</div>
	</div>
</div>

{#if $mapDataLoaded && $user}
	<MapExportJson />
	<MapDataInsights />
{/if}

<style>
	.social-marker {
		display: flex;
		align-items: center;
		justify-content: center;
		background: white;
		border-radius: 50%;
		width: 30px;
		height: 30px;
		text-align: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.icon {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.icon svg {
		fill: white !important;
	}

	.bounce-animation {
		animation: bounce 0.6s ease forwards;
	}

	@keyframes bounce {
		0% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px); /* Move up by 10px */
		}
		100% {
			transform: translateY(0); /* Return to original position */
		}
	}

	.style-switcher {
		background: white;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 5px;
		font-size: 14px;
	}

	.sidebar {
		width: 30vw;
		top: 0;
		left: 0;
		height: 100%;
		background-color: #f9f9f9;
		transition: transform 0.3s ease;
		transform: translateX(-100%);
		box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
		z-index: 1;
		position: absolute;
		border-radius: 4px;
	}

	.sidebar.visible {
		transform: translateX(0);
	}

	#map {
		position: absolute;
		width: 100%;
		height: 100%;
		transition: margin-left 0.3s ease;
	}

	.sidebar-visible #map {
		width: calc(100% - 30vw);
		margin-left: 30vw; /* Same width as the sidebar */
	}
</style>