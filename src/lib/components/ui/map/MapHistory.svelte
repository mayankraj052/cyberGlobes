<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.ts';
	import Icon from '@iconify/svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Sheet from '$lib/components/ui/sheet';
	import { onMount } from 'svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { mapDataLoaded, searchRequestID } from '$lib/stores/mapStore';
	import { SOCIAL_MEDIA_PLATFORMS } from '$lib/constants/constants';
	import { MapService } from '$lib/services/map-service';
	import { getDataFromURL, generateMapURL } from '$lib/utils/generalUtils';

	// Constants & Initialization
	const DEFAULT_OBSERVER_OPTIONS = { threshold: 0.1 };
	const mapService = new MapService();
	const latitude = getDataFromURL('lat');
	const longitude = getDataFromURL('long');

	// State Variables
	let versionHistory: Array<any> = [];
	let location = '';
	let currentPage = 1;
	let hasNextPage = true;

	// Helper Functions
	const formatDate = (date: Date) =>
		date.toLocaleString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		});

	const createPayload = (page = currentPage) => ({ latitude, longitude, page });

	const updateVersionHistory = (data: any[], append = false) => {
		if (data.length === 0) {
			hasNextPage = false;
			return console.log('No more history data found');
		}
		versionHistory = append ? [...versionHistory, ...data] : data;
		if (!append) location = data[0]?.address || '';
	};

	const fetchVersionHistory = async (payload: object, append = false) => {
		try {
			const res = await mapService.getVersionHistory(payload);
			if (!res.success) throw new Error(`Error fetching data: ${res.message}`);
			updateVersionHistory(res.versions.data, append);
		} catch (error) {
			console.error(error.message);
		}
	};

	function loadMoreHistory() {
		if (!hasNextPage) return;
		fetchVersionHistory(createPayload(currentPage + 1), true).then(() => currentPage++);
	}

	// Custom Action for IntersectionObserver
	function intersectionObserver(node: Element, options = DEFAULT_OBSERVER_OPTIONS) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(
				(entry) => entry.isIntersecting && node.dispatchEvent(new CustomEvent('intersect'))
			);
		}, options);
		observer.observe(node);
		return { destroy: () => observer.disconnect() };
	}

	// Component Lifecycle
	onMount(() => {
		if (latitude && longitude && $mapDataLoaded) fetchVersionHistory(createPayload());
	});
</script>

<Sheet.Root>
	<Sheet.Trigger>
		<Button variant="outline">
			<Icon class="w-6 h-6 md:me-2 sm:me-0" icon="solar:history-bold" />
			<span class="hidden md:inline">History</span>
		</Button>
	</Sheet.Trigger>
	<Sheet.Content class="flex flex-col h-full p-3" side="right">
		<Sheet.Header class="mb-2">
			<Sheet.Title>Search History</Sheet.Title>
			<Sheet.Description>{location}</Sheet.Description>
		</Sheet.Header>
		<div class="flex-1 overflow-y-auto overflow-x-hidden border-t border-b border-gray-200 py-2">
			{#if versionHistory.length > 0}
				{#each versionHistory as item, index}
					<Card.Root
						class="mb-4 shadow-lg hover:shadow-xl border border-gray-200 rounded-lg transition-shadow duration-300"
					>
						<Card.Content>
							<a href={generateMapURL(item)} rel="external">
								<div class="flex flex-col md:flex-row md:justify-between md:items-center">
									<span class="text-sm text-gray-700">{formatDate(new Date(item.created_at))}</span>
									{#if item.id === $searchRequestID}
										<Badge
											class="bg-green-200 text-green-800 hover:bg-green-300 px-2 py-1 rounded-md shadow-sm mt-2 md:mt-0"
										>
											Active
										</Badge>
									{/if}
								</div>
								<hr class="my-4 border-gray-300" />
								<div class="flex flex-wrap gap-2">
									{#each item.request_params.features as feature}
										{#if SOCIAL_MEDIA_PLATFORMS.some((platform) => platform.slug === feature)}
											<div class="flex items-center space-x-2">
												<Icon
													class="w-8 h-8 text-gray-500 bg-gray-100 rounded-lg p-2 shadow-md hover:bg-gray-200 transition-all duration-200"
													title={feature}
													icon={SOCIAL_MEDIA_PLATFORMS.find((platform) => platform.slug === feature)
														?.tabIcon}
												/>
											</div>
										{/if}
									{/each}
								</div>
							</a>
						</Card.Content>
					</Card.Root>
				{/each}
				<div class="flex items-center justify-center mt-4">
					{#if hasNextPage}
						<Icon class="w-7 h-7 md:w-6 md:h-6" icon="line-md:loading-twotone-loop" />
						<span class="ml-2 text-gray-500">Loading...</span>
						<div use:intersectionObserver on:intersect={loadMoreHistory}></div>
					{/if}
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center h-full">
					<Icon class="w-16 h-16 text-gray-500" icon="solar:history-bold" />
					<span class="text-gray-500">No history available.</span>
				</div>
			{/if}
		</div>
		<Sheet.Footer class="p-3">
			<Sheet.Close><Button variant="ghost">Close</Button></Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
