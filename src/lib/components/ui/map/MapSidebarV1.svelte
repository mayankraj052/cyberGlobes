<script lang="ts">
	import MapNoData from '$lib/components/ui/map/MapNoData.svelte';
	import { highlightMarker } from '$lib/utils/mapUtils.js';
	import { sanitizeId, truncateString } from '$lib/utils/generalUtils.js';
	import { onMount, afterUpdate } from 'svelte';
	import {
		activeSocialMedia,
		hoveredPostId,
		socialMediaJson,
		visibility,
		searchRequestID
	} from '$lib/stores/mapStore.ts';
	import Icon from '@iconify/svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.ts';
	import TwitterCard from '$lib/components/ui/map/social-cards/x-twitter/TwitterCard.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { MapService } from '$lib/services/map-service';
	import { toast } from 'svelte-sonner';
	import FacebookCard from './social-cards/facebook/FacebookCard.svelte';
	import FacebookMarketplaceCard from './social-cards/facebook-marketplace/FacebookMarketplaceCard.svelte';
	import type mapboxgl from 'mapbox-gl';
	import { SOCIAL_MEDIA_PLATFORMS } from '$lib/constants/constants';
	import Chatbot from '$lib/components/ui/chat/Chatbot.svelte';
	import ChatbotV1 from '../chat/ChatbotV1.svelte';

	export let isSidebarVisible = true;
	export let markers = {};
	export let map;

	let sidebarElement;

	// Reactively store the hovered post ID
	let activeHoveredPostId = null;
	hoveredPostId.subscribe((id) => {
		activeHoveredPostId = id;

		if (sidebarElement && id !== null) {
			// Scroll to the highlighted post in the sidebar
			const sanitizedId = `post-${sanitizeId(id)}`;
			const postElement = sidebarElement.querySelector(`.${sanitizedId}`);
			if (postElement) {
				postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		}
	});

	function handleScroll(event) {
		const sections = event.target.querySelectorAll('.social-media-block');
		let active = null;

		sections.forEach((section) => {
			const { top, bottom } = section.getBoundingClientRect();

			// Check if the section is in the viewport
			if (top <= window.innerHeight / 2 && bottom >= window.innerHeight / 2) {
				active = section.dataset.type;
			}
		});

		// Update the active social media store
		activeSocialMedia.update((prev) => {
			if (prev !== active) {
				return active;
			}
			return prev;
		});
	}

	let downloadIcons = {};
	async function downloadPanoid(panoidID) {
		try {
			updateDownloadIcon(panoidID, 'line-md:downloading-loop');
			const response = await fetchPanoidData(panoidID);

			const url = createBlobUrl(response);
			triggerDownload(url, panoidID);
			URL.revokeObjectURL(url);

			updateDownloadIcon(panoidID, 'ic:round-download-done');
			toast.success('Downloaded successfully');

			resetDownloadIcon(panoidID);
		} catch (error) {
			console.error(error);
			toast.error('Download failed');
		}
	}

	function updateDownloadIcon(panoidID, icon) {
		downloadIcons[panoidID] = icon;
	}

	async function fetchPanoidData(panoidID) {
		const mapService = new MapService();
		return await mapService.downloadPanoid($searchRequestID, panoidID);
	}

	function createBlobUrl(data) {
		const blob = new Blob([data], { type: 'image/jpeg' });
		return URL.createObjectURL(blob);
	}

	function triggerDownload(url, panoidID) {
		const a = document.createElement('a');
		a.href = url;
		a.download = `${panoidID}.jpg`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	function resetDownloadIcon(panoidID) {
		setTimeout(() => {
			updateDownloadIcon(panoidID, 'line-md:downloading');
		}, 2000);
	}

	let twitterData;
	$: twitterData = $socialMediaJson?.socialData?.find(
		(socialMedia) => socialMedia.type === 'x-twitter'
	);

	let facebookData;
	$: facebookData = $socialMediaJson?.socialData?.find(
		(socialMedia) => socialMedia.type === 'facebook'
	);

	let facebookMarketplaceData;
	$: facebookMarketplaceData = $socialMediaJson?.socialData?.find(
		(socialMedia) => socialMedia.type === 'facebook-marketplace'
	);

	export let hasChatbot: boolean = false;

	// State for resizable panels
	let postsContainerHeight = '30%';
	let chatbotContainerHeight = '70%';
	let isDragging = false;
	let startY = 0;
	let startHeight = 0;
	
	// Reference to containers
	let postsContainer: HTMLElement;
	let chatbotContainer: HTMLElement;
	let resizeHandle: HTMLElement;

	onMount(() => {
		// Initialize heights on mount
		updateHeights();
		
		if (resizeHandle) {
			resizeHandle.addEventListener('mousedown', startResize);
		}
	});

	function startResize(e) {
		isDragging = true;
		startY = e.clientY;
		startHeight = chatbotContainer.offsetHeight;
		
		// Add event listeners for resize tracking
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
		
		// Prevent text selection during resize
		document.body.style.userSelect = 'none';
	}
	
	function resize(e) {
		if (!isDragging) return;
		
		const deltaY = e.clientY - startY;
		const totalHeight = sidebarElement.offsetHeight;
		
		// Calculate new height for chatbot container (top section)
		const newChatbotHeight = startHeight + deltaY;
		
		// Ensure minimum heights for both sections
		const minHeight = 100; // Minimum height in pixels
		
		if (newChatbotHeight < minHeight || totalHeight - newChatbotHeight < minHeight) return;
		
		// Update heights as percentages
		chatbotContainerHeight = `${(newChatbotHeight / totalHeight) * 100}%`;
		postsContainerHeight = `${100 - (newChatbotHeight / totalHeight) * 100}%`;
		
		updateHeights();
	}
	
	function stopResize() {
		isDragging = false;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
		document.body.style.userSelect = '';
	}
	
	function updateHeights() {
		if (postsContainer && chatbotContainer) {
			postsContainer.style.height = postsContainerHeight;
			chatbotContainer.style.height = chatbotContainerHeight;
		}
	}

	afterUpdate(() => {
		updateHeights();
	});
</script>

<!-- Sidebar -->
{#if isSidebarVisible}
	<div class="sidebar-container h-full overflow-hidden flex flex-col" bind:this={sidebarElement}>
		{#if hasChatbot}
			<!-- Chatbot section -->
			<div 
				class="chatbot-container flex-grow overflow-hidden"
				style="height: {chatbotContainerHeight};"
				bind:this={chatbotContainer}
			>
				<ChatbotV1 />
			</div>
			
			<!-- Resize handle -->
			<div 
				class="resize-handle flex-shrink-0 h-2 bg-gray-200 dark:bg-gray-700 cursor-ns-resize flex items-center justify-center"
				bind:this={resizeHandle}
			>
				<div class="w-10 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
			</div>
		{/if}
		
		<!-- Posts Section -->
		<div 
			class="posts-container overflow-y-auto flex-shrink-0"
			style="height: {hasChatbot ? postsContainerHeight : '100%'};"
			bind:this={postsContainer}
		>
			<div class="pb-5 h-full">
					<div class="w-full mx-auto pb-5">
						{#if !$socialMediaJson || Object.values($visibility).every((val) => val === false)}
							<MapNoData />
						{/if}

						{#if $socialMediaJson}
							{#if twitterData && $visibility['x-twitter']}
								<div class="social-media-block" data-type="x-twitter">
									<TwitterCard {markers} {map} />
								</div>
							{/if}

							{#if facebookData && $visibility['facebook']}
								<div class="social-media-block" data-type="facebook">
									<FacebookCard {markers} {map} />
								</div>
							{/if}

							{#if facebookMarketplaceData && $visibility['facebook-marketplace']}
								<div class="social-media-block" data-type="facebook-marketplace">
									<FacebookMarketplaceCard {markers} {map} />
								</div>
							{/if}

							<!-- Call other data here -->
							{#each $socialMediaJson.socialData as socialMedia}
								{#if socialMedia.type !== 'x-twitter' && socialMedia.type !== 'facebook' && socialMedia.type !== 'facebook-marketplace'}
									<div class="social-media-block" data-type={socialMedia.type}>
										{#each socialMedia.posts as post}
											{#if $visibility[socialMedia.type] && post && post.id}
												<div
													data-type={socialMedia.type}
													class="post-row post-{sanitizeId(
														post.id
													)} bg-white p-4 rounded-lg shadow-md mt-4 border border-gray-300 post-section"
													class:highlighted={activeHoveredPostId === post.id}
													on:mouseover={() =>
														highlightMarker(markers[socialMedia.type]?.[post.id], map, true)}
													on:mouseleave={() =>
														highlightMarker(markers[socialMedia.type]?.[post.id], map, false)}
												>
													<div class="{socialMedia.type} p-4 relative">
														{#if socialMedia.type == 'streetview'}
															<div class="absolute top-3 right-2 z-50">
																<Tooltip.Root>
																	<Tooltip.Trigger>
																		<span on:click={() => downloadPanoid(post.id)}>
																			<Icon
																				icon={downloadIcons[post.id] || 'line-md:downloading'}
																				class="h-7 w-7 text-gray-500"
																			/></span
																		>
																	</Tooltip.Trigger>
																	<Tooltip.Content>Download Image.</Tooltip.Content>
																</Tooltip.Root>
															</div>
														{/if}
														<a href={post.url} target="_blank" class="flex items-center gap-4">
															<Avatar.Root>
																<Avatar.Image src={post.image} alt="post" />
																<Avatar.Fallback>
																	{#if post.fallback_image !== undefined && post.fallback_image !== null && post.fallback_image !== ''}
																		<img src={post.fallback_image} alt="post" />
																	{:else}
																		P
																	{/if}
																</Avatar.Fallback>
															</Avatar.Root>
															<div class="flex flex-col flex-grow">
																<strong class="text-sm font-medium text-gray-900 dark:text-gray-200"
																	>{truncateString(post.title, 50)}</strong
																>
																<span class="text-sm font-medium text-gray-500 dark:text-gray-400">
																	{truncateString(post.description, 250)}
																</span>
																{#if post.price}
																	<span
																		class="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1"
																	>
																		<Icon icon="grommet-icons:money" />
																		{post.currency}{post.price}
																	</span>
																{/if}
															</div>
														</a>
													</div>
												</div>
											{/if}
										{/each}
									</div>
								{/if}
							{/each}
						{/if}
					</div>
				</div>
		</div>
	</div>
{/if}

<style>
	.resize-handle {
		cursor: ns-resize;
		user-select: none;
	}
	
	.resize-handle:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}
	
	.highlight-post {
		animation: highlight 3s;
	}
	
	@keyframes highlight {
		0% { background-color: rgba(59, 130, 246, 0.1); }
		100% { background-color: transparent; }
	}

	.post-row:hover,
	.highlighted {
		border: 1px solid #007bff;
		background-color: #f0f9ff;
	}
</style>