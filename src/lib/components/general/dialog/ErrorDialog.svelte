<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	export let isOpen = false;
	export let error;

	const buttonActions = {
		search_limit_exhausted: { label: 'Login', path: '/login' },
		insufficient_credits: { label: 'Buy Credits', path: '/pricing' }
	};
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content escapeKeydownBehavior="ignore" interactOutsideBehavior="ignore">
		<Dialog.Header>
			<Dialog.Title class="text-red-500 flex items-center gap-2">
				<Icon class="h-6 w-6" icon="line-md:alert-circle-loop" />
				Oops! An Error Occurred
			</Dialog.Title>
			<Dialog.Description>{error.message}</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			{#if error.error_code}
				{#if buttonActions[error.error_code]}
					<Button on:click={() => goto(buttonActions[error.error_code].path)}>
						{buttonActions[error.error_code].label}
					</Button>
				{/if}
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
