<script lang="ts">
	import { onMount } from 'svelte';
	import { SubscriptionService } from '$lib/services/subscription-service';
	import Loader from '../spinners/Loader.svelte';
	import PricingPlan from './PricingPlan.svelte';

	let data = {};
	let loading = false;

	onMount(async () => {
		loading = true;
		const subscriptionService = new SubscriptionService();
		try {
			const response = await subscriptionService.getPricingPlans();

			if (!response.success) {
				throw new Error('Failed to fetch pricing data');
			}

			data = response.plans;
		} catch (error) {
			console.error('Error fetching pricing data:', error);
		} finally {
			loading = false;
		}
	});
</script>

<div class="py-40" id="pricing">
	<div class="mx-auto max-w-4xl text-center">
		<h2 class="text-base/7 font-semibold text-[#2C7BE5]">Pricing</h2>
		<p class="mt-2 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
			Choose the right plan for you
		</p>
	</div>
	<p
		class="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-gray-600 sm:text-xl/8"
	>
		Choose an affordable plan that's packed with the best features for engaging your audience,
		creating customer loyalty, and driving sales.
	</p>

	{#if loading}
		<div class="flex justify-center mt-5">
			<div class="mx-auto text-center align-middle">
				<Loader />
			</div>
		</div>
	{/if}

	{#if data && !loading}
		<div
			class="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2"
		>
			{#each data as plan}
				<PricingPlan {plan} />
			{/each}
		</div>
	{/if}
</div>
