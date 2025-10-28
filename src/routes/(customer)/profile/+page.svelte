<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { UserService } from '$lib/services/user-service';
	import { isLoggedIn, checkAuth, user, getUserData } from '$lib/stores/authStore';
	import LoadingButton from '$lib/components/form/buttons/LoadingButton.svelte';
	import Errors from '$lib/components/form/messages/Errors.svelte';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { triggerSuccessToast } from '$lib/stores/toastStore';

	let photoInput: HTMLInputElement;
	let photoPreview = '';
	let shown = false;
	let name = '';
	let email = '';
	/**
	 * @type {null}
	 */
	let profile_photo_url = null;
	let errorMessages: string[] = [];
	let isLoading = false;

	let password = '';
	let password_confirmation = '';
	let current_password = '';
	let isPasswordLoading = false;
	let savedShown = false;
	let passwordErrorMessages: string[] = [];

	const userService = new UserService();

	function handleFileChange(event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				photoPreview = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	}

	function deleteProfilePhoto() {
		photoPreview = '';
		photoInput.value = null;
	}

	/**
	 * Update User Password.
	 *
	 * @param event
	 */
	async function updatePassword(event: Event) {
		event.preventDefault();
		isPasswordLoading = true;

		try {
			const data = await userService.updatePassword({
				password,
				password_confirmation,
				current_password
			});
			if (data.success) {
				savedShown = true;
				setTimeout(() => {
					savedShown = false;
				}, 1500);
				triggerSuccessToast(data.message);
			} else {
				passwordErrorMessages = handleErrors(data);
			}
		} catch (error) {
			passwordErrorMessages.push('An unexpected error occurred.');
		} finally {
			isPasswordLoading = false;
			// reset password fields
			password = '';
			password_confirmation = '';
			current_password = '';
		}
	}

	/**
	 * Update User Profile.
	 *
	 * @param event
	 */
	async function handleSubmit(event: Event) {
		event.preventDefault();
		isLoading = true;

		const formData = new FormData();
		formData.append('name', name);
		formData.append('email', email);
		if (photoInput.files && photoInput.files[0]) {
			formData.append('profile_photo_path', photoInput.files[0], photoInput.files[0].name);
		}

		try {
			const data = await userService.updateProfile(formData, 'formdata');
			if (data.success) {
				shown = true;
				setTimeout(() => {
					shown = false;
				}, 1500);
				triggerSuccessToast(data.message);
				await getUserData();
			} else {
				errorMessages = handleErrors(data);
			}
		} catch (error) {
			errorMessages.push('An unexpected error occurred.');
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Handle Validation errors.
	 *
	 * @param data
	 */
	function handleErrors(data: any) {
		let errors = [];

		if (data.errors) {
			Object.keys(data.errors).forEach((key) => {
				errors.push(...data.errors[key]);
			});
		} else {
			errors.push(data.message || 'An error occurred');
		}

		return errors;
	}

	let loggedIn = false;
	onMount(() => {
		// checkAuth();
		const unsubscribe = isLoggedIn.subscribe((value) => {
			loggedIn = value;
			if (!loggedIn) {
				goto('/login');
			} else {
				const userData = get(user);
				if (userData) {
					name = userData.name || '';
					email = userData.email || '';
					profile_photo_url = userData.profile_photo_url || '';
				}
			}
		});

		return () => {
			unsubscribe();
		};
	});
</script>

<main>
	<div>
		<div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
			<div class="md:grid md:grid-cols-3 md:gap-6">
				<div class="md:col-span-1 flex justify-between">
					<div class="px-4 sm:px-0">
						<h3 class="text-lg font-medium text-gray-900">Profile Information</h3>

						<p class="mt-1 text-sm text-gray-600">
							Update your account's profile information and email address.
						</p>
					</div>

					<div class="px-4 sm:px-0"></div>
				</div>

				<div class="mt-5 md:mt-0 md:col-span-2">
					<form on:submit={handleSubmit} enctype="multipart/form-data">
						<div class="px-4 py-5 bg-white sm:p-6 shadow sm:rounded-tl-md sm:rounded-tr-md">
							{#if errorMessages.length > 0}
								<Errors {errorMessages} />
							{/if}
							<div class="grid grid-cols-6 gap-6">
								<!-- Profile Photo -->
								<div class="col-span-6 sm:col-span-4">
									<!-- Profile Photo File Input -->
									<input
										type="file"
										class="hidden"
										bind:this={photoInput}
										on:change={handleFileChange}
									/>
									<label class="block font-medium text-sm text-gray-700" for="photo">Photo</label>

									<!-- Current Profile Photo -->
									{#if !photoPreview}
										<div class="mt-2">
											<img
												src={profile_photo_url}
												alt={name}
												class="w-20 h-20 rounded-full object-cover"
											/>
										</div>
									{/if}

									<!-- New Profile Photo Preview -->
									{#if photoPreview}
										<div class="mt-2">
											<span
												class="block rounded-full w-20 h-20 bg-cover bg-no-repeat bg-center"
												style="background-image: url('{photoPreview}');"
											></span>
										</div>
									{/if}

									<button
										type="button"
										class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:text-gray-800 active:bg-gray-50 disabled:opacity-25 transition mt-2 mr-2"
										on:click={() => photoInput.click()}
									>
										Select A New Photo
									</button>

									<button
										type="button"
										class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:text-gray-800 active:bg-gray-50 disabled:opacity-25 transition mt-2"
										on:click={deleteProfilePhoto}
									>
										Remove Photo
									</button>
								</div>

								<!-- Name -->
								<div class="col-span-6 sm:col-span-4">
									<label class="block font-medium text-sm text-gray-700" for="name">Name</label>
									<input
										class="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm mt-1 block w-full"
										id="name"
										type="text"
										bind:value={name}
										autocomplete="name"
									/>
								</div>

								<!-- Email -->
								<div class="col-span-6 sm:col-span-4">
									<label class="block font-medium text-sm text-gray-700" for="email">Email</label>
									<input
										class="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm mt-1 block w-full"
										id="email"
										type="email"
										bind:value={email}
									/>
								</div>
							</div>
						</div>

						<div
							class="flex items-center justify-end px-4 py-3 bg-gray-50 text-right sm:px-6 shadow sm:rounded-bl-md sm:rounded-br-md"
						>
							{#if isLoading}
								<LoadingButton buttonText="Saving..." />
							{:else}
								{#if shown}
									<div class="text-sm text-gray-600 mr-3" transition:fade={{ duration: 1500 }}>
										Saved.
									</div>
								{/if}
								<button
									type="submit"
									class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition ml-4"
								>
									Save
								</button>
							{/if}
						</div>
					</form>
				</div>
			</div>

			<div class="hidden sm:block">
				<div class="py-8">
					<div class="border-t border-gray-200"></div>
				</div>
			</div>

			<div class="mt-10 sm:mt-0">
				<div class="md:grid md:grid-cols-3 md:gap-6">
					<div class="md:col-span-1 flex justify-between">
						<div class="px-4 sm:px-0">
							<h3 class="text-lg font-medium text-gray-900">Update Password</h3>
							<p class="mt-1 text-sm text-gray-600">
								Ensure your account is using a long, random password to stay secure.
							</p>
						</div>

						<div class="px-4 sm:px-0"></div>
					</div>

					<div class="mt-5 md:mt-0 md:col-span-2">
						<form on:submit={updatePassword}>
							<div class="px-4 py-5 bg-white sm:p-6 shadow sm:rounded-tl-md sm:rounded-tr-md">
								{#if passwordErrorMessages.length > 0}
									<Errors errorMessages={passwordErrorMessages} />
								{/if}
								<div class="grid grid-cols-6 gap-6">
									<div class="col-span-6 sm:col-span-4">
										<label class="block font-medium text-sm text-gray-700" for="current_password"
											>Current Password</label
										>
										<input
											class="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm mt-1 block w-full"
											id="current_password"
											type="password"
											autocomplete="current-password"
											bind:value={current_password}
										/>
									</div>

									<div class="col-span-6 sm:col-span-4">
										<label class="block font-medium text-sm text-gray-700" for="password"
											>New Password</label
										>
										<input
											class="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm mt-1 block w-full"
											id="password"
											type="password"
											autocomplete="new-password"
											bind:value={password}
										/>
									</div>

									<div class="col-span-6 sm:col-span-4">
										<label
											class="block font-medium text-sm text-gray-700"
											for="password_confirmation">Confirm Password</label
										>
										<input
											class="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm mt-1 block w-full"
											id="password_confirmation"
											type="password"
											autocomplete="new-password"
											bind:value={password_confirmation}
										/>
									</div>
								</div>
							</div>

							<div
								class="flex items-center justify-end px-4 py-3 bg-gray-50 text-right sm:px-6 shadow sm:rounded-bl-md sm:rounded-br-md"
							>
								{#if isPasswordLoading}
									<LoadingButton buttonText="Saving..." />
								{:else}
									{#if savedShown}
										<div class="text-sm text-gray-600 mr-3" transition:fade={{ duration: 1500 }}>
											Saved.
										</div>
									{/if}
									<button
										type="submit"
										class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition ml-4"
									>
										Save
									</button>
								{/if}
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
