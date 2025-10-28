<script>
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Icon from '@iconify/svelte';
	export let icon;
	export let text;
	export let count;
</script>

<Tooltip.Root>
	<Tooltip.Trigger class="flex items-center space-x-1">
		<Icon {icon} class="h-5 w-5" />
		<span>{count}</span>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>{text}</p>
	</Tooltip.Content>
</Tooltip.Root>
