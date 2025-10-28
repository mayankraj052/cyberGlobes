<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card/index.ts';
	import NotFound from '$lib/components/general/NotFound.svelte';
	import Icon from '@iconify/svelte';
	import { formatDate, generateMapURL } from '$lib/utils/generalUtils';
	import { buttonVariants } from '$lib/components/ui/button';
	import GetBack from '$lib/components/general/GetBack.svelte';
	import { ApiService } from '$lib/services/api-service';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let data;
	let searchRequest = data?.searchRequest;
	let features = searchRequest?.request_params?.features || [];
	$: id = $page.params.id;
	let error = data?.error || null;

	const icons = {
		'x-twitter': { icon: 'ri:twitter-x-fill', label: 'X (Twitter)' },
		streetview: { icon: 'lucide:map-pinned', label: 'Panoids' },
		linkedin: { icon: 'mdi:linkedin', label: 'Linkedin' },
		facebook: { icon: 'lucide:facebook', label: 'Facebook' },
		'facebook-marketplace': { icon: 'lucide:facebook', label: 'Marketplace' },
		instagram: { icon: 'lucide:instagram', label: 'Instagram' },
		'google-news': { icon: 'simple-icons:googlenews', label: 'Google News' }
	};

	async function fetchMyRequestByID() {
		try {
			let apiService = new ApiService();
			const response = await apiService.makeApiCall(`search-requests/${id}`, {}, 'GET', 'json');

			if (response.error) {
				throw new Error(response.error);
			}

			if (!response.success) {
				error = response.message;
				return false;
			}

			searchRequest = response.search_request;
			features = searchRequest?.request_params?.features || [];
			error = null;
		} catch (err) {
			error = err.message;
			console.error('Error:', err);
		}
	}

	onMount(() => {
		if (error) {
			fetchMyRequestByID();
		}
	});
</script>

