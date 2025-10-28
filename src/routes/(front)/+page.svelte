<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import FacebookIcon from '$lib/assets/svg/marker/fb-mark.svg?raw';
	import TwitterIcon from '$lib/assets/svg/marker/x-mark.svg?raw';
	import InstaIcon from '$lib/assets/svg/marker/insta-mark.svg?raw';
	import LinkedinIcon from '$lib/assets/svg/marker/linkedin-mark.svg?raw';
	import GoogleNewsIcon from '$lib/assets/svg/marker/google-news-mark.svg?raw';
	import MapBg from '$lib/assets/svg/map/map-view.svg';
	import Cta from '$lib/components/ui/home/Cta.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import Icon from '@iconify/svelte';
	import { ApiService } from '$lib/services/api-service';
	import { toast } from 'svelte-sonner';
	import MapSearchBox from '$lib/components/ui/map/MapSearchBox.svelte';
	import Fetaures from '$lib/components/ui/home/Fetaures.svelte';
	import Why from '$lib/components/ui/home/Why.svelte';
	import Partners from '$lib/components/ui/home/Partners.svelte';
	import Insight from '$lib/components/ui/home/Insight.svelte';
	import Poi from '$lib/components/ui/home/Poi.svelte';
	import { getUserLocation } from '$lib/utils/locationUtils';
	import BreakingLimit from '$lib/components/ui/home/BreakingLimit.svelte';
	import Hero from '$lib/components/ui/home/Hero.svelte';
	import { isLoggedIn } from '$lib/stores/authStore';
	import { ACTION_TYPES, AGENT_FROM_HOME, MAP_DEFAULT_LOCATION, QUERY_BEFORE_LOGIN, USER_LAT, USER_LNG } from '$lib/constants/constants';
	import { MapService } from '$lib/services/map-service';

	let agentQuery = '';
	let agentLat = null;
	let agentLong = null;
	
	// Location selection modal variables
	let showLocationModal = false;
	let locationOptions = [];
	let selectedLocationIndex = 0;
	let locationLoader = false;
	let searchRequestId = null;
	let agentSearchLoader = false;

	// Map service
	const mapService = new MapService();

	onMount(async () => {
		// Check for URL query parameters only if user is logged in
		const urlParams = $page.url.searchParams;
		const loggedIn = urlParams.get('logged_in');
		const queryParam = urlParams.get('query');
		const queryImage = urlParams.get('image');
		
		if (loggedIn === 'true' && (queryParam || queryImage)) {
			// Wait for auth state to be properly set and then check login status
			setTimeout(async () => {
				if ($isLoggedIn) {
					// search by agent.
					if(queryParam && !queryImage) {
						// Decode the query parameter and set it in the input
						const decodedQuery = decodeURIComponent(queryParam);
						const locationInput = document.getElementById('location-input');
						if (locationInput) {
							locationInput.value = decodedQuery;
							agentQuery = decodedQuery;
							
							// Scroll to the input box
							locationInput.scrollIntoView({ 
								behavior: 'smooth', 
								block: 'center' 
							});

							// remove query parameter from URL
							const newUrl = new URL(window.location.href);
							newUrl.searchParams.delete('query');
							window.history.replaceState({}, '', newUrl.toString());
							
							// Trigger the search
							handleAgentSearch();
						}
					}

					// search by image
					if(!queryParam && queryImage == 'true') {
						const imageSearch = localStorage.getItem(QUERY_BEFORE_LOGIN);
						if (imageSearch) {
							const searchParams = JSON.parse(imageSearch);
							if(searchParams && searchParams.file) {
								const response = await fetch(searchParams.file);
								const blob = await response.blob();
								const file = new File([blob], searchParams.fileName, { type: searchParams.fileType });
								localStorage.removeItem(QUERY_BEFORE_LOGIN);
								uploadFile(file);

								// scroll to the file upload area
								const dropzone = document.querySelector('.dropzone');
								if (dropzone) {
									dropzone.scrollIntoView({ 
										behavior: 'smooth', 
										block: 'center' 
									});
								}
							}
						}
						
						// remove query parameter from URL
						const newUrl = new URL(window.location.href);
						newUrl.searchParams.delete('image');
						window.history.replaceState({}, '', newUrl.toString());
					}
				}
			}, 2000);
		}

		getUserLocation()
			.then((position) => {
				// Only save if user explicitly granted permission
				agentLong = position.coords.longitude;
				agentLat = position.coords.latitude;
				localStorage.setItem(USER_LAT, agentLat);
				localStorage.setItem(USER_LNG, agentLong);
			})
			.catch((error) => {
				// Do nothing for permission denied or no action
				console.log('Location access not granted:', error.message);
			});
	});

	let file = null;
	let isDragging = false;

	function handleDrop(event) {
		event.preventDefault();
		isDragging = false;

		const droppedFile = event.dataTransfer.files[0];
		if (droppedFile && (droppedFile.type === 'image/png' || droppedFile.type === 'image/jpeg')) {
			file = droppedFile;
		}
	}

	function handleDragOver(event) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleFileSelect(event) {
		file = event.target.files[0];
	}

	function validateFile(selectedFile) {
		if (!selectedFile) return;

		const allowedTypes = ['image/png', 'image/jpeg'];
		if (allowedTypes.includes(selectedFile.type)) {
			return true;
		} else {
			toast.error('Invalid file type. Please upload a PNG or JPG.');
			return false;
		}
	}

	$: if (file) {
		if (validateFile(file)) {
			uploadFile(file);
		}
	}

	let fileLoader = false;
	async function uploadFile(file) {
		if (!file) return;

		if (!$isLoggedIn) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const fileData = event.target.result;
				const searchParams = {
					action: ACTION_TYPES.SEARCH_BY_IMAGE,
					type: 'image',
					file: fileData,
					fileName: file.name,
					fileType: file.type
				};
				localStorage.setItem(QUERY_BEFORE_LOGIN, JSON.stringify(searchParams));
				goto('/login?loginredirect=1');
			};
			reader.readAsDataURL(file);
			return;
		}

		fileLoader = true;
		let apiService = new ApiService();
		let formData = new FormData();
		formData.append('image', file);

		try {
			const res = await apiService.makeApiCall(`map/image-search/`, formData, 'POST', 'formdata');
			if (res.success) {
				// Store the search request ID
				searchRequestId = res.search_request.id;
				
				// Get location options from the response
				if (res.search_request.request_params.image_coordinates && res.search_request.request_params.image_coordinates.length > 0) {
					locationOptions = res.search_request.request_params.image_coordinates;
					selectedLocationIndex = 0;
					showLocationModal = true;
				} else {
					// Fallback to original behavior if no locations are provided
					goto(`try-demo`);
				}
			} else {
				toast.error(res.message);
			}
		} catch (error) {
			toast.error('Upload failed:' + error);
		} finally {
			fileLoader = false;
		}
	}

	function handleAgentSearch() {
		agentQuery = document.getElementById('location-input').value;
		if (!agentQuery) {
			toast.error('Please enter a search query');
			return;
		}

		agentSearchLoader = true;

		agentLat = localStorage.getItem(USER_LAT) || MAP_DEFAULT_LOCATION.lat;
		agentLong = localStorage.getItem(USER_LNG) || MAP_DEFAULT_LOCATION.lng;

		let payload = {
			action: ACTION_TYPES.SEARCH_BY_AGENT,
			message: agentQuery,
			latitude: agentLat,
			longitude: agentLong
		};
		
		if (!$isLoggedIn) {
			localStorage.setItem(QUERY_BEFORE_LOGIN, JSON.stringify(payload));
			goto('/login?loginredirect=1');
			agentSearchLoader = false;
			return;
		}

		// Make API call to /insights/initiate
		mapService.getInsights(payload)
			.then(response => {
				if (response.success) {
					// get conversation_id
					const conversationId = response.conversation_id;

					// temp flag to indicate the conversation is from home page
					localStorage.setItem(AGENT_FROM_HOME, 'yes');

					// redirect to try-demo with conversation_id
					goto(`try-demo?conversation_id=${conversationId}`);
				} else {
					toast.error(response.message);
				}
			})
			.catch(error => {
				toast.error('Search failed: ' + error);
			})
			.finally(() => {
				agentSearchLoader = false;
			});
	}


	function handleLocationSelect(index) {
		selectedLocationIndex = index;
	}

	function handleContinueWithLocation() {
		locationLoader = true;
		
		if (locationOptions.length > 0 && selectedLocationIndex >= 0) {
			const selectedLocation = locationOptions[selectedLocationIndex];
			
			// Save selected location to localStorage (coordinates are [lat, lng])
			localStorage.setItem(USER_LAT, selectedLocation.coordinates[0]);
			localStorage.setItem(USER_LNG, selectedLocation.coordinates[1]);
			
			// Redirect to try-demo page
			goto(`try-demo`);
		} else {
			toast.error('Please select a location');
			locationLoader = false;
		}
	}

	function closeLocationModal() {
		showLocationModal = false;
		locationOptions = [];
		selectedLocationIndex = 0;
	}

	function adjustTextareaHeight(event) {
		const textarea = event.target;
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
	}
