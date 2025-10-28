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

	const slug = 'linkedin';
	$: id = $page.params.id;
	let loader = true;
	let posts;

	async function fetchLinkedin(pageNumber = 1) {
		try {
			let apiService = new ApiService();
			let res = await apiService.makeApiCall(`search-requests/${id}/${slug}`);
			if (!res.success) {
				throw new Error(res.error);
			}

			posts = [...(res?.response?.response?.posts || [])];
		} catch (err) {
			console.error('Pagination Error:', err);
		} finally {
			loader = false;
		}
	}

	onMount(async () => {
		await fetchLinkedin();
	});
</script>

<div class="container max-w-100">
	<div class="flex-1 space-y-4">
		<h2 class="text-3xl font-bold tracking-tight text-dark dark:text-white">Linkedin</h2>
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
									<Table.Head>User</Table.Head>
									<Table.Head>Description</Table.Head>
									<Table.Head>Date</Table.Head>
									<Table.Head>Likes</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each posts as post}
									<Table.Row>
										<Table.Cell class="font-medium">
											<a href={post.author.url} target="_blank">
												<img
													src={post.author.image_url}
													alt="{post.author.first_name} {post.author.last_name}"
													class="rounded-full"
													width="40"
													height="40"
												/>
												{post.author.first_name}
												{post.author.last_name}
											</a>
										</Table.Cell>
										<Table.Cell>
											<a href={post.url} target="_blank">{post.text}</a>
										</Table.Cell>
										<Table.Cell>{formatDate(post.created_at)}</Table.Cell>
										<Table.Cell>{post.likes}</Table.Cell>
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
