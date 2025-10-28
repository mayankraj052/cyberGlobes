<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card/index.ts';
	import NotFound from '$lib/components/general/NotFound.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { ApiService } from '$lib/services/api-service';
	import { formatDate, generateMapURL } from '$lib/utils/generalUtils';
	import { page } from '$app/stores';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Icon from '@iconify/svelte';
	// import { Button } from "$lib/components/ui/button/index.js";

	export let data;
	let meta = data?.searchRequests?.meta || {};
	let searchRequests = data?.searchRequests?.data || [];
	let error = data?.error || null;
	let queryParam;
	$: queryParam = $page.url.searchParams.get('page');

	function getPaginationNumbers() {
		if (!meta || !meta.current_page || !meta.last_page) return [];

		const { current_page, last_page } = meta;
		const pages = [];
		const delta = 2; // Number of pages before and after the current page

		const range = [];
		for (
			let i = Math.max(1, current_page - delta);
			i <= Math.min(last_page, current_page + delta);
			i++
		) {
			range.push(i);
		}

		// Ensure the first page is always included
		if (!range.includes(1)) {
			pages.push(1);
			if (range[0] > 2) pages.push('...');
		}

		pages.push(...range);

		// Ensure the last page is always included
		if (!range.includes(last_page)) {
			if (range[range.length - 1] < last_page - 1) pages.push('...');
			pages.push(last_page);
		}

		return pages;
	}

	async function fetchSearchRequests(pageNumber = 1) {
		try {
			if (meta?.current_page == pageNumber) return;

			let apiService = new ApiService();
			const response = await apiService.makeApiCall(`search-requests?page=${pageNumber}`);

			if (response.error) {
				throw new Error(response.error);
			}

			searchRequests = [...(response.search_requests?.data || [])];
			meta = { ...(response.search_requests?.meta || {}) };

			error = null;
		} catch (err) {
			error = err.message;
			console.error('Pagination Error:', err);
		}
	}

	async function goToPage(pageNumber) {
		if (meta.current_page !== pageNumber) {
			goto(`?page=${pageNumber}`, { noScroll: true });
			await fetchSearchRequests(pageNumber);

			if (typeof window !== 'undefined') {
				setTimeout(() => {
					window.scrollTo({ top: 50, behavior: 'smooth' });
				}, 100);
			}
		}
	}

	$: if (!queryParam || error) {
		fetchSearchRequests();
	}
</script>

<div class="container max-w-100">
	<div class="flex-1 space-y-4">
		<h2 class="text-3xl font-bold tracking-tight text-dark dark:text-white">Request</h2>

		<div
			class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
		>
			<ul class="flex flex-wrap -mb-px">
				<li class="me-2">
					<a
						href="/my-requests"
						class="inline-block p-4 text-primary border-b-2 border-primary rounded-t-lg active dark:text-primary dark:border-primary"
						aria-current="page">My Request</a
					>
				</li>
				<li class="me-2">
					<a
						href="/saved-requests"
						class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
						>Saved Request</a
					>
				</li>
			</ul>
		</div>

		<Card.Root class="col-span-4">
			<Card.Header>
				<Card.Title>History</Card.Title>
			</Card.Header>
			<Card.Content>
				{#if error}
					<NotFound message={'No request found!!'} />
				{:else}
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head class="w-[300px]">Address</Table.Head>
								<Table.Head>Coordinate</Table.Head>
								<Table.Head>Origin</Table.Head>
								<Table.Head>Credits</Table.Head>
								<Table.Head>Status</Table.Head>
								<Table.Head>Date</Table.Head>
								<Table.Head>Action</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each searchRequests as request}
								<Table.Row>
									<Table.Cell class="font-medium">
										<a href={generateMapURL(request)} target="_blank">
											{request.address || 'N/A'}
											<Icon icon="line-md:map-marker-radius" class="text-blue-500 h-5 w-5 inline" />
										</a>
									</Table.Cell>
									<Table.Cell
										>{request.request_params.latitude}, {request.request_params
											.longitude}</Table.Cell
									>
									<Table.Cell>{request.request_origin}</Table.Cell>
									<Table.Cell>{request.api_credits}</Table.Cell>
									<Table.Cell>
										{#if request.is_completed}
											<Badge class="bg-primary">Complete</Badge>
										{:else}
											<Badge
												class="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
												>Pending</Badge
											>
										{/if}
									</Table.Cell>
									<Table.Cell>{formatDate(request.created_at)}</Table.Cell>

									<Table.Cell class="text-right">
										<DropdownMenu.Root>
											<DropdownMenu.Trigger>
												<Icon icon="pepicons-pop:dots-y" />
											</DropdownMenu.Trigger>
											<DropdownMenu.Content>
												<DropdownMenu.Group>
													<DropdownMenu.Item>
														<a href={`my-requests/${request.id}`} class="w-full">View</a>
													</DropdownMenu.Item>
													<DropdownMenu.Item>
														<a href={generateMapURL(request)} target="_blank" class="w-full">
															Load on map
														</a>
													</DropdownMenu.Item>
												</DropdownMenu.Group>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
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
								class="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600
									hover:bg-primary-200 dark:hover:bg-gray-700
									{meta.current_page === page ? 'bg-primary dark:bg-gray-600 text-white' : ''}"
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
		</Card.Root>
	</div>
</div>
