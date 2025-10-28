<script lang="ts">
	import Logo from '$lib/components/general/Logo.svelte';
	import { AuthService } from '$lib/services/auth-service';
	import LoadingButton from '$lib/components/form/buttons/LoadingButton.svelte';
	import Errors from '$lib/components/form/messages/Errors.svelte';
	import { goto } from '$app/navigation';
	import { triggerSuccessToast } from '$lib/stores/toastStore';

	let email = '';
	let hash = '';
	let errorMessages: string[] = [];
	let isLoading = false;

	const authService = new AuthService();

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isLoading = true;

		try {
			const data = await authService.verifyEmail({ email, hash });
			if (data.success) {
				goto('/login');
				triggerSuccessToast(data.message);
			} else {
				handleErrors(data);
			}
		} catch (error) {
			errorMessages.push('An unexpected error occurred.');
		} finally {
			isLoading = false;
		}
	}

	function handleErrors(data: any) {
		errorMessages = [];

		if (data.errors) {
			Object.keys(data.errors).forEach((key) => {
				errorMessages.push(...data.errors[key]);
			});
		} else {
			errorMessages.push(data.message || 'An error occurred');
		}
	}
</script>

<div class="font-sans text-gray-900 antialiased">
	<div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
		<div>
			<a href="/" aria-label="Home">
				<Logo />
			</a>
		</div>

		<div class="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
			<Errors {errorMessages} />
			<form on:submit={handleSubmit}>
				<div>
					<label for="email" class="block font-medium text-sm text-gray-700"> Email </label>
					<input
						class="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm block mt-1 w-full"
						id="email"
						type="email"
						bind:value={email}
						required
					/>
				</div>

				<div class="mt-4">
					<label for="hash" class="block font-medium text-sm text-gray-700">
						code from email
					</label>
					<input
						class="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm block mt-1 w-full"
						id="hash"
						type="text"
						bind:value={hash}
						required
					/>
				</div>

				<div class="flex items-center justify-end mt-4">
					{#if isLoading}
						<LoadingButton buttonText="Verifying..." />
					{:else}
						<button
							type="submit"
							class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition ml-4"
						>
							Verify Email
						</button>
					{/if}
				</div>
			</form>
		</div>
	</div>
</div>
