<script>
	import Icon from '@iconify/svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import TweetTooltip from './TweetTooltip.svelte';
	import TextTweet from '$lib/components/ui/map/social-cards/x-twitter/TextTweet.svelte';
	import ImageTweet from '$lib/components/ui/map/social-cards/x-twitter/ImageTweet.svelte';
	import VideoTweet from '$lib/components/ui/map/social-cards/x-twitter/VideoTweet.svelte';
	import { formatToSocialMediaDate } from '$lib/utils/dateTimeUtils.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/';
	import { flyToMarker } from '$lib/utils/mapUtils.js';

	export let tweet;
	export let map = null;
	export let marker = null;

	const userClass = 'font-bold text-gray-900';
	const profileImageClass = 'w-10 h-10 rounded-full';
	const verifyIconClass = 'h-5 w-5 text-blue-500';
	const mutedTextClass = 'text-gray-500';
	const actionsClass = 'flex items-center justify-between text-gray-500 text-sm mt-3';
</script>

<div class="tweet p-4 border-b border-gray-200 {tweet.id} relative">
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
	<a href={tweet.url} target="_blank">
		<div class="flex items-start space-x-4 relative">
			<!-- Profile Section -->
			<img alt="Profile" class={profileImageClass} src={tweet.userProfilePhoto} />
			<div class="w-full">
				<!-- User Information Section -->
				<div class="flex items-center space-x-1">
					<span class={userClass}>{tweet.userName}</span>
					{#if tweet.isUserVerified}
						<Icon icon="bitcoin-icons:verify-filled" class={verifyIconClass} />
					{/if}
					{#if !tweet.historical}
						<Tooltip.Root>
							<Tooltip.Trigger>
								<span class="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
							</Tooltip.Trigger>
							<Tooltip.Content>New</Tooltip.Content>
						</Tooltip.Root>
					{/if}
				</div>

				<div class="flex items-center space-x-1">
					<span class={mutedTextClass}
						>@{tweet.userScreenName} ·
						<Tooltip.Root>
							<Tooltip.Trigger>
								{formatToSocialMediaDate(tweet.postTime)}
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>{tweet.postTime}</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</span>
				</div>

				<!-- Post Content Section -->
				{#if tweet.type === 'video'}
					<VideoTweet content={tweet.content} media={tweet.postMedia} />
				{:else if tweet.type === 'photo'}
					<ImageTweet content={tweet.content} media={tweet.postMedia} />
				{:else}
					<TextTweet content={tweet.content} />
				{/if}

				<!-- Actions Section -->
				<div class={actionsClass}>
					<TweetTooltip count={tweet.replyCount} icon="lineicons:comment-1" text="Reply" />
					<TweetTooltip
						count={tweet.retweetCount}
						icon="garden:arrow-retweet-stroke-16"
						text="Repost"
					/>
					<TweetTooltip
						count={tweet.favoriteCount}
						icon="material-symbols:favorite-outline-rounded"
						text="Like"
					/>
				</div>
			</div>
		</div>
	</a>
</div>

<style>
	.tweet:hover {
		border-color: #007bff;
		background-color: #f0f9ff;
	}
</style>
