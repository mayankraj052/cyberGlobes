<script lang="ts">
	import MapNoData from '$lib/components/ui/map/MapNoData.svelte';
	import { highlightPointMarker } from '$lib/utils/mapUtils.js';
	import { sanitizeId } from '$lib/utils/generalUtils.js';
	import { onMount, afterUpdate } from 'svelte';
	import {
		hoveredPostId,
		searchRequestID,
		receivedPoints
	} from '$lib/stores/mapStore.ts';
	import { MapService } from '$lib/services/map-service';
	import Chatbot from '$lib/components/ui/chat/Chatbot.svelte';
	import PointCard from './PointCard.svelte';

	export let isSidebarVisible = true;
	export let markers = {};
	export let map;
	export let pointMarkersMap = {};

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

	// Function to handle point card interactions
	function handlePointClick(point: any) {
		if (map && point.latitude && point.longitude) {
			map.flyTo({
				center: [point.longitude, point.latitude],
				zoom: 16,
				speed: 1.2,
				curve: 1.5,
				essential: true
			});
		}
	}

	function handlePointHover(point: any) {
		// Highlight the corresponding marker on the map
		const marker = pointMarkersMap[point.id];
		if (marker) {
			highlightPointMarker(marker, true);
		}
	}

	function handlePointLeave(point: any) {
		// Remove highlight from the corresponding marker on the map
		const marker = pointMarkersMap[point.id];
		if (marker) {
			highlightPointMarker(marker, false);
		}
	}
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
				<Chatbot />
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
		class="posts-container overflow-y-auto flex-shrink-0 flex flex-col"
		style="height: {hasChatbot ? postsContainerHeight : '100%'};"
		bind:this={postsContainer}
	>
		<div class="flex-1 flex flex-col">
			<div class="w-full mx-auto flex-1 flex flex-col">
				{#if !$receivedPoints || $receivedPoints.length === 0}
					<div class="flex-1 flex items-center justify-center">
						<MapNoData />
					</div>
				{/if}

				<!-- Display received points -->
				{#if $receivedPoints && $receivedPoints.length > 0}
					<div class="points-section flex-1 border-t-2 border-blue-200 dark:border-blue-700 flex flex-col">
						<div class="px-2 py-2 flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800/50">
							{#each $receivedPoints as point}
								<PointCard 
									{point} 
									onPointClick={handlePointClick}
									onPointHover={handlePointHover}
									onPointLeave={handlePointLeave}
								/>
							{/each}
						</div>
					</div>
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
