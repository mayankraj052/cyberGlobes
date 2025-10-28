<script>
	import Icon from '@iconify/svelte';
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';
	import { onMount, createEventDispatcher } from 'svelte';
	import { isLoggedIn } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { ACTION_TYPES, QUERY_BEFORE_LOGIN, USER_LAT, USER_LNG } from '$lib/constants/constants';

	const MAPBOX_SEARCH_BASE_URL = 'https://api.mapbox.com/search/searchbox/v1';
	const accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;
	const dispatch = createEventDispatcher();

	export let redirectOnSelect = true;
	export let placeholder = 'Search for city or address';
	export let showSearchButton = true;
	export let query = '';

	let suggestions = [];
	let showSuggestions = false;
	let suggestionListRef;
	let sessionToken = null;

	// Generate a UUID for session token
	function generateSessionToken() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			const r = Math.random() * 16 | 0;
			const v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	function buildMapboxSuggestURL(query) {
		return `${MAPBOX_SEARCH_BASE_URL}/suggest?q=${encodeURIComponent(query)}&language=en&limit=5&session_token=${sessionToken}&access_token=${accessToken}`;
	}

	function buildMapboxRetrieveURL(mapboxId) {
		return `${MAPBOX_SEARCH_BASE_URL}/retrieve/${mapboxId}?session_token=${sessionToken}&access_token=${accessToken}`;
	}

	// Fetch location suggestions using the new Search API
	async function fetchLocationSuggestions() {
		if (query.length <= 2) {
			suggestions = [];
			showSuggestions = false;
			return;
		}

		// Generate a new session token if we don't have one
		if (!sessionToken) {
			sessionToken = generateSessionToken();
		}

		try {
			const response = await fetch(buildMapboxSuggestURL(query));
			const data = await response.json();
			suggestions = data.suggestions || [];
			showSuggestions = suggestions.length > 0;
		} catch (error) {
			console.error('Error fetching location suggestions:', error);
		}
	}

	// Retrieve detailed information for a selected suggestion
	async function retrieveLocationDetails(mapboxId) {
		try {
			const response = await fetch(buildMapboxRetrieveURL(mapboxId));
			const data = await response.json();
			
			if (data.features && data.features.length > 0) {
				const feature = data.features[0];
				const coordinates = feature.geometry.coordinates;
				const properties = feature.properties;
				
				return {
					name: properties.name,
					full_address: properties.full_address,
					place_name: properties.full_address || properties.name,
					latitude: coordinates[1],
					longitude: coordinates[0],
					coordinates: properties.coordinates
				};
			}
			return null;
		} catch (error) {
			console.error('Error retrieving location details:', error);
			return null;
		}
	}

	// Handle click outside suggestion list
	function handleClickOutside(event) {
		if (
			suggestionListRef &&
			!suggestionListRef.contains(event.target) &&
			!event.target.matches('#location-input')
		) {
			showSuggestions = false;
		}
	}

	// Handle suggestion selection
	async function onSuggestionClick(suggestion) {
		// Retrieve detailed information using the mapbox_id
		const locationDetails = await retrieveLocationDetails(suggestion.mapbox_id);
		
		if (!locationDetails) {
			console.error('Failed to retrieve location details');
			return;
		}

		// Save selected location coordinates to localStorage
		localStorage.setItem(USER_LAT, locationDetails.latitude.toString());
		localStorage.setItem(USER_LNG, locationDetails.longitude.toString());
		
		if (redirectOnSelect) {
			if (!$isLoggedIn) {
				const payload = {
					action: ACTION_TYPES.SEARCH_BY_ADDRESS,
					query: locationDetails.place_name,
					latitude: locationDetails.latitude,
					longitude: locationDetails.longitude
				};
				localStorage.setItem(QUERY_BEFORE_LOGIN, JSON.stringify(payload));
				goto('/login?loginredirect=1');
				return;
			}

			window.location.href = '/try-demo';
		} else {
			query = locationDetails.place_name;
			showSuggestions = false;
			dispatch('select', {
				place_name: locationDetails.place_name,
				latitude: locationDetails.latitude,
				longitude: locationDetails.longitude
			});
		}
	}

	// Setup click outside event handler
	function setupClickOutsideHandler() {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}

	// Lifecycle
	onMount(async () => {
		if (typeof window !== 'undefined') {
			return setupClickOutsideHandler();
		}
	});
</script>

<form class="max-w-full">
	<label class="mb-2 text-sm font-medium text-gray-900 sr-only" for="default-search">
		Search
	</label>

	<div class="relative w-full">
		<input
			autocomplete="off"
			bind:value={query}
			class="block p-4 pr-14 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-0 placeholder-gray-500"
			id="location-input"
			on:input={fetchLocationSuggestions}
			{placeholder}
			required
			type="search"
		/>
		{#if showSearchButton}
			<button
				class="absolute right-0 top-0 bottom-0 p-4 text-sm font-medium text-white bg-[#2C7BE5] rounded-r-lg border-none hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
				disabled
				type="submit"
			>
				<Icon class="w-6 h-6" icon="ic:sharp-search" />

				<span class="sr-only">Search</span>
			</button>
		{/if}
	</div>

	{#if showSuggestions && suggestions.length > 0}
		<ul class="bg-white border border-gray-100 w-full z-2 text-start" bind:this={suggestionListRef}>
			{#each suggestions as suggestion (suggestion.mapbox_id)}
				<li>
					<button
						type="button"
						class="w-full text-left pl-8 pr-2 py-1 border-gray-100 relative cursor-pointer hover:bg-yellow-50 hover:text-gray-900"
						on:click={() => onSuggestionClick(suggestion)}
					>
						<Icon icon="si:arrow-right-fill" class="absolute w-6 h-6 left-2 right-2" />
						{suggestion.name}
						{#if suggestion.place_formatted}
							<div class="text-sm text-gray-500">{suggestion.place_formatted}</div>
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</form>
