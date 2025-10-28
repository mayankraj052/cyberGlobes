<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card/index.ts';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import NotFound from '$lib/components/general/NotFound.svelte';
	import { ApiService } from '$lib/services/api-service';
	import GetBack from '$lib/components/general/GetBack.svelte';
	import { REFRESH_FREQUENCY_OPTIONS } from '$lib/constants/constants';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { toast } from 'svelte-sonner';
	import Icon from '@iconify/svelte';

	export let data;

	let error = data?.error || null;

	let loader = false;

	async function updateRequest() {
		try {
			loader = true;
			let apiService = new ApiService();

			const payload = {
				id: data.savedRequest.id,
				title: data.savedRequest.title,
				frequency: data.savedRequest.frequency,
				notify: data.savedRequest.notify,
				status: data.savedRequest.status
			};

			const response = await apiService.makeApiCall(`update-request`, payload, 'POST', 'json');
			if (response.success) {
				toast.success(response.message);
			} else {
				toast.error(response.message);
			}
			goto('/saved-requests');
		} catch (err) {
			console.error('Update failed', err);
		} finally {
			loader = false;
		}
	}
</script>

<div class="container mx-auto p-6">
	<div class="space-y-6 mx-auto">
		<h2 class="text-3xl font-bold text-gray-900 dark:text-white">Edit Request</h2>
		<GetBack url={'/saved-requests'} />
		<Card.Root class="shadow-md rounded-lg p-6">
			<Card.Content>
				{#if error}
					<NotFound message={'No saved request found!!'} />
				{:else}
					<form on:submit|preventDefault={updateRequest} class="space-y-4">
						<div class="grid gap-4">
							<div class="grid gap-2">
								<Label for="title">Title</Label>
								<Input id="title" type="text" bind:value={data.savedRequest.title} required />
							</div>

							<div class="grid gap-2">
								<Label for="frequency">Frequency</Label>

								<div class="w-full">
									<select
										id="frequency"
										name="frequency"
										bind:value={data.savedRequest.frequency}
										class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
									>
										<option value="" disabled selected>Choose Frequency</option>
										{#each REFRESH_FREQUENCY_OPTIONS as frequency}
											<option value={frequency}>{frequency}</option>
										{/each}
									</select>
								</div>
							</div>

							<div class="flex items-center gap-2">
								<Label for="notify">Notify</Label>
								<input
									id="notify"
									type="checkbox"
									bind:checked={data.savedRequest.notify}
									class="rounded border-gray-300 focus:ring-indigo-500"
								/>
							</div>

							<div class="flex items-center space-x-2">
								<Label for="status">Activate</Label>
								<Switch id="status" bind:checked={data.savedRequest.status} />
							</div>

							<Button
								type="submit"
								class="w-full flex items-center justify-center gap-2"
								disabled={loader}
							>
								Update Request
								{#if loader}
									<Icon icon="eos-icons:loading" class="w-5 h-5" />
								{/if}
							</Button>
						</div>
					</form>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
</div>
