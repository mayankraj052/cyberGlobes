<script lang="ts">
	import { toggleMode, mode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<Button class="bg-transparent border-0" on:click={toggleMode} size="icon" variant="outline">
			<Icon
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				icon="lucide:sun"
			/>
			<Icon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				icon="radix-icons:moon"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>Switch to {$mode === 'dark' ? 'light' : 'dark'} mode.</p>
	</Tooltip.Content>
</Tooltip.Root>
