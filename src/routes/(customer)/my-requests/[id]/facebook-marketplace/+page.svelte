<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import NotFound from '$lib/components/general/NotFound.svelte';
	import { ApiService } from '$lib/services/api-service';
	import GetBack from '$lib/components/general/GetBack.svelte';
	import CardShimmer from '$lib/components/general/shimmer/CardShimmer.svelte';
	import FacebookMarketplaceItem from '$lib/components/ui/map/social-cards/facebook-marketplace/FacebookMarketplaceItem.svelte';
	import FacebookMarketPlaceIconImg from '$lib/assets/svg/marker/facebook-marketplace-pin.svg';

	const slug = 'facebook-marketplace';
	$: id = $page.params.id;
	let loader = true;
	let marketplaceData = [];

	async function fetchFacebookMarketPlace(pageNumber = 1) {
		try {
			let apiService = new ApiService();
			let res = await apiService.makeApiCall(`search-requests/${id}/${slug}`);
			if (!res.success) {
				throw new Error(res.error);
			}

			marketplaceData = res.response.flatMap(
				(fbmResponse) =>
					fbmResponse.response.data.marketplace_search.feed_units.edges
						.map((post) => {
							if (post.node?.data?.title) {
								return {
									id: post.node.entity_id,
									title: post.node?.data?.title || '',
									description: post.node?.data?.description || '',
									image: post.node?.photo?.image?.uri || FacebookMarketPlaceIconImg,
									lat: null,
									lng: null,
									url: `https://www.facebook.com/marketplace/item/${post.node.entity_id}`,
									price: post.node?.data?.price?.amount_with_offset
										? (Number(post.node.data.price.amount_with_offset) / 100).toLocaleString()
										: null,
									currency: post.node?.data?.price?.currency || null
								};
							}
							return null;
						})
						.filter(Boolean) // Remove null values
			);
		} catch (err) {
			console.error('Pagination Error:', err);
		} finally {
			loader = false;
		}
	}

	onMount(async () => {
		await fetchFacebookMarketPlace();
	});
</script>

<div class="container max-w-100">
	<div class="flex-1 space-y-4">
		<h2 class="text-3xl font-bold tracking-tight text-dark dark:text-white">
			Facebook Marketplace
		</h2>
		<GetBack url={`/my-requests/${id}`} />
		{#if !loader}
			{#if marketplaceData.length === 0}
				<NotFound message={'No data found!!'} />
			{:else}
				<!-- Top -->
				<div class="columns-2 gap-4 p-4 space-y-4">
					{#each marketplaceData as marketplace}
						<div class="break-inside-avoid bg-white shadow-lg rounded-2xl p-4">
							<FacebookMarketplaceItem post={marketplace} />
						</div>
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
