<script>
	import { onDestroy } from 'svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.ts';
	import Icon from '@iconify/svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.ts';
	import { Input } from '$lib/components/ui/input/index.ts';
	import { Label } from '$lib/components/ui/label/index.ts';
	import { Switch } from '$lib/components/ui/switch/index.ts';
	import * as Select from '$lib/components/ui/select';
	import { MapService } from '$lib/services/map-service.js';
	import { REFRESH_FREQUENCY_OPTIONS } from '$lib/constants/constants.js';
	import { handleErrors } from '$lib/utils/generalUtils.js';
	import { toast } from 'svelte-sonner';
	import { searchRequestID } from '$lib/stores/mapStore.ts';

	export let requestID = 0;

	// dialog properties
	let isOpen = false;
	let isLoading = false;
	let errorMessages = [];

	// Form data
	let formData = {
		title: '',
		refreshFrequency: REFRESH_FREQUENCY_OPTIONS[0],
		notifyEmail: false,
		requestID
	};

	function resetNotifyEmailIfNoRefresh() {
		if (formData.refreshFrequency === REFRESH_FREQUENCY_OPTIONS[0]) {
			formData.notifyEmail = false;
		}
	}

	$: resetNotifyEmailIfNoRefresh();

	const mapService = new MapService();

	async function handleFormSubmit(event) {
		event.preventDefault();

		const payload = {
			title: formData.title,
			frequency: formData.refreshFrequency.value || REFRESH_FREQUENCY_OPTIONS[0],
			notify: formData.notifyEmail,
			request_id: formData.requestID
		};

		isLoading = true; // show loader

		try {
			const data = await mapService.saveResults(payload);
			if (data.success) {
				formData = {
					title: '',
					refreshFrequency: REFRESH_FREQUENCY_OPTIONS[0],
					notifyEmail: false
				};

				// show success message and close the dialog.
				toast.success(data.message);
				isOpen = false;
			} else {
				errorMessages = handleErrors(data);
			}
		} catch (error) {
			errorMessages.push('An unexpected error occurred. Please try again.');
		} finally {
			isLoading = false;
		}
	}

	const unsubscribe = searchRequestID.subscribe((id) => {
		formData.requestID = id;
	});
	onDestroy(() => unsubscribe());
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })} on:click={() => (isOpen = true)}>
		<Icon class="md:me-2 sm:me-0 w-6 h-6" icon="carbon:save" />
		<span class="hidden md:inline">Save search</span>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Save Your Search</Dialog.Title>
			<Dialog.Description>
				Save your selected filters and search results into a new saved search. <br />You can also
				set up automatic refresh using your preferred refresh frequency.
			</Dialog.Description>
		</Dialog.Header>
		<form on:submit={handleFormSubmit}>
			<div class="grid gap-4 py-4">
				<!-- Title -->
				<div class="grid grid-cols-4 items-center gap-4">
					<Label class="text-right" for="title">Title</Label>
					<Input
						bind:value={formData.title}
						class="col-span-3"
						id="title"
						placeholder="Enter title"
						required
					/>
				</div>

				<!-- Refresh Interval Dropdown -->
				<div class="grid grid-cols-4 items-center gap-4">
					<Label class="text-right" for="refreshFrequency">Refresh Frequency</Label>
					<Select.Root bind:selected={formData.refreshFrequency}>
						<Select.Trigger class="w-[180px]">
							<Select.Value placeholder={formData.refreshFrequency} />
						</Select.Trigger>
						<Select.Content>
							{#each REFRESH_FREQUENCY_OPTIONS as option}
								<Select.Item value={option}>{option}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<!-- Notify Updates on Email -->
				<div class="grid grid-cols-4 items-center gap-4">
					<Label class="text-right" for="notifyEmail">Notify me via Email</Label>
					<Switch
						bind:checked={formData.notifyEmail}
						class="col-span-3"
						disabled={formData.refreshFrequency === REFRESH_FREQUENCY_OPTIONS[0]}
						id="notifyEmail"
					/>
				</div>
			</div>

			<!-- Submit Button -->
			<div class="py-4 grid justify-items-end">
				<Button class="btn btn-primary" disabled={isLoading} type="submit">
					{#if isLoading}
						<Icon icon="eos-icons:loading" class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Save Search
				</Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
