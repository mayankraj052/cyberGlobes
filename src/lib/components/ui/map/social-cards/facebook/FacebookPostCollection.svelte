<script>
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Avatar from '$lib/components/ui/avatar';
	import { flyToMarker } from '$lib/utils/mapUtils.js';
	import Icon from '@iconify/svelte';
	import FBPosts from '$lib/components/ui/map/social-cards/facebook/FBPosts.svelte';

	export let post;
	export let map = null;
	export let marker = null;
</script>

{#if post.type === 'users'}
	<div class="fbposts p-4 border-b border-gray-200 {post.id} relative">
		{#if map !== null && marker !== null}
			<div class="absolute top-3 right-2 z-50">
				<Tooltip.Root>
					<Tooltip.Trigger>
						<span on:click={() => flyToMarker(marker, map)}>
							<Icon icon="uil:map-marker" class="h-7 w-7 text-gray-500" />
						</span>
					</Tooltip.Trigger>
					<Tooltip.Content>Locate the marker on the map.</Tooltip.Content>
				</Tooltip.Root>
			</div>
		{/if}
		<a href={post.url} target="_blank" class="flex items-center gap-4">
			<div class="flex items-start space-x-4 relative">
				<Avatar.Root class="w-14 h-14 rounded-full">
					<Avatar.Image src={post.image} alt={post.name} />
					<Avatar.Fallback>P</Avatar.Fallback>
				</Avatar.Root>
			</div>
			<div class="flex flex-col flex-grow">
				<h6 class="text-black text-lg">
					{post.name}
					{#if !post.historical}
						<Tooltip.Root>
							<Tooltip.Trigger>
								<span class="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
							</Tooltip.Trigger>
							<Tooltip.Content>New</Tooltip.Content>
						</Tooltip.Root>
					{/if}
				</h6>
				<p class="text-gray-600 text-sm">{post.info}</p>
			</div>
		</a>
	</div>
{/if}

{#if post.type === 'pages'}
	<div class="fbposts p-4 border-b border-gray-200 {post.id} relative">
		{#if map !== null && marker !== null}
			<div class="absolute top-3 right-2 z-50">
				<Tooltip.Root>
					<Tooltip.Trigger>
						<span on:click={() => flyToMarker(marker, map)}>
							<Icon icon="uil:map-marker" class="h-7 w-7 text-gray-500" />
						</span>
					</Tooltip.Trigger>
					<Tooltip.Content>Locate the marker on the map.</Tooltip.Content>
				</Tooltip.Root>
			</div>
		{/if}
		<a href={post.url} target="_blank" class="flex items-center gap-4">
			<div class="flex items-start space-x-4 relative">
				<Avatar.Root class="w-14 h-14 rounded-full">
					<Avatar.Image src={post.image} alt={post.name} />
					<Avatar.Fallback>P</Avatar.Fallback>
				</Avatar.Root>
			</div>
			<div class="flex flex-col flex-grow">
				<h6 class="text-black text-lg">
					{post.name}
					{#if !post.historical}
						<Tooltip.Root>
							<Tooltip.Trigger>
								<span class="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
							</Tooltip.Trigger>
							<Tooltip.Content>New</Tooltip.Content>
						</Tooltip.Root>
					{/if}
				</h6>
				<p class="text-gray-600 text-sm">
					{post.followers} followers · {post.postsFrequency}
				</p>
				<p class="text-gray-600 text-xs">{post.info}</p>
			</div>
		</a>
	</div>
{/if}

{#if post.type === 'groups'}
	<div class="fbposts p-4 border-b border-gray-200 {post.id} relative">
		{#if map !== null && marker !== null}
			<div class="absolute top-3 right-2 z-50">
				<Tooltip.Root>
					<Tooltip.Trigger>
						<span on:click={() => flyToMarker(marker, map)}>
							<Icon icon="uil:map-marker" class="h-7 w-7 text-gray-500" />
						</span>
					</Tooltip.Trigger>
					<Tooltip.Content>Locate the marker on the map.</Tooltip.Content>
				</Tooltip.Root>
			</div>
		{/if}
		<a href={post.url} target="_blank" class="flex items-center gap-4">
			<div class="flex items-start space-x-4 relative">
				<Avatar.Root class="w-14 h-14 rounded-md">
					<Avatar.Image src={post.image} alt={post.name} />
					<Avatar.Fallback>P</Avatar.Fallback>
				</Avatar.Root>
			</div>
			<div class="flex flex-col flex-grow">
				<h6 class="text-black text-base">
					{post.name}
					{#if !post.historical}
						<Tooltip.Root>
							<Tooltip.Trigger>
								<span class="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
							</Tooltip.Trigger>
							<Tooltip.Content>New</Tooltip.Content>
						</Tooltip.Root>
					{/if}
				</h6>
				<p class="text-gray-600 text-sm">{post.info}</p>
			</div>
		</a>
	</div>
{/if}

{#if post.type === 'events'}
	<div class="fbposts p-4 border-b border-gray-200 {post.id} relative">
		{#if map !== null && marker !== null}
			<div class="absolute top-3 right-2 z-50">
				<Tooltip.Root>
					<Tooltip.Trigger>
						<span on:click={() => flyToMarker(marker, map)}>
							<Icon icon="uil:map-marker" class="h-7 w-7 text-gray-500" />
						</span>
					</Tooltip.Trigger>
					<Tooltip.Content>Locate the marker on the map.</Tooltip.Content>
				</Tooltip.Root>
			</div>
		{/if}
		<a href={post.url} target="_blank" class="flex items-center gap-4">
			<div class="flex items-start space-x-4 relative">
				<Avatar.Root class="w-14 h-14 rounded-md">
					<Avatar.Image src={post.image} alt={post.name} />
					<Avatar.Fallback>P</Avatar.Fallback>
				</Avatar.Root>
			</div>
			<div class="flex flex-col flex-grow">
				<span class="text-gray-600 text-xs">{post.startText}</span>
				<h6 class="text-black text-base">
					{post.name}
					{#if !post.historical}
						<Tooltip.Root>
							<Tooltip.Trigger>
								<span class="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
							</Tooltip.Trigger>
							<Tooltip.Content>New</Tooltip.Content>
						</Tooltip.Root>
					{/if}
				</h6>
				<p class="text-gray-600 text-sm">{post.attendings} · {post.location}</p>
			</div>
		</a>
	</div>
{/if}

{#if post.type === 'posts' && post.content !== null}
	<FBPosts {post} {map} {marker} />
{/if}

<style>
	.fbposts:hover {
		border-color: #007bff;
		background-color: #f0f9ff;
	}
</style>
