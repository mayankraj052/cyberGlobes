<script lang="ts">
	import { onMount } from 'svelte';
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card/index.ts';
	import { page } from '$app/stores';
	import NotFound from '$lib/components/general/NotFound.svelte';
	import { ApiService } from '$lib/services/api-service';
	import GetBack from '$lib/components/general/GetBack.svelte';
	import TableShimmer from '$lib/components/general/shimmer/TableShimmer.svelte';
	import { formatDate } from '$lib/utils/generalUtils';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import Icon from '@iconify/svelte';

	const slug = 'instagram';
	$: id = $page.params.id;
	let loader = true;

	let posts = [];
	async function fetchInstagram(pageNumber = 1) {
		try {
			let apiService = new ApiService();
			let res = await apiService.makeApiCall(`search-requests/${id}/${slug}`);

			if (!res.success) {
				throw new Error(res.error);
			}

			posts = instagramDataPrepare(res?.response?.response);
		} catch (err) {
			console.error('Pagination Error:', err);
		} finally {
			loader = false;
		}
	}

	function instagramDataPrepare(data) {
		const posts = (data?.media_grid?.sections || [])
			.map((section) => {
				const item = section?.layout_content?.one_by_two_item?.clips?.items?.[0]?.media;

				if (item) {
					return {
						id: item.pk || null,
						title: item?.caption?.text || '@' + item?.user?.username || 'Unknown',
						image: item?.image_versions2?.candidates?.[0]?.url || '',
						url: item?.code ? `https://www.instagram.com/p/${item.code}/` : '#',
						username: item?.user?.username || 'Unknown',
						full_name: item?.user?.full_name || 'Unknown',
						lat: null,
						lng: null,
						profile_pic_url: item?.user?.profile_pic_url || ''
					};
				}
			})
			.filter(Boolean);

		return posts;
	}

	onMount(async () => {
		await fetchInstagram();
	});
</script>

<div class="container max-w-100">
	<div class="flex-1 space-y-4">
		<h2 class="text-3xl font-bold tracking-tight text-dark dark:text-white">Instagram</h2>
		<GetBack url={`/my-requests/${id}`} />
		<Card.Root class="col-span-4">
			<Card.Content>
				{#if !loader}
					{#if posts.length == 0}
						<NotFound message={'No data found!!'} />
					{:else}
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>Image</Table.Head>
									<Table.Head>User</Table.Head>
									<Table.Head>Post</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each posts as post}
									<Table.Row>
										<!-- Post Image -->
										<Table.Cell>
											<Icon class="w-8 h-8" icon="lucide:instagram" />
										</Table.Cell>
										<!-- User Info -->
										<Table.Cell class="font-medium">
											<a href={post.url} target="_blank">
												{post.full_name} (@{post.username})
											</a>
										</Table.Cell>

										<!-- Post Title (Caption) -->
										<Table.Cell>
											<a href={post.url} target="_blank">
												{post.title}
											</a>
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					{/if}
				{:else}
					<div class="w-full">
						<TableShimmer rows={15} />
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
</div>
