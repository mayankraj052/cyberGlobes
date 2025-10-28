<script lang="ts">
	import { truncateString } from '$lib/utils/generalUtils.js';
	import Icon from '@iconify/svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	export let point: {
		id: string | number;
		title?: string;
		description?: string;
		latitude: number;
		longitude: number;
		address?: string;
		type?: string;
		price?: string;
		phone?: string;
		website?: string;
		url?: string;
		imageUrl?: string;
		neighborhood?: string;
		city?: string;
		postalCode?: string;
		countryCode?: string;
		reviewsCount?: string | number;
		openingHours?: Array<{day: string, hours: string}>;
		additionalInfo?: any;
		conversationId?: number;
		metadata?: any;
	};

	export let onPointClick: (point: any) => void = () => {};
	export let onPointHover: (point: any) => void = () => {};
	export let onPointLeave: (point: any) => void = () => {};

	// Format coordinates for display
	$: formattedCoords = `${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}`;

	// Create default title if none provided
	$: displayTitle = point.title || `Point ${point.id}` || 'Unnamed Point';

	// State for expanded view
	let isExpanded = false;

	function toggleExpanded(event) {
		event.stopPropagation();
		isExpanded = !isExpanded;
	}
</script>

<div
	class="point-card bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mt-2 border border-gray-200 dark:border-gray-600 cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
	class:expanded={isExpanded}
	on:click={() => onPointClick(point)}
	on:mouseenter={() => onPointHover(point)}
	on:mouseleave={() => onPointLeave(point)}
