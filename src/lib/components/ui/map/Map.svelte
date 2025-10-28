<script lang="ts">
	// Svelte
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';

	// Mapbox
	import mapboxgl from 'mapbox-gl';
	import * as turf from '@turf/turf';

	// Environment variables
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';

	// Constants
	import {
		MAP_DEFAULT_LOCATION,
		MAP_PRIMARY_COLOR,
		MAPBOX_THEMES,
		MARKER_FONT_SIZE,
		SOCIAL_MARKER_CLASS,
		SOCIAL_MEDIA_PLATFORMS,
		USER_LAT,
		USER_LNG
	} from '$lib/constants/constants';

	// Utility functions
	import {
		getDataFromURL,
		putDataInURL,
		removeDataFromURL,
		toggleFullScreen
	} from '$lib/utils/generalUtils';
	import { clearReceivedPoints } from '$lib/stores/mapStore';

	// UI Components
	import LoadingOverlay from '$lib/components/ui/spinners/LoadingOverlay.svelte';

	// Icon Component
	import MapSidebar from '$lib/components/ui/map/MapSidebar.svelte';
	import {
		dataLoadingState,
		hoveredPostId,
		mapDataLoaded,
		searchRequestID,
		visibility,
		locationUpdate,
		receivedPoints
	} from '$lib/stores/mapStore';
	import ErrorDialog from '$lib/components/general/dialog/ErrorDialog.svelte';
	import MapExportJson from '$lib/components/ui/map/MapExportJson.svelte';
	import MapDataInsights from './MapDataInsights.svelte';
	import { user } from '$lib/stores/authStore';

	// Default Data...
	let showLoadingOverlay = false;
	let overlayLoadingText = 'Loading';
	let circle;
	let map: mapboxgl.Map;
	let mapContainer: HTMLElement;
	let reqId: number;
	let reqLat: number;
	let reqLong: number;
	let request_id: number;
	let showErrorDialog = false;
	let errorResponse = {};

	let hasMounted = false;

	dataLoadingState.set(
		Object.fromEntries(SOCIAL_MEDIA_PLATFORMS.map(({ slug }) => [slug, 'initial']))
	);

	/**
	 * A boolean variable that indicates the visibility state of a sidebar component.
	 * Always set to true since we want the sidebar to always be visible.
	 */
	let isSidebarVisible = true;

	let mapMarker = null; // set by onclick on a map
	let initialMarker = null; // marker created on initial mount

	// Markers for social media types
	let markers: { [key: string]: mapboxgl.Marker[] } = {};

	// Markers for received points  
	let pointMarkers: mapboxgl.Marker[] = [];

	// Map to track point markers by their IDs
	let pointMarkersMap: { [key: string]: mapboxgl.Marker } = {};

	/**
	 * A variable that holds the unsubscribe function returned by the subscription to the `page` store.
	 * The subscription listens to changes in the `$page` object, particularly to retrieve URL parameters
	 * for the map functionality.
	 *
	 * Calling the `unsubscribe` function stops the subscription and prevents further updates to the
	 * `$page` object.
	 */
	const unsubscribe = page.subscribe(($page) => {
		reqId = $page.url.searchParams.get('req_id') || '';
		reqLat = $page.url.searchParams.get('lat') || '';
		reqLong = $page.url.searchParams.get('long') || '';
		request_id = $page.url.searchParams.get('request_id') || '';

		// save request id to store, to use in the save search popup.
		searchRequestID.set(Number(request_id || reqId));
	});

	$: request_id = getDataFromURL('request_id');

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

	onMount(() => {
		mapDataLoaded.set(false);

		mapboxgl.accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;

		// Check if user coordinates are stored in localStorage
		const storedLat = localStorage.getItem(USER_LAT);
		const storedLng = localStorage.getItem(USER_LNG);
		
		let mapCenter;
		
		if (storedLat && storedLng) {
			// Use stored coordinates if available
			mapCenter = [parseFloat(storedLng), parseFloat(storedLat)];
		} else {
			// Use default location if no stored coordinates
			mapCenter = [MAP_DEFAULT_LOCATION.lng, MAP_DEFAULT_LOCATION.lat];
		}

		map = new mapboxgl.Map({
			container: mapContainer, // Container ID
			style: 'mapbox://styles/mapbox/streets-v12', // Map style to use
			center: mapCenter, // Starting position [lng, lat]
			zoom: storedLat && storedLng ? 14 : 12 // Zoom in more if showing user location
		});

		// Add a marker for the initial location
		initialMarker = new mapboxgl.Marker().setLngLat(mapCenter).addTo(map);

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
		});
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}

		unsubscribe();
	});

	/**
	 * Resets the map by removing all markers, clearing sources, and resetting view to initial state
	 */
	function resetMapData() {
		if (!map) return;

		// Remove all social media markers
		Object.values(markers).forEach(markerArray => {
			markerArray.forEach(marker => marker.remove());
		});
		markers = {};

		// Remove all point markers
		pointMarkers.forEach(marker => marker.remove());
		pointMarkers = [];
		pointMarkersMap = {};

		// Remove the main map marker if it exists
		if (mapMarker) {
			mapMarker.remove();
			mapMarker = null;
		}

		// Remove the initial marker if it exists
		if (initialMarker) {
			initialMarker.remove();
			initialMarker = null;
		}

		// Clear circle data
		if (map.getSource('circle')) {
			map.getSource('circle').setData({
				features: []
			});
		}

		// Clear single-point data
		if (map.getSource('single-point')) {
			map.getSource('single-point').setData({
				features: []
			});
		}

		circle = null;

		
		// Clear received points from store
		clearReceivedPoints();
	}

	/**
	 * Flies the map to a new location and adds a marker
	 */
	function flyToLocationAndAddMarker(lat: number, lng: number) {
		if (!map) return;

		const coordinates = [lng, lat];

		// Remove the initial marker since we're going to a new location
		if (initialMarker) {
			initialMarker.remove();
			initialMarker = null;
		}

		// Fly to the new location
		map.flyTo({
			center: coordinates,
			zoom: 14,
			speed: 1.2,
			curve: 1.5,
			essential: true
		});

		// Add a new marker at the location
		mapMarker = new mapboxgl.Marker()
			.setLngLat(coordinates)
			.addTo(map);
	}

	// Subscribe to location updates from chatbot
	$: if ($locationUpdate && hasMounted) {
		const { latitude, longitude } = $locationUpdate;
		if (latitude !== undefined && longitude !== undefined) {
			resetMapData();
			flyToLocationAndAddMarker(latitude, longitude);
			// Reset the store value to prevent duplicate calls
			locationUpdate.set(null);
		}
	}

	// Subscribe to received points updates
	$: if ($receivedPoints && $receivedPoints.length > 0 && hasMounted) {
		addPointsToMap($receivedPoints);
	}

	/**
	 * Creates a marker for a received point using the panoids-pin.svg icon
	 */
	function createPointMarker(point: any): mapboxgl.Marker {
		const el = document.createElement('div');
		el.className = 'point-marker';
		el.innerHTML = `<svg width="35" height="35" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M16.2174 2.88104C14.3618 0.959467 11.9299 -0.000527252 9.49796 2.17244e-07C7.06762 0.000527687 4.63676 0.961051 2.78222 2.88104C-0.927405 6.7226 -0.927405 12.9512 2.78222 16.7928L9.49954 23.7492L16.2174 16.7928C19.9275 12.9512 19.9275 6.7226 16.2174 2.88104Z" fill="#2C7BE5"/>
			<path d="M15 9.5C15 12.5376 12.5376 15 9.5 15C6.46243 15 4 12.5376 4 9.5C4 6.46243 6.46243 4 9.5 4C12.5376 4 15 6.46243 15 9.5Z" fill="white"/>
		</svg>`;
		el.style.cursor = 'pointer';
		el.id = `point-${point.id}`;

		// Add click event to show popup with point information
		el.addEventListener('click', (event) => {
			event.stopPropagation();
			
			// Create popup content
			const popupContent = `
				<div class="p-3 max-w-xs">
					<h3 class="font-semibold text-sm mb-2">${point.title || 'Unknown Place'}</h3>
					${point.type ? `<p class="text-xs text-gray-600 mb-1">${point.type}</p>` : ''}
					${point.address ? `<p class="text-xs text-gray-500 mb-2">${point.address}</p>` : ''}
					${point.price ? `<p class="text-xs text-green-600 font-medium mb-1">Price: ${point.price}</p>` : ''}
					${point.phone ? `<p class="text-xs text-gray-500 mb-1">📞 ${point.phone}</p>` : ''}
					${point.url || point.website ? `<a href="${point.url || point.website}" target="_blank" class="text-xs text-blue-600 underline">Visit Website</a>` : ''}
				</div>
			`;
			
			// Create and show popup
			new mapboxgl.Popup({
				closeOnClick: true,
				closeButton: true,
				maxWidth: '300px'
			})
			.setLngLat([point.longitude, point.latitude])
			.setHTML(popupContent)
			.addTo(map);
		});

		// Create the marker
		return new mapboxgl.Marker(el)
			.setLngLat([point.longitude, point.latitude])
			.addTo(map);
	}

	/**
	 * Adds all received points as markers on the map
	 */
	function addPointsToMap(points: any[]) {
		// Clear existing point markers
		pointMarkers.forEach(marker => marker.remove());
		pointMarkers = [];
		pointMarkersMap = {};

		// Add new point markers
		points.forEach(point => {
			if (point.latitude && point.longitude) {
				const marker = createPointMarker(point);
				pointMarkers.push(marker);
				pointMarkersMap[point.id] = marker;
			}
		});
	}
</script>

<svelte:head>
	<link href="https://api.tiles.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<ErrorDialog bind:isOpen={showErrorDialog} error={errorResponse} />
<LoadingOverlay isLoading={showLoadingOverlay} loadingText={overlayLoadingText} />
<div
	class="h-screen flex sidebar-visible"
	id="map-container"
>
	<div class="flex h-full flex-1 relative">
		<!-- Sidebar - Always visible -->
		<div class="sidebar visible">
			<MapSidebar {isSidebarVisible} {markers} {map} {pointMarkersMap} hasChatbot={true} />
		</div>

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

	.point-marker {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.point-marker svg {
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
		transition: transform 0.2s ease;
	}

	.point-marker:hover svg {
		transform: scale(1.1);
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
