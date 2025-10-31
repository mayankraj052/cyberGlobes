<script lang="ts">
	import '../../app.css';
	import Toast from '$lib/components/ui/toast/Toast.svelte';
	let { children } = $props();
</script>

<div class="w-full h-screen bg-background relative">
	{@render children()}
	<Toast />
</div>
