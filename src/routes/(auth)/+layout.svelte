<script lang="ts">
	import { onMount } from 'svelte';
	import '../../app.css';
	import { checkAuth, isLoggedIn } from '$lib/stores/authStore';
	import Toast from '$lib/components/ui/toast/Toast.svelte';
	import { deleteCookie, getCookie } from '$lib/utils/cookies';
	import { ApiService } from '$lib/services/api-service';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { QUERY_BEFORE_LOGIN, ACTION_TYPES } from '$lib/constants/constants';
	let { children } = $props();

	async function handlePendingSearch() {
		const pendingSearch = localStorage.getItem(QUERY_BEFORE_LOGIN);
		if (pendingSearch) {
			try {
				const searchParams = JSON.parse(pendingSearch);

				// if search by address, redirect to try-demo
				if(searchParams.action === ACTION_TYPES.SEARCH_BY_ADDRESS) {
					localStorage.removeItem(QUERY_BEFORE_LOGIN);
					return `/try-demo`;
				}

				// if search by agent, redirect to homepage with query
				if (searchParams.action === ACTION_TYPES.SEARCH_BY_AGENT) {
					localStorage.removeItem(QUERY_BEFORE_LOGIN);
					return `/?logged_in=true&query=${encodeURIComponent(searchParams.message)}`;
				}

				// if search by image, redirect to homepage with image
				if (searchParams.action === ACTION_TYPES.SEARCH_BY_IMAGE) {
					return `/?logged_in=true&image=true`;
				}

				return '/'; // Default redirect to homepage after login
			} catch (error) {
				console.error('Error processing pending search:', error);
				return '/'; // Redirect to homepage on error
			}
		}

		return '/dashboard'; // Default redirect to homepage when no pending search
	}

	onMount(() => {
		checkAuth();
		const unsubscribe = isLoggedIn.subscribe(async (value) => {
			if (value) {
				const redirectUrl = await handlePendingSearch();
				if (redirectUrl) {
					window.location.href = redirectUrl;
				}
			}
		});

		return () => {
			unsubscribe();
		};
	});
</script>

<Toast />
{@render children()}
