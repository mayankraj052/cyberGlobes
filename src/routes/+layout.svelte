<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import Toast from '$lib/components/ui/toast/Toast.svelte';
	import { checkAuth, isLoggedIn } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import '../app.css';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	let { children } = $props();
	
	// Flag to track if there are any errors
	const hasError = $derived($page.error !== undefined && $page.error !== null);

	// const noLayoutRoutes = ['/', '/login', '/register']; // Add routes where you don't want to show the layout

	onMount(() => {
		checkAuth();
		const unsubscribe = isLoggedIn.subscribe((value) => {
			if (!value) {
				// $page.data.layout !== false ? (window.location.href = '/login') : '';
			}
		});

		return () => {
			unsubscribe();
		};
	});
</script>

<!-- {#if !noLayoutRoutes.includes($page.url.pathname)} -->
<Toaster richColors />

{#if $page.data.layout !== false && !hasError}
	<div class="app-container">
		<ModeWatcher />
		<Sidebar />
		<div
			class="xl:ps-72 [&>.serviceapp-header]:xl:start-72 [&>.serviceapp-header]:xl:w-[calc(100%-theme(spacing.72))] peer-[&.is-compact:not(.has-hover)]:xl:ps-[74px] peer-[&.is-compact:not(.has-hover)]:[&>.serviceapp-header]:xl:start-[74px] peer-[&.is-compact:not(.has-hover)]:[&>.serviceapp-header]:xl:w-[calc(100%-74px)] flex flex-col min-h-screen transition-all duration-300"
		>
			<Header />
			<div id="pagecontent" class="serviceapp-content px-1.5 sm:px-5 py-6 sm:py-8 dark:bg-gray-900">
				{@render children()}
			</div>
			<!-- content -->
			<Footer />
		</div>
	</div>
{:else}
	{@render children()}
{/if}
