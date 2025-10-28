<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { AuthService } from '$lib/services/auth-service';
	import { goto } from '$app/navigation';
	import Errors from '$lib/components/form/messages/Errors.svelte';
	import { triggerSuccessToast } from '$lib/stores/toastStore';
	import LoginBg from '$lib/assets/general/login.jpg';
	import { login } from '$lib/stores/authStore';

	let name = '';
	let email = '';
	let password = '';
	let password_confirmation = '';
	let errorMessages: string[] = [];
	let isLoading = false;

	const authService = new AuthService();

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isLoading = true;

		try {
			const data = await authService.register({ name, email, password, password_confirmation });
			if (data.success) {
				// Auto login user with the response data
				const loginData = {
					access_token: data.access_token,
					member: data.user
				};
				
				login(loginData);
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

<div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
	<div class="flex items-center justify-center py-12">
		<div class="mx-auto grid w-[350px] gap-6">
			<div class="grid gap-2 text-center">
				<h1 class="text-3xl font-bold">Register</h1>
				<p class="text-muted-foreground text-balance">
					Create an account to start using CyberGlobes
				</p>
			</div>
			<Errors {errorMessages} />
			<form class="grid gap-4" on:submit={handleSubmit}>
				<div class="grid gap-2">
					<Label for="name">Name</Label>
					<Input id="name" type="text" bind:value={name} placeholder="John Doe" required />
				</div>
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" bind:value={email} placeholder="m@example.com" required />
				</div>
				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<Input id="password" type="password" bind:value={password} required />
				</div>
				<div class="grid gap-2">
					<Label for="password_confirmation">Confirm Password</Label>
					<Input id="password_confirmation" type="password" bind:value={password_confirmation} required />
				</div>
				<Button type="submit" class="w-full" disabled={isLoading}>
					{#if isLoading}
						Registering...
					{:else}
						Register
					{/if}
				</Button>
			</form>
			<div class="mt-4 text-center text-sm">
				Already have an account?
				<a href="/login" class="underline"> Login </a>
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
