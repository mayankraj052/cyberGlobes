<script lang="ts">
	import HeaderGuest from '$lib/components/layout/HeaderGuest.svelte';
	import FooterGuest from '$lib/components/layout/FooterGuest.svelte';
	import '../../app.css';
	let { children } = $props();
</script>

<HeaderGuest />
<div class="content">
	{@render children()}
</div>
<FooterGuest />
