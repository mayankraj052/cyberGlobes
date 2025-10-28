<script lang="ts">
	import Icon from '@iconify/svelte';
	export let url;
</script>

<a
	href={url}
	class="text-white bg-primary font-medium rounded-md text-sm p-2.5 text-center items-center inline-flex"
>
	<Icon icon="mingcute:arrow-left-line" class="h-4 w-4 me-2" />
	Back
</a>
