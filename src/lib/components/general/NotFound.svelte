<script>
	import Icon from '@iconify/svelte';
	export let message = 'No data available';
</script>

<div
	class="flex flex-col items-center justify-center p-6 text-center bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md"
>
	<Icon icon="line-md:alert-circle-loop" class="text-7xl" />
	<p class="text-lg font-semibold text-gray-600 dark:text-gray-300">{message}</p>
</div>
