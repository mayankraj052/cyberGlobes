<script lang="ts">
	import { onMount } from 'svelte';
	import * as Table from '$lib/components/ui/table';
	import { page } from '$app/stores';
	import NotFound from '$lib/components/general/NotFound.svelte';
	import { ApiService } from '$lib/services/api-service';
	import GetBack from '$lib/components/general/GetBack.svelte';
	import TableShimmer from '$lib/components/general/shimmer/TableShimmer.svelte';
	import Tweet from '$lib/components/ui/map/social-cards/x-twitter/Tweet.svelte';
	import CardShimmer from '$lib/components/general/shimmer/CardShimmer.svelte';

	const slug = 'x-twitter';
	$: id = $page.params.id;
	let loader = true;
	let tweets;
	let error = false;

	let topTweets = [];
	let latestTweets = [];

	async function fetchTwitter(pageNumber = 1) {
		try {
			let apiService = new ApiService();
			let res = await apiService.makeApiCall(`search-requests/${id}/${slug}`);
			if (!res.success) {
				throw new Error(res.message);
			}

			res?.response?.forEach((element) => {
				if (element.response?.top != undefined) {
					topTweets.push(element.response);
				}
				if (element.response?.latest != undefined) {
					latestTweets.push(element.response);
				}
			});

			tweets = [...(res?.response?.response?.tweets || [])];
			error = false;
		} catch (err) {
			error = true;
			console.error('Error:', err);
		} finally {
			loader = false;
		}
	}

	onMount(async () => {
		await fetchTwitter();
	});
</script>

<div class="container max-w-100">
	<div class="flex-1 space-y-4">
		<h2 class="text-3xl font-bold tracking-tight text-dark dark:text-white">X (Twitter)</h2>
		<GetBack url={`/my-requests/${id}`} />
		{#if !loader}
			{#if error}
				<NotFound message={'No data found!!'} />
			{:else}
				<!-- Top -->
				<div class="columns-2 gap-4 p-4 space-y-4">
					{#each topTweets as topTweet}
						{#each topTweet.top.tweets as tweet}
							<div class="break-inside-avoid bg-white shadow-lg rounded-2xl p-4">
								<Tweet
									tweet={{
										id: tweet.entryId,
										content: tweet.tweet.full_text,
										url: tweet.tweet.url ?? '#',
										type: tweet.tweet.extended_entities?.media?.[0]?.type || 'text',
										postMedia: tweet.tweet.extended_entities?.media?.[0]?.media_url_https || null,
										isUserVerified: tweet.tweet.user_details?.verified,
										userName: tweet.tweet.user_details?.name,
										userScreenName: tweet.tweet.user_details?.screen_name,
										userProfilePhoto: tweet.tweet.user_details?.profile_image_url_https,
										lat: tweet.tweet.place?.bounding_box?.coordinates?.[0]?.[0]?.[1] ?? null,
										lng: tweet.tweet.place?.bounding_box?.coordinates?.[0]?.[0]?.[0] ?? null,
										favoriteCount: tweet.tweet.favorite_count,
										replyCount: tweet.tweet.reply_count,
										retweetCount: tweet.tweet.retweet_count,
										postTime: tweet.tweet.created_at
									}}
								/>
							</div>
						{/each}
					{/each}
				</div>

				<!-- Latest -->
				<div class="columns-2 gap-4 p-4 space-y-4">
					{#each latestTweets as latestTweet}
						{#each latestTweet.latest.tweets as tweet}
							<div class="break-inside-avoid bg-white shadow-lg rounded-2xl p-4">
								<Tweet
									tweet={{
										id: tweet.entryId,
										content: tweet.tweet.full_text,
										url: tweet.tweet.url ?? '#',
										type: tweet.tweet.extended_entities?.media?.[0]?.type || 'text',
										postMedia: tweet.tweet.extended_entities?.media?.[0]?.media_url_https || null,
										isUserVerified: tweet.tweet.user_details?.verified,
										userName: tweet.tweet.user_details?.name,
										userScreenName: tweet.tweet.user_details?.screen_name,
										userProfilePhoto: tweet.tweet.user_details?.profile_image_url_https,
										lat: tweet.tweet.place?.bounding_box?.coordinates?.[0]?.[0]?.[1] ?? null,
										lng: tweet.tweet.place?.bounding_box?.coordinates?.[0]?.[0]?.[0] ?? null,
										favoriteCount: tweet.tweet.favorite_count,
										replyCount: tweet.tweet.reply_count,
										retweetCount: tweet.tweet.retweet_count,
										postTime: tweet.tweet.created_at
									}}
								/>
							</div>
						{/each}
					{/each}
				</div>
			{/if}
		{:else}
			<div class="w-full grid grid-cols-2 gap-4 p-4">
				<CardShimmer rows={16} />
			</div>
		{/if}
	</div>
</div>
