<script>
	import { isLoggedIn, logout } from '$lib/stores/authStore';
	import Logo from '../general/Logo.svelte';
	import { page } from '$app/stores';

	let mobileMenu = false;
	
	function isActive(path) {
		if (path === '/' && $page.url.pathname === '/') {
			return true;
		}
		return path !== '/' && $page.url.pathname.startsWith(path);
	}
</script>

<header class="bg-background">
	<nav class="mx-auto flex container items-center justify-between p-6 lg:px-8" aria-label="Global">
		<div class="flex lg:flex-1">
			<a href="/" class="-m-1.5 p-1.5">
				<span class="sr-only">CyberGlobs</span>
				<Logo />
			</a>
		</div>
		<div class="flex lg:hidden">
			<button
				type="button"
				class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
				on:click={() => (mobileMenu = true)}
			>
				<span class="sr-only">Open main menu</span>
				<svg
					class="size-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					aria-hidden="true"
					data-slot="icon"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
			</button>
		</div>
		<div class="hidden lg:flex lg:gap-x-12">
			<a 
				href="/" 
				class="text-sm/6 font-semibold transition-colors {isActive('/') ? 'text-primary-600 border-primary-500' : 'text-gray-900 hover:text-primary-500'}"
			>
				Home
			</a>
			<a 
				href="/" 
				class="text-sm/6 font-semibold transition-colors {isActive('/insights') ? 'text-primary-600 border-primary-500' : 'text-gray-900 hover:text-primary-500'}"
			>
				Blog
			</a>
			<a 
				href="/try-demo" 
				class="text-sm/6 font-semibold transition-colors {isActive('/try-demo') ? 'text-primary-600 border-primary-500' : 'text-gray-900 hover:text-primary-500'}" 
				rel="external"
			>
				Make Search
			</a>
			<a 
				href="/how-it-works" 
				class="text-sm/6 font-semibold transition-colors {isActive('/how-it-works') ? 'text-primary-600 border-primary-500' : 'text-gray-900 hover:text-primary-500'}"
			>
				How it works
			</a>
			<a 
				href="/plan-&-pricing" 
				class="text-sm/6 font-semibold transition-colors {isActive('/plan-&-pricing') ? 'text-primary-600 border-primary-500' : 'text-gray-900 hover:text-primary-500'}"
			>
				Pricing
			</a>

			<a 
				href="/about-us" 
				class="text-sm/6 font-semibold transition-colors {isActive('/about-us') ? 'text-primary-600 border-primary-500' : 'text-gray-900 hover:text-primary-500'}"
			>
				About Us
			</a>
		</div>
		<div class="hidden lg:flex lg:flex-1 lg:justify-end">
			{#if $isLoggedIn}
				<a 
					href="/dashboard" 
					class="text-sm/6 font-semibold transition-colors {isActive('/dashboard') ? 'text-primary-600' : 'text-gray-900 hover:text-primary-500'}"
				>
					Dashboard
				</a>
				<span aria-hidden="true" class="mx-2">|</span>
				<a
					href="javascript:void(0)"
					on:click={logout()}
					class="text-sm/6 font-semibold text-gray-900 hover:text-primary-500 transition-colors"
				>
					Log out
				</a>
			{:else}
				<a 
					href="/login" 
					class="text-sm/6 font-semibold transition-colors {isActive('/login') ? 'text-primary-600' : 'text-gray-900 hover:text-primary-500'}"
				>
					Log in 
				</a>
				<span aria-hidden="true" class="mx-2">|</span>
				<a 
					href="/register" 
					class="text-sm/6 font-semibold transition-colors {isActive('/register') ? 'text-primary-600' : 'text-gray-900 hover:text-primary-500'}"
				>
					Register
				</a>
			{/if}
		</div>
	</nav>
	<!-- Mobile menu, show/hide based on menu open state. -->
	<div
		class="lg:hidden"
		style="display: {mobileMenu ? 'block' : 'none'}"
		role="dialog"
		aria-modal="true"
	>
		<!-- Background backdrop, show/hide based on slide-over state. -->
		<div class="fixed inset-0 z-10"></div>
		<div
			class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
		>
			<div class="flex items-center justify-between">
				<a href="/" class="-m-1.5 p-1.5">
					<span class="sr-only">Your Company</span>
					<Logo />
				</a>
				<button
					type="button"
					class="-m-2.5 rounded-md p-2.5 text-gray-700"
					on:click={() => (mobileMenu = false)}
				>
					<span class="sr-only">Close menu</span>
					<svg
						class="size-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
						data-slot="icon"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="mt-6 flow-root">
				<div class="-my-6 divide-y divide-gray-500/10">
					<div class="space-y-2 py-6">
						<a
							href="/"
							class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold {isActive('/') ? 'bg-primary-50 text-primary-600' : 'text-gray-900 hover:bg-gray-50'}"
						>
							Home
						</a>
						<a
							href="/"
							class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold {isActive('/insights') ? 'bg-primary-50 text-primary-600' : 'text-gray-900 hover:bg-gray-50'}"
						>
							Blog
						</a>

						<a
							href="/try-demo"
							class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold {isActive('/try-demo') ? 'bg-primary-50 text-primary-600' : 'text-gray-900 hover:bg-gray-50'}"
							rel="external"
						>
							Make Search
						</a>

					</div>
					<div class="py-6">

						<a
							href="/how-it-works"
							class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold {isActive('/how-it-works') ? 'bg-primary-50 text-primary-600' : 'text-gray-900 hover:bg-gray-50'}"
						>
							How it works
						</a>

						<a
							href="/plan-&-pricing"
							class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold {isActive('/plan-&-pricing') ? 'bg-primary-50 text-primary-600' : 'text-gray-900 hover:bg-gray-50'}"
						>
							Pricing
						</a>

						<a
							href="/about-us"
							class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold {isActive('/about-us') ? 'bg-primary-50 text-primary-600' : 'text-gray-900 hover:bg-gray-50'}"
						>
							About Us
						</a>
						{#if $isLoggedIn}
							<a
								href="/dashboard"
								class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold {isActive('/dashboard') ? 'bg-primary-50 text-primary-600' : 'text-gray-900 hover:bg-gray-50'}"
							>
								Dashboard
							</a>
							<a
								href="javascript:void(0)"
								on:click={logout()}
								class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
							>
								Log out
							</a>
						{:else}
							<a
								href="/register"
								class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold {isActive('/register') ? 'bg-primary-50 text-primary-600' : 'text-gray-900 hover:bg-gray-50'}"
							>
								Register
							</a>
						{/if}

					</div>
				</div>
			</div>
		</div>
	</div>
</header>
