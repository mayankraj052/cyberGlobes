<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { AuthService } from '$lib/services/auth-service';
	import { login } from '$lib/stores/authStore';
	import { triggerSuccessToast } from '$lib/stores/toastStore';
	import Errors from '$lib/components/form/messages/Errors.svelte';
	import LoginBg from '$lib/assets/general/login.jpg';
	import { onMount } from 'svelte';
	import { getCookie } from '$lib/utils/cookies';
	import { toast } from 'svelte-sonner';
	import { getDataFromURL, removeDataFromURL } from '$lib/utils/generalUtils';

	let email = '';
	let password = '';
	let errorMessages: string[] = [];
	let isLoading = false;

	const authService = new AuthService();

	onMount(() => {
		if (localStorage.getItem('pendingSearch')  && getDataFromURL('loginredirect') == '1') {
			removeDataFromURL('loginredirect');
			toast.warning("You'll need to log in to use this feature.", { position: 'top-right' });
		}
	});

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isLoading = true;

		try {
			const data = await authService.login({ email, password });
			if (data.success) {
				login(data);
			} else {
				handleErrors(data);
			}
			isLoading = false
		} catch (error) {
			isLoading = false;
			errorMessages.push('An unexpected error occurred.');
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

<div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
	<div class="flex items-center justify-center py-12">
		<div class="mx-auto grid w-[350px] gap-6">
			<div class="grid gap-2 text-center">
				<h1 class="text-3xl font-bold">Login</h1>
				<p class="text-muted-foreground text-balance">
					Enter your email below to login to your account
				</p>
			</div>
			<Errors {errorMessages} />
			<form class="grid gap-4" on:submit={handleSubmit}>
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" bind:value={email} placeholder="m@example.com" required />
				</div>
				<div class="grid gap-2">
					<div class="flex items-center">
						<Label for="password">Password</Label>
						<a href="/forgot-password" class="ml-auto inline-block text-sm underline">
							Forgot your password?
						</a>
					</div>
					<Input id="password" type="password" bind:value={password} required />
				</div>
				<Button type="submit" class="w-full" disabled={isLoading}>
					{#if isLoading}
						Logging in...
					{:else}
						Login
					{/if}
				</Button>
			</form>
			<div class="mt-4 text-center text-sm">
				Don&apos;t have an account?
				<a href="/register" class="underline"> Sign up </a>
			</div>
		</div>
	</div>
	<div class="bg-muted hidden lg:block">
		<img
			src={LoginBg}
			alt="placeholder"
			width="1920"
			height="1080"
			class="h-screen w-full object-cover dark:brightness-[0.2] dark:grayscale"
		/>
	</div>
</div>