</script>

<Hero />

<section class="bg-white bg-gradient-to-b from-blue-50 to-blue-100">
	<div
		class="bg-cover bg-bottom lg:container md:container"
		style="background-image: url('{MapBg}');background-position: 311px 0;"
	>
		<div class="relative bg-gray-200 rounded-lg">
			<!-- Marker 1 -->
			<div
				class="hidden xl:block absolute bottom-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 group poi-1"
			>
				<div
					class="w-10 h-10 cursor-pointer group-hover:animate-bounce transition-all duration-200 ease-in-out"
				>
					<!-- Location 1 Popup -->

					{@html FacebookIcon}

					<div
						class="absolute hidden group-hover:block bg-white shadow-lg rounded-md p-2 text-center text-gray-800 w-40 -top-16 left-1/2 transform -translate-x-1/2"
					>
						<span class="font-semibold">Location 1</span>
						<p class="text-xs">Details about Location 1</p>
					</div>
				</div>
			</div>

			<!-- Marker 2 -->
			<div
				class="hidden xl:block absolute bottom-1/3 left-3/4 transform -translate-x-1/2 -translate-y-1/2 group poi-2"
			>
				<div
					class="w-10 h-10 cursor-pointer group-hover:animate-bounce transition-all duration-200 ease-in-out"
				>
					<!-- Location 2 Popup -->
					{@html TwitterIcon}

					<div
						class="absolute hidden group-hover:block bg-white shadow-lg rounded-md p-2 text-center text-gray-800 w-40 -top-16 left-1/2 transform -translate-x-1/2"
					>
						<span class="font-semibold">Location 2</span>
						<p class="text-xs">Details about Location 2</p>
					</div>
				</div>
			</div>

			<!-- Marker 3 -->
			<div
				class="hidden xl:block cursor-pointer absolute bottom-2/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 group poi-3"
			>
				<div class="w-10 h-10 group-hover:animate-bounce transition-all duration-200 ease-in-out">
					<!-- Location 3 Popup -->
					{@html InstaIcon}
					<div
						class="absolute hidden group-hover:block bg-white shadow-lg rounded-md p-2 text-center text-gray-800 w-40 -top-16 left-1/2 transform -translate-x-1/2"
					>
						<span class="font-semibold">Location 3</span>
						<p class="text-xs">Details about Location 3</p>
					</div>
				</div>
			</div>

			<!-- Marker 4 -->
			<div
				class="hidden xl:block cursor-pointer absolute bottom-2/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 group poi-4"
			>
				<div class="w-10 h-10 group-hover:animate-bounce transition-all duration-200 ease-in-out">
					<!-- Location 7 Popup -->
					{@html LinkedinIcon}
					<div
						class="absolute hidden group-hover:block bg-white shadow-lg rounded-md p-2 text-center text-gray-800 w-40 -top-16 left-1/2 transform -translate-x-1/2"
					>
						<span class="font-semibold">Location 4</span>
						<p class="text-xs">Details about Location 4</p>
					</div>
				</div>
			</div>

			<!-- Marker 5 -->
			<div
				class="hidden xl:block cursor-pointer absolute bottom-2/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 group poi-5"
			>
				<div class="w-10 h-10 group-hover:animate-bounce transition-all duration-200 ease-in-out">
					{@html GoogleNewsIcon}
					<div
						class="absolute hidden group-hover:block bg-white shadow-lg rounded-md p-2 text-center text-gray-800 w-40 -top-16 left-1/2 transform -translate-x-1/2"
					>
						<span class="font-semibold">Location 5</span>
						<p class="text-xs">Details about Location 4</p>
					</div>
				</div>
			</div>
		</div>

		<div
			class="grid max-w-screen-xl text-center xl:text-left md:px-0 px-4 py-8 lg:gap-8 gap-8 xl:gap-0 lg:py-[100px] lg:pt-[60px] lg:pb-[130px] lg:grid-cols-12"
		>
	<div class="col-span-12 lg:col-span-10 text-center xl:text-left flex flex-col justify-center items-center xl:items-start space-y-6">
		<div class="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-900 md:leading-tight">
			CyberGlobes <br>Live Real-Time Geo-Location data
		</div>
		<p class="text-lg md:text-xl text-gray-900 max-w-2xl">
			Cyberglobes bridges the gap in AI-driven search, delivering real-time, location-based data designed for your needs.
			Search on your own or let our intelligent chatbot do the work. Stay ahead with the latest updates—while others rely on outdated information.
		</p>
				<Tabs.Root value="agent">
					<Tabs.List class="mb-5 bg-white rounded-lg md:h-14">
						<Tabs.Trigger
							value="agent"
							class="flex-1 py-2 px-2 sm:px-4 md:px-4 md:mx-1 hover:bg-gray-200 hover:text-black text-black font-semibold rounded-md transition-all duration-300 ease-in-out data-[state=active]:bg-gray-100 data-[state=active]:text-black data-[state=active]:shadow-md text-xs sm:text-sm md:text-base"
						>
							<span class="block truncate">Search by Agent</span>
						</Tabs.Trigger>

						<Tabs.Trigger
							value="address"
							class="flex-1 py-2 px-2 sm:px-4 md:px-4 md:mx-1 hover:bg-gray-200 hover:text-black text-black font-semibold rounded-md transition-all duration-300 ease-in-out data-[state=active]:bg-gray-100 data-[state=active]:text-black data-[state=active]:shadow-md text-xs sm:text-sm md:text-base"
						>
							<span class="block truncate">Search by Address</span>
						</Tabs.Trigger>

						<Tabs.Trigger
							value="image"
							class="flex-1 py-2 px-2 sm:px-4 md:px-4 md:mx-1 hover:bg-gray-200 hover:text-black text-black font-semibold rounded-md transition-all duration-300 ease-in-out data-[state=active]:bg-gray-100 data-[state=active]:text-black data-[state=active]:shadow-md text-xs sm:text-sm md:text-base"
						>
							<span class="block truncate">Search by Image</span>
						</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="agent">
						<form class="max-w-full">
							<label class="mb-2 text-sm font-medium text-gray-900 sr-only" for="default-search">
								Search
							</label>

							<div class="relative w-full">
								<textarea
									autocomplete="off"
									class="block p-4 pr-14 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-0 placeholder-gray-500 resize-none overflow-hidden leading-normal"
									id="location-input"
									required
									placeholder="Please enter your query..."
									rows="1"
									on:input={adjustTextareaHeight}
								></textarea>
								<button
									on:click={handleAgentSearch}
									class="absolute right-0 top-0 p-4 text-sm font-medium text-white bg-[#2C7BE5] rounded-r-lg border-none hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 h-[calc(100%-0px)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
									type="button"
									disabled={agentSearchLoader}
								>
									{#if agentSearchLoader}
										<Icon icon="line-md:loading-twotone-loop" class="w-6 h-6" />
									{:else}
										<Icon class="w-6 h-6" icon="ic:sharp-search" />
									{/if}
									<span class="sr-only">Search</span>
								</button>
							</div>
						</form>
					</Tabs.Content>
					<Tabs.Content value="address">
						<MapSearchBox />
					</Tabs.Content>
					<Tabs.Content value="image">
						<form class="max-w-full">
							<div
								class="flex items-center justify-center w-full"
								on:drop={handleDrop}
								on:dragover={handleDragOver}
								on:dragleave={handleDragLeave}
							>
								<label
									for="dropzone-file"
									class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50
									dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600
									transition-all duration-300"
									class:border-blue-500={isDragging}
									class:border-gray-300={!isDragging && !fileLoader}
									class:border-gray-500={fileLoader}
								>
									<div class="flex flex-col items-center justify-center pt-5 pb-6">
										{#if fileLoader}
											<Icon icon="line-md:uploading-loop" class="text-5xl text-primary" />
											<p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Uploading...</p>
										{:else}
											<Icon
												icon="icon-park-outline:upload-one"
												class="w-8 h-8 mb-4 text-primary dark:text-gray-400"
											/>
											<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
												<span class="font-semibold">Click to upload</span> or drag and drop
											</p>
											<p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG</p>
										{/if}
									</div>
									{#if !fileLoader}
										<input
											id="dropzone-file"
											accept="image/png, image/jpeg"
											type="file"
											class="hidden"
											on:change={handleFileSelect}
										/>
									{/if}
								</label>
							</div>
						</form>
					</Tabs.Content>
				</Tabs.Root>
			</div>
		</div>
	</div>
</section>
<Partners />
<Fetaures />
<BreakingLimit />
<Why />
<Insight />
<Poi />

<Cta />

<!-- Location selection modal -->
{#if showLocationModal}
<div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
	<div class="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg mx-auto transform transition-all">
		<!-- Header -->
		<div class="flex items-center justify-between p-6 border-b border-gray-200">
			<div class="flex items-center gap-3">
				<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
					<Icon icon="lucide:map-pin" class="w-4 h-4 text-blue-600" />
				</div>
				<h3 class="text-xl font-semibold text-gray-900">Select Location</h3>
			</div>
			<button 
				on:click={closeLocationModal} 
				class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
			>
				<Icon icon="lucide:x" class="w-5 h-5 text-gray-500" />
			</button>
		</div>
		
		<!-- Content -->
		<div class="p-6">
			{#if locationLoader}
				<div class="flex flex-col items-center justify-center py-12">
					<Icon icon="line-md:loading-twotone-loop" class="w-8 h-8 text-blue-600 mb-3" />
					<p class="text-gray-600">Processing your selection...</p>
				</div>
			{:else if locationOptions.length > 0}
				<div class="space-y-3 max-h-72 overflow-y-auto pr-2">
					{#each locationOptions as location, index}
						<div 
							class="group relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
							{selectedLocationIndex === index 
								? 'border-blue-500 bg-blue-50 shadow-sm' 
								: 'border-gray-200 hover:border-gray-300 bg-white'}"
							on:click={() => handleLocationSelect(index)}
						>
							<!-- Selection indicator -->
							<div class="absolute top-3 right-3">
								{#if selectedLocationIndex === index}
									<div class="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
										<Icon icon="lucide:check" class="w-3 h-3 text-white" />
									</div>
								{:else}
									<div class="w-5 h-5 border-2 border-gray-300 rounded-full group-hover:border-gray-400"></div>
								{/if}
							</div>
							
							<!-- Location info -->
							<div class="pr-8">
								<div class="flex items-start gap-3">
									<div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
										<Icon icon="lucide:map-pin" class="w-4 h-4 text-gray-600" />
									</div>
									<div class="flex-1 min-w-0">
										<h4 class="font-medium text-gray-900 mb-1 leading-tight">
											{location.name || `Location ${index + 1}`}
										</h4>
										{#if location.address}
											<p class="text-sm text-gray-600 mb-2 leading-relaxed">{location.address}</p>
										{/if}
										
										<!-- Coordinates and match score -->
										<div class="flex flex-wrap gap-3 text-xs">
											<div class="flex items-center gap-1 text-gray-500">
												<Icon icon="lucide:navigation" class="w-3 h-3" />
												<span>{location.coordinates[1].toFixed(4)}, {location.coordinates[0].toFixed(4)}</span>
											</div>
											{#if location.similarity_score_1km}
												<div class="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full">
													<Icon icon="lucide:target" class="w-3 h-3" />
													<span class="font-medium">{Math.round(location.similarity_score_1km * 100)}% match</span>
												</div>
											{/if}
										</div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="text-center py-12">
					<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Icon icon="lucide:map-pin-off" class="w-8 h-8 text-gray-400" />
					</div>
					<h4 class="text-lg font-medium text-gray-900 mb-2">No locations found</h4>
					<p class="text-gray-600">Please try again with a different image.</p>
				</div>
			{/if}
		</div>
		
		<!-- Footer -->
		{#if locationOptions.length > 0}
			<div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50/50">
				<button
					on:click={closeLocationModal}
					class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
					disabled={locationLoader}
				>
					Cancel
				</button>
				<button
					on:click={handleContinueWithLocation}
					class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
					disabled={locationLoader}
				>
					{#if locationLoader}
						<Icon icon="line-md:loading-twotone-loop" class="w-4 h-4" />
						Processing...
					{:else}
						<Icon icon="lucide:arrow-right" class="w-4 h-4" />
						Continue
					{/if}
				</button>
			</div>
		{:else if !locationLoader}
			<div class="flex justify-center p-6 border-t border-gray-200 bg-gray-50/50">
				<button
					on:click={closeLocationModal}
					class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
				>
					Close
				</button>
			</div>
		{/if}
	</div>
</div>
{/if}

<style>
	.poi-1 {
		left: 70%;
		top: 50px;
	}

	.poi-2 {
		top: 475px;
		left: 65%;
	}

	.poi-3 {
		top: 200px;
		left: 80%;
	}

	.poi-4 {
		left: 75%;
		top: 368px;
	}
	.poi-5 {
		top: 400px;
		left: 45%;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.group-hover\:animate-bounce:hover {
		animation: bounce 0.6s ease-out;
	}
</style>
