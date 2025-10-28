<script>
	import * as Alert from '$lib/components/ui/alert';
	import Icon from '@iconify/svelte';

	export let errors;
</script>

<!-- Error Display -->
{#if errors}
	<Alert.Root variant="destructive">
		<Icon icon="lucide:circle-alert" class="h-4 w-4" />
		<Alert.Title>Error</Alert.Title>
		<Alert.Description>
			<ul>
				{#each Object.entries(errors) as [, errorMessage]}
					<li>{errorMessage.join(', ')}</li>
				{/each}
			</ul>
		</Alert.Description>
	</Alert.Root>
{/if}