<div class="container max-w-100">
	<div class="flex-1 space-y-4">
		<h2 class="text-3xl font-bold tracking-tight text-dark dark:text-white">Search Request</h2>
		<GetBack url={`/my-requests`} />
		{#if !error}
			<a
				href={generateMapURL(searchRequest)}
				class={`${buttonVariants({ variant: 'outline' })} float-end`}
				target=""
			>
				<Icon icon="quill:link-out" class="me-2" /> Load on Map
			</a>
		{/if}
		<Card.Root class="col-span-4">
			<Card.Content>
				{#if error}
					<NotFound message={'No request found!!'} />
				{:else}
					<div class="grid gap-4">
						<!-- Address & Coordinates Section -->
						<div class="grid gap-3 md:grid-cols-1">
							<!-- Address Block -->
							<div
								class="flex items-center gap-4 p-4 border rounded-xl shadow-md bg-white dark:bg-gray-900 dark:border-gray-700"
							>
								<Icon icon="lucide:map-pin" class="text-primary h-7 w-7" />
								<div>
									<h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
										{searchRequest.address || 'N/A'}
									</h4>
									<p class="text-sm text-gray-600 dark:text-gray-400">
										{searchRequest.request_params.latitude}, {searchRequest.request_params
											.longitude}
									</p>
								</div>
							</div>
						</div>

						<!-- Extra Information Section -->
						<div class="grid gap-4 md:grid-cols-3">
							<!-- Radius Block -->
							<div
								class="flex items-center gap-4 p-4 border rounded-xl shadow-md bg-white dark:bg-gray-900 dark:border-gray-700"
							>
								<Icon icon="line-md:map-marker-radius" class="text-blue-500 h-7 w-7" />
								<div>
									<h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Radius</h4>
									<p class="text-sm text-gray-600 dark:text-gray-400">
										{searchRequest.request_params.radius} KM
									</p>
								</div>
							</div>
							<!-- Resolution Block -->
							<div
								class="flex items-center gap-4 p-4 border rounded-xl shadow-md bg-white dark:bg-gray-900 dark:border-gray-700"
							>
								<Icon icon="mdi:image-size-select-actual" class="text-primary h-7 w-7" />
								<div>
									<h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Resolution</h4>
									<p class="text-sm text-gray-600 dark:text-gray-400">
										{searchRequest.request_params.resolution}
									</p>
								</div>
							</div>
							<!-- Date Range Block -->
							<div
								class="flex items-center gap-4 p-4 border rounded-xl shadow-md bg-white dark:bg-gray-900 dark:border-gray-700"
							>
								<Icon icon="mdi:calendar-range" class="text-primary h-7 w-7" />
								<div>
									<h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Date Range</h4>
									<p class="text-sm text-gray-600 dark:text-gray-400">
										{searchRequest.request_params.start_date
											? `${searchRequest.request_params.start_date} - ${searchRequest.request_params.end_date}`
											: 'N/A'}
									</p>
								</div>
							</div>
						</div>

						<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							<!-- Request Origin -->
							<div
								class="flex items-start space-x-3 p-4 border rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-900"
							>
								<Icon icon="lucide:globe" class="text-blue-500 h-6 w-6 mt-1" />
								<div>
									<h4 class="text-base font-semibold text-gray-900 dark:text-white">
										Request Origin
									</h4>
									<p class="text-sm text-muted-foreground">{searchRequest.request_origin}</p>
								</div>
							</div>

							<!-- API Credits -->
							<div
								class="flex items-start space-x-3 p-4 border rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-900"
							>
								<Icon icon="lucide:coins" class="text-primary h-6 w-6 mt-1" />
								<div>
									<h4 class="text-base font-semibold text-gray-900 dark:text-white">API Credits</h4>
									<p class="text-sm font-medium text-primary">{searchRequest.api_credits}</p>
								</div>
							</div>

							<!-- Status -->
							<div
								class="flex items-start space-x-3 p-4 border rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-900"
							>
								<Icon icon="lucide:check-circle" class="text-primary h-6 w-6 mt-1" />
								<div>
									<h4 class="text-base font-semibold text-gray-900 dark:text-white">Status</h4>
									<span
										class="px-3 py-1 text-xs font-semibold rounded-full {searchRequest.is_completed
											? 'bg-green-500 text-white dark:bg-green-600'
											: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}"
									>
										{searchRequest.is_completed ? 'Complete' : 'Pending'}
									</span>
								</div>
							</div>

							<!-- Created At -->
							<div
								class="flex items-start space-x-3 p-4 border rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-900"
							>
								<Icon icon="lucide:calendar" class="text-primary h-6 w-6 mt-1" />
								<div>
									<h4 class="text-base font-semibold text-gray-900 dark:text-white">Created At</h4>
									<p class="text-sm text-muted-foreground">
										{formatDate(searchRequest.created_at)}
									</p>
								</div>
							</div>

							<!-- Image -->
							{#if searchRequest.imagepath}
								<div
									class="flex items-center space-x-4 p-4 border rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-900"
								>
									<div>
										<h4 class="text-base font-semibold text-gray-900 dark:text-white">
											Search Image
										</h4>
										<img
											src={searchRequest.imagepath}
											alt="Search Thumbnail"
											class="h-16 w-16 object-cover rounded-xl border dark:border-gray-600"
										/>
									</div>
								</div>
							{/if}
						</div>
					</div>
					<h4
						class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center my-5 py-5"
					>
						Features
					</h4>

					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 py-5">
						{#if features.length > 0}
							{#each features as feature}
								<a
									href="{searchRequest.id}/{feature}"
									class="group block border rounded-lg shadow-sm transition-all hover:shadow-md
                                    hover:border-primary dark:border-gray-700 dark:hover:border-primary dark:bg-gray-900 text-center"
								>
									<Card.Root>
										<Card.Header class="flex items-center justify-between pb-2">
											<Icon
												icon={icons[feature].icon || 'lucide:help-circle'}
												class="text-primary text-3xl group-hover:scale-110 transition-transform"
											/>
										</Card.Header>
										<Card.Content>
											<div
												class="text-lg font-bold uppercase group-hover:text-primary transition-colors"
											>
												{icons[feature].label}
											</div>
											<p class="text-muted-foreground text-xs">View Response</p>
										</Card.Content>
									</Card.Root>
								</a>
							{/each}
						{/if}
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
</div>
