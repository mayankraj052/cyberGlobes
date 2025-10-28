<script>
	import Icon from '@iconify/svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { formatToSocialMediaDate } from '$lib/utils/dateTimeUtils.js';
	import { flyToMarker } from '$lib/utils/mapUtils.js';
	import CountIconTooltip from '../../CountIconTooltip.svelte';

	export let post;
	export let map = null;
	export let marker = null;

	const userClass = 'font-bold text-gray-900';
	const profileImageClass = 'w-10 h-10 rounded-full';
	const mutedTextClass = 'text-gray-500';
	const actionsClass = 'flex items-center justify-between text-gray-500 text-sm mt-3';
</script>

<div class="fbpost p-4 border-b border-gray-200 {post.id} relative">
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
	<a href={post.url} target="_blank">
		<div class="flex items-start space-x-4 relative">
			<!-- Profile Section -->
			<img alt="Profile" class={profileImageClass} src={post.userProfilePhoto} />
			<div class="w-full">
				<!-- User Information Section -->
				<div class="flex items-center space-x-1">
					<span class={userClass}>{post.userName}</span>
					{#if !post.historical}
						<Tooltip.Root>
							<Tooltip.Trigger>
								<span class="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
							</Tooltip.Trigger>
							<Tooltip.Content>New</Tooltip.Content>
						</Tooltip.Root>
					{/if}
				</div>

				<div class="flex items-center space-x-1">
					<span class={mutedTextClass}>
						<Tooltip.Root>
							<Tooltip.Trigger>
								{formatToSocialMediaDate(post.postTime, true)}
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>{new Date(post.postTime * 1000).toISOString()}</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</span>
				</div>
			</div>
		</div>
		<div>
			<p class="text-gray-800 mt-1">{@html post.content.split('\n').join('<br/>')}</p>
			{#if post.postType === 'MediaAttachment' || post.postType === 'PhotoSetAttachment'}
				<div class="mt-3">
					<img src={post.postMedia} alt="FB Image" class="rounded-lg w-100" />
				</div>
			{/if}

			{#if post.postType === 'VideoAttachment' || post.postType === 'FBShortsStoryAttachment'}
				<div class="mt-3 relative">
					<img src={post.postMedia} alt="Video Thumbnail" class="rounded-lg w-full" />
					<button class="absolute inset-0 flex items-center justify-center">
						<div class="bg-black bg-opacity-50 p-3 rounded-full">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-10 w-10 text-white transition transform hover:scale-110"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M8 5v14l11-7z" />
							</svg>
						</div>
					</button>
				</div>
			{/if}

			<!-- Actions Section -->
			<div class={actionsClass}>
				<CountIconTooltip count={post.like} icon="meteor-icons:thumbs-up" text="Like" />
				<CountIconTooltip count={post.comment} icon="teenyicons:chat-outline" text="Comment" />
				<CountIconTooltip count={post.share} icon="uil:share" text="Share" />
			</div>
		</div>
	</a>
</div>

<style>
	.fbpost:hover {
		border-color: #007bff;
		background-color: #f0f9ff;
	}
</style>
