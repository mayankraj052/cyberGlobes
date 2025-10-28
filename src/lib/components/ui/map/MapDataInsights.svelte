<script>
	import { Button } from '$lib/components/ui/button/index.ts';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { socialMediaJson } from '$lib/stores/mapStore.ts';
	import { groupSocialMediaData } from '$lib/utils/socialMediaUtils.js';

	import { goto } from '$app/navigation';

	let buttonIcon = 'ri:dvd-ai-line';
</script>

<Button
	on:click={goto('/insights/')}
	aria-label="Data Insights"
	class="fixed bottom-20 right-4 z-50 w-12 h-12 p-0 rounded-full bg-black text-white shadow-md hover:shadow-lg transition-transform duration-200 transform hover:scale-110"
	variant="primary"
	title="Data Insights"
>
	<Icon aria-hidden="true" class="w-6 h-6 text-white" icon={buttonIcon} />
	<span class="sr-only">Get insights</span>
</Button>
