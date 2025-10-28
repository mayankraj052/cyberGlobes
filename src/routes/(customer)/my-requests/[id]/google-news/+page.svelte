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

	const slug = 'google-news';
	$: id = $page.params.id;
	let loader = true;
	let news = [];

	async function fetchGoogleNews(pageNumber = 1) {
		try {
			let apiService = new ApiService();
			let res = await apiService.makeApiCall(`search-requests/${id}/${slug}`);

			if (!res.success) {
				throw new Error(res.error);
			}

			news = [...(res?.response?.response?.news || [])];
		} catch (err) {
			console.error('Pagination Error:', err);
		} finally {
			loader = false;
		}
	}

	onMount(async () => {
		await fetchGoogleNews();
	});
</script>

<div class="container max-w-100">
	<div class="flex-1 space-y-4">
		<h2 class="text-3xl font-bold tracking-tight text-dark dark:text-white">Facebook</h2>
		<GetBack url={`/my-requests/${id}`} />
		<Card.Root class="col-span-4">
			<Card.Content>
				{#if !loader}
					{#if news.length == 0}
						<NotFound message={'No data found!!'} />
					{:else}
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>Source</Table.Head>
									<Table.Head>Title</Table.Head>
									<Table.Head>Snippet</Table.Head>
									<Table.Head>Date</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each news as article}
									<Table.Row>
										<!-- News Source with Logo -->
										<Table.Cell class="font-medium">
											<div class="flex items-center gap-2">
												<Avatar.Root class="h-8 w-8">
													<Avatar.Image
														src={article.imageUrl || 'fallback-news.png'}
														alt={article.source}
													/>
													<Avatar.Fallback>{article.source[0]}</Avatar.Fallback>
												</Avatar.Root>
												{article.source}
											</div>
										</Table.Cell>

										<!-- News Title (Clickable Link) -->
										<Table.Cell>
											<a href={article.link} target="_blank" class="text-blue-500 hover:underline">
												{article.title}
											</a>
										</Table.Cell>

										<!-- News Snippet -->
										<Table.Cell>
											{article.snippet || 'No description available.'}
										</Table.Cell>

										<!-- Published Date -->
										<Table.Cell>
											{article.date || 'Unknown'}
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
