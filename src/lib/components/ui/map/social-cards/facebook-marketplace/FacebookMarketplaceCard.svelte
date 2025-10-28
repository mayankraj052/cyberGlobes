<script>
	import { hoveredPostId, socialMediaJson } from '$lib/stores/mapStore.ts';
	import { highlightMarker } from '$lib/utils/mapUtils.js';
	import { sanitizeId } from '$lib/utils/generalUtils.js';
	import FacebookMarketplaceItem from '$lib/components/ui/map/social-cards/facebook-marketplace/FacebookMarketplaceItem.svelte';

	export let markers;
	export let map;

	let postIds = [];
	let posts = [];

	$: {
		const facebookMarketplaceSocialData = $socialMediaJson?.socialData?.filter(
			(socialMedia) => socialMedia.type === 'facebook-marketplace'
		);

		if (Array.isArray(facebookMarketplaceSocialData)) {
			postIds = [];
			posts = [];
			facebookMarketplaceSocialData.forEach((data) => {
				Object.entries(data.posts).forEach(([key, value]) => {
					if (!postIds.includes(value.id)) {
						postIds.push(value.id);
						posts.push(value);
					}
				});
			});
		}
	}
</script>

<div>
	{#if posts}
		{#each posts as post}
			<div
				data-type="facebook-marketplace"
				class="post-row post-{sanitizeId(post.id)}"
				class:highlighted={$hoveredPostId === post.id}
				on:mouseover={() => highlightMarker(markers['facebook-marketplace']?.[post.id], map, true)}
				on:mouseleave={() =>
					highlightMarker(markers['facebook-marketplace']?.[post.id], map, false)}
			>
				<FacebookMarketplaceItem {post} marker={markers['facebook-marketplace']?.[post.id]} {map} />
			</div>
		{/each}
	{/if}
</div>

<style>
</style>
