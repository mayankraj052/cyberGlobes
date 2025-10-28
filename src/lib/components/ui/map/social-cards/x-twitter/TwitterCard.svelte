<script>
	import Tweet from '$lib/components/ui/map/social-cards/x-twitter/Tweet.svelte';
	import { getSocialMediaTabs } from '$lib/utils/socialMediaUtils.js';
	import { hoveredPostId, socialMediaJson } from '$lib/stores/mapStore.ts';
	import { highlightMarker } from '$lib/utils/mapUtils.js';
	import { sanitizeId } from '$lib/utils/generalUtils.js';

	export let markers;
	export let map;

	const xTwitterTabs = getSocialMediaTabs('x-twitter');

	// Get the X (Twitter) platform
	let postIds = [];
	let posts = [];

	$: {
		const twitterSocialData = $socialMediaJson?.socialData?.filter(
			(socialMedia) => socialMedia.type === 'x-twitter'
		);
		if (Array.isArray(twitterSocialData)) {
			postIds = [];
			posts = [];
			twitterSocialData.forEach((data) => {
				Object.entries(data.posts).forEach(([key, value]) => {
					value.forEach((post) => {
						if (!postIds.includes(post.id)) {
							postIds.push(post.id);
							if (!posts[key]) {
								posts[key] = [];
							}
							posts[key].push(post);
						}
					});
				});
			});
		}
	}
</script>

<div class="tweets">
	{#if posts}
		{#each Object.keys(posts) as key}
			{#if posts[key].length > 0}
				{#each posts[key] as post}
					<div
						data-type="x-twitter"
						class="post-row post-{sanitizeId(post.id)}"
						class:highlighted={$hoveredPostId === post.id}
						on:mouseover={() => highlightMarker(markers['x-twitter']?.[post.id], map, true)}
						on:mouseleave={() => highlightMarker(markers['x-twitter']?.[post.id], map, false)}
					>
						<Tweet tweet={post} {map} marker={markers['x-twitter']?.[post.id]} />
					</div>
				{/each}
			{/if}
		{/each}
	{/if}
</div>
