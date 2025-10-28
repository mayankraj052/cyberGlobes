<script>
	import { hoveredPostId, socialMediaJson } from '$lib/stores/mapStore.ts';
	import { highlightMarker } from '$lib/utils/mapUtils.js';
	import { sanitizeId } from '$lib/utils/generalUtils.js';
	import FacebookPostCollection from '$lib/components/ui/map/social-cards/facebook/FacebookPostCollection.svelte';

	export let markers;
	export let map;

	let postIds = [];
	let posts = [];

	$: {
		const facebookSocialData = $socialMediaJson?.socialData?.filter(
			(socialMedia) => socialMedia.type === 'facebook'
		);
		if (Array.isArray(facebookSocialData)) {
			postIds = [];
			posts = [];
			facebookSocialData.forEach((data) => {
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

<div class="facebook">
	{#if posts}
		{#each Object.keys(posts) as key}
			{#if posts[key].length > 0}
				<div class="sticky top-0 bg-white z-[100] p-2 border-b border-gray-200">
					<h2 class="text-lg font-bold">{key.toUpperCase()}</h2>
				</div>
				{#each posts[key] as post}
					<div
						data-type="facebook"
						class="post-row post-{sanitizeId(post.id)}"
						class:highlighted={$hoveredPostId === post.id}
						on:mouseover={() => highlightMarker(markers['facebook']?.[post.id], map, true)}
						on:mouseleave={() => highlightMarker(markers['facebook']?.[post.id], map, false)}
					>
						<FacebookPostCollection {post} {map} marker={markers['facebook']?.[post.id]} />
					</div>
				{/each}
			{/if}
		{/each}
	{/if}
</div>
