<script>
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { flyToMarker } from '$lib/utils/mapUtils.js';
	import Icon from '@iconify/svelte';

	export let post;
	export let map = null;
	export let marker = null;
</script>

<div class="fbmposts p-4 border-b border-gray-200 {post.id} relative">
	{#if map !== null && marker !== null}
		<div class="absolute top-3 right-2 z-50">
			<Tooltip.Root>
				<Tooltip.Trigger class="bg-white rounded-sm">
					<span on:click={() => flyToMarker(marker, map)}>
						<Icon icon="uil:map-marker" class="h-7 w-7 text-gray-500" />
					</span>
				</Tooltip.Trigger>
				<Tooltip.Content>Locate the marker on the map.</Tooltip.Content>
			</Tooltip.Root>
		</div>
	{/if}
	<a class="flex flex-col gap-4" href={post.url} target="_blank">
		<div>
			<img alt={post.title} class="w-full rounded" src={post.image} />
			<div class="p-4">
				<h2 class="text-lg font-bold flex flex-row gap-2 text-gray-800">
					{post.currency}
					{post.price}
					{#if !post.historical}
						<Tooltip.Root>
							<Tooltip.Trigger>
								<span class="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
							</Tooltip.Trigger>
							<Tooltip.Content>New</Tooltip.Content>
						</Tooltip.Root>
					{/if}
				</h2>
				<p class="text-sm text-gray-600">{post.title}</p>
			</div>
		</div>
	</a>
</div>

<style>
	.fbmposts:hover {
		border-color: #007bff;
		background-color: #f0f9ff;
	}
</style>