>
	<div class="flex items-start gap-3">
		<!-- Point Icon/Image -->
		<div class="flex-shrink-0">
			{#if point.imageUrl}
				<Avatar.Root class="w-12 h-12">
					<Avatar.Image src={point.imageUrl} alt="Point" />
					<Avatar.Fallback>
						<Icon icon="mdi:map-marker" class="w-6 h-6 text-blue-500" />
					</Avatar.Fallback>
				</Avatar.Root>
			{:else}
				<div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
					{#if point.type && point.type.toLowerCase().includes('restaurant')}
						<Icon icon="mdi:silverware-fork-knife" class="w-6 h-6 text-blue-500" />
					{:else}
						<Icon icon="mdi:map-marker" class="w-6 h-6 text-blue-500" />
					{/if}
				</div>
			{/if}
		</div>

		<!-- Point Information -->
		<div class="flex-grow min-w-0">
			<!-- Title -->
			<h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
				{truncateString(displayTitle, 60)}
			</h3>

			<!-- Description -->
			{#if point.description}
				<p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
					{truncateString(point.description, 120)}
				</p>
			{/if}

			<!-- Price and Reviews -->
			<div class="flex items-center gap-3 mb-2">
				{#if point.price}
					<div class="flex items-center gap-1">
						<Icon icon="mdi:currency-gbp" class="w-3 h-3 text-green-600" />
						<span class="text-xs text-green-600 dark:text-green-400 font-medium">
							{point.price}
						</span>
					</div>
				{/if}
				{#if point.reviewsCount}
					<div class="flex items-center gap-1">
						<Icon icon="mdi:star" class="w-3 h-3 text-yellow-500" />
						<span class="text-xs text-gray-500 dark:text-gray-400">
							{point.reviewsCount} reviews
						</span>
					</div>
				{/if}
			</div>

			<!-- Phone -->
			{#if point.phone}
				<div class="flex items-center gap-1 mb-2">
					<Icon icon="mdi:phone" class="w-3 h-3 text-gray-500" />
					<span class="text-xs text-gray-500 dark:text-gray-400">
						{point.phone}
					</span>
				</div>
			{/if}

			<!-- Address -->
			{#if point.address}
				<div class="flex items-center gap-1 mb-2">
					<Icon icon="mdi:map-marker-outline" class="w-3 h-3 text-gray-500" />
					<span class="text-xs text-gray-500 dark:text-gray-400">
						{truncateString(point.address, 80)}
					</span>
				</div>
			{/if}

			<!-- Coordinates -->
			<div class="flex items-center gap-1 mb-2">
				<Icon icon="mdi:crosshairs-gps" class="w-3 h-3 text-gray-500" />
				<span class="text-xs text-gray-500 dark:text-gray-400 font-mono">
					{formattedCoords}
				</span>
			</div>

			<!-- Type/Category -->
			{#if point.type}
				<div class="flex items-center gap-1 mb-2">
					<Icon icon="mdi:tag-outline" class="w-3 h-3 text-gray-500" />
					<span class="text-xs text-blue-600 dark:text-blue-400 font-medium">
						{point.type}
					</span>
				</div>
			{/if}

			<!-- Current Opening Hours (today) -->
			{#if point.openingHours && point.openingHours.length > 0}
				{@const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })}
				{@const todayHours = point.openingHours.find(h => h.day === today)}
				{#if todayHours}
					<div class="flex items-center gap-1 mb-2">
						<Icon icon="mdi:clock-outline" class="w-3 h-3 text-gray-500" />
						<span class="text-xs text-gray-500 dark:text-gray-400">
							Today: {todayHours.hours}
						</span>
					</div>
				{/if}
			{/if}

			<!-- External link if available -->
			{#if point.url || point.website}
				<div class="mt-2">
					<a 
						href={point.url || point.website} 
						target="_blank" 
						rel="noopener noreferrer"
						class="text-xs text-blue-600 hover:text-blue-800 underline"
						on:click|stopPropagation
					>
						<Icon icon="mdi:external-link" class="w-3 h-3 inline mr-1" />
						Visit Website
					</a>
				</div>
			{/if}
		</div>
	</div>

	<!-- Expanded Details (Hidden by default) -->
    {#if isExpanded}
        <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <!-- Full Opening Hours -->
            {#if point.openingHours && point.openingHours.length > 0}
                <div class="mb-3">
                    <h4 class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                        <Icon icon="mdi:clock-outline" class="w-3 h-3" />
                        Opening Hours
                    </h4>
                    <div class="grid grid-cols-1 gap-1">
                        {#each point.openingHours as hour}
                            <div class="flex justify-between text-xs">
                                <span class="text-gray-600 dark:text-gray-400">{hour.day}:</span>
                                <span class="text-gray-800 dark:text-gray-200">{hour.hours}</span>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Additional Info Highlights -->
            {#if point.additionalInfo}
                {#if point.additionalInfo.Highlights}
                    <div class="mb-3">
                        <h4 class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                            <Icon icon="mdi:star-outline" class="w-3 h-3" />
                            Highlights
                        </h4>
                        <div class="flex flex-wrap gap-1">
                            {#each point.additionalInfo.Highlights as highlight}
                                {#each Object.entries(highlight) as [key, value]}
                                    {#if value}
                                        <span class="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                                            {key}
                                        </span>
                                    {/if}
                                {/each}
                            {/each}
                        </div>
                    </div>
                {/if}

                {#if point.additionalInfo.Offerings}
                    <div class="mb-3">
                        <h4 class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                            <Icon icon="mdi:food-fork-drink" class="w-3 h-3" />
                            Offerings
                        </h4>
                        <div class="flex flex-wrap gap-1">
                            {#each point.additionalInfo.Offerings.slice(0, 5) as offering}
                                {#each Object.entries(offering) as [key, value]}
                                    {#if value}
                                        <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                                            {key}
                                        </span>
                                    {/if}
                                {/each}
                            {/each}
                        </div>
                    </div>
                {/if}
            {/if}
        </div>
    {/if}

	<!-- Expand/Collapse Button -->
	{#if point.openingHours?.length > 0 || point.additionalInfo}
		<div class="flex-shrink-0 ml-2">
			<button 
				on:click={toggleExpanded}
				class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
				title={isExpanded ? 'Show less' : 'Show more'}
			>
				<Icon 
					icon={isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'} 
					class="w-4 h-4 text-gray-500" 
				/>
			</button>
		</div>
	{/if}
</div>

<style>
	.point-card {
		transition: all 0.2s ease-in-out;
	}
	
	.point-card:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.point-card.expanded {
		border-color: rgb(59 130 246);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
	}
</style>
