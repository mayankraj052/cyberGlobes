<script>
	import { isLoggedIn, user } from '$lib/stores/authStore';
</script>

{#if $isLoggedIn}
	<div class="my-5">
		{#if $user?.subscription}
			<div
				class="py-4 px-5 border-s-4 border-green-600 shadow-md rounded-md bg-white dark:bg-gray-950"
			>
				<h6
					class="text-base font-bold -tracking-snug text-slate-700 dark:text-white leading-tighter mb-2"
				>
					Hurray! You have an active subscription. 🎉
				</h6>
				<p class="text-slate-600 dark:text-slate-400 text-sm">
					Thank you for subscribing to our service. Enjoy the full access.
				</p>
				<a
					href="my-subscription"
					class="text-green-600 dark:text-green-500 text-sm font-medium mt-2 inline-block"
				>
					View Subscription
				</a>
			</div>
		{:else}
			<div
				class="py-4 px-5 border-s-4 border-red-600 shadow-md rounded-md bg-white dark:bg-gray-950"
			>
				<h6
					class="text-base font-bold -tracking-snug text-slate-700 dark:text-white leading-tighter mb-2"
				>
					No Subscription! 😢
				</h6>
				<p class="text-slate-600 dark:text-slate-400 text-sm">
					Please subscribe to our service to get the full access.
				</p>
				<a
					href="/pricing"
					class="text-red-600 dark:text-red-500 text-sm font-medium mt-2 inline-block"
				>
					View Pricing
				</a>
			</div>
		{/if}
	</div>
{/if}
