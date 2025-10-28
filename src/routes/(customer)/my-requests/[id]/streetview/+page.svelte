<script lang="ts">
	import { onMount } from 'svelte';
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card/index.ts';
	import { page } from '$app/stores';
	import NotFound from '$lib/components/general/NotFound.svelte';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import { ApiService } from '$lib/services/api-service';
	import GetBack from '$lib/components/general/GetBack.svelte';
	import TableShimmer from '$lib/components/general/shimmer/TableShimmer.svelte';
	import { PANOID_BASE_URL } from '$lib/constants/constants.js';

	$: id = $page.params.id;
	const slug = 'streetview';

	let loader = true;

	export let data;
	let streetViews = data?.streetview?.response?.data || [];
	let meta = data?.streetview?.response || [];
	let response_id = null;
	function getPaginationNumbers() {
		if (!meta || !meta.current_page || !meta.last_page) return [];

		const { current_page, last_page } = meta;
		const pages = [];
		const delta = 2;

		const range = [];
		for (
			let i = Math.max(1, current_page - delta);
			i <= Math.min(last_page, current_page + delta);
			i++
		) {
			range.push(i);
		}

		if (!range.includes(1)) {
			pages.push(1);
			if (range[0] > 2) pages.push('...');
		}

		pages.push(...range);

		if (!range.includes(last_page)) {
			if (range[range.length - 1] < last_page - 1) pages.push('...');
			pages.push(last_page);
		}

		return pages;
	}

	async function fetchStreetView(pageNumber = 1) {
		try {
			if (meta?.current_page == pageNumber) return;

			let apiService = new ApiService();
			let res = await apiService.makeApiCall(`search-requests/${id}/streetview?page=${pageNumber}`);

			if (!res.success) {
				throw new Error(res.error);
			}
			response_id = res?.response?.request_id;
			streetViews = [...(res?.response?.response?.data || [])];
			meta = { ...(res.response?.response || {}) };
		} catch (err) {
			console.error('Pagination Error:', err);
		} finally {
			loader = false;
		}
	}

	let downloadLoaders = [];
	async function downloadPanoid(panoid_id: string) {
		try {
			if (response_id === null || !panoid_id) return;

			downloadLoaders = [...downloadLoaders, panoid_id];

			let apiService = new ApiService();

			let res = await apiService.makeApiCall(
				`search-requests/${response_id}/${panoid_id}/download`,
				{},
				'GET',
				'blob'
			);

			if (!res) {
				throw new Error('No response from server');
			}

			// Handle binary data (Blob)
			const blob = new Blob([res], { type: 'image/jpeg' });
			const url = URL.createObjectURL(blob);

			// Create a temporary link to trigger the download
			const a = document.createElement('a');
			a.href = url;
			a.download = `${panoid_id}.jpg`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);

			// Release object URL to free up memory
			URL.revokeObjectURL(url);
		} catch (err) {
			console.error('Something went wrong, please try again.', err);
		} finally {
			downloadLoaders = downloadLoaders.filter((id) => id !== panoid_id);
		}
	}

	async function goToPage(pageNumber) {
		if (meta.current_page !== pageNumber) {
			goto(`?page=${pageNumber}`, { noScroll: true });
			await fetchStreetView(pageNumber);

			if (typeof window !== 'undefined') {
				setTimeout(() => {
					window.scrollTo({ top: 50, behavior: 'smooth' });
				}, 100);
			}
		}
	}

	onMount(async () => {
		await fetchStreetView();
	});
</script>

<div class="container max-w-100">
	<div class="flex-1 space-y-4">
		<h2 class="text-3xl font-bold tracking-tight text-dark dark:text-white">Panoids</h2>
		<GetBack url={`/my-requests/${id}`} />

		<Card.Root class="col-span-4">
			{#if !loader}
				<Card.Content>
					{#if streetViews.length == 0}
						<NotFound message={'No data found!!'} />
					{:else}
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>Panoid</Table.Head>
									<Table.Head>Latitude</Table.Head>
									<Table.Head>Longitude</Table.Head>
									<Table.Head>Image</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each streetViews as streetView}
									<Table.Row>
										<Table.Cell class="font-medium">
											<a
												href={`${PANOID_BASE_URL}${streetView.panoid}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												{streetView.panoid}
											</a>
										</Table.Cell>

										<Table.Cell>{streetView.lat}</Table.Cell>
										<Table.Cell>{streetView.lon}</Table.Cell>
										<Table.Cell>
											{#if downloadLoaders.includes(streetView.panoid)}
												<Icon
													icon="line-md:downloading-loop"
													class="text-blue-500"
													width="24"
													height="24"
												/>
											{:else}
												<button on:click={() => downloadPanoid(streetView.panoid)}>
													<Icon
														icon="lucide:download"
														class="text-blue-500"
														width="24"
														height="24"
													/>
												</button>
											{/if}
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
						<!-- Pagination Controls -->
						<div class="flex items-center justify-end space-x-2 py-4">
							<div class="text-muted-foreground flex-1 text-sm">
								{meta.to ?? 0} of {meta.total ?? 0} row(s) showing.
							</div>

							<!-- Previous Button -->
							<button
								class="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
								on:click={() => goToPage(meta.current_page - 1)}
								disabled={meta.current_page === 1}
							>
								Previous
							</button>

							<!-- Page Numbers -->
							{#each getPaginationNumbers() as page}
								<button
									class="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 hover:bg-primary-200 dark:hover:bg-gray-700 {meta.current_page ===
									page
										? 'bg-primary dark:bg-gray-600 text-white'
										: ''}"
									on:click={() => goToPage(page)}
								>
									{page}
								</button>
							{/each}

							<!-- Next Button -->
							<button
								class="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
								on:click={() => goToPage(meta.current_page + 1)}
								disabled={meta.current_page === meta.last_page}
							>
								Next
							</button>
						</div>
					{/if}
				</Card.Content>
			{:else}
				<Card.Content>
					<div class="w-full">
						<TableShimmer rows={15} />
					</div>
				</Card.Content>
			{/if}
		</Card.Root>
	</div>
</div>
