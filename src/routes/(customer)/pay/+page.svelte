<script>
	import { loadStripe } from '@stripe/stripe-js';
	import { CardCvc, CardExpiry, CardNumber, Elements } from 'svelte-stripe';
	import { onMount } from 'svelte';
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { SubscriptionService } from '$lib/services/subscription-service';
	import Loader from '$lib/components/ui/spinners/Loader.svelte';
	import { page } from '$app/stores';
	import { UserService } from '$lib/services/user-service';
	import Icon from '@iconify/svelte';
	import Errors from '$lib/components/form/messages/Errors.svelte';
	import { getUserData } from '$lib/stores/authStore';

	let stripe = null;
	let cardElement = null;
	let clientSecret = null;
	let processing = false;
	let name = '';
	let errorMessage = [];
	let loadingPaymentForm = false;
	let planId = 0;
	let selectedPlan = null;

	let showThankYou = false;

	const subscriptionService = new SubscriptionService();
	const userService = new UserService();

	onMount(async () => {
		try {
			loadingPaymentForm = true;
			planId = parseInt($page.url.searchParams.get('plan'));

			if (!planId)
				throw new Error('Invalid plan selected, please check you have selected a valid plan.');

			const userResponse = await userService.getProfile();
			if (!userResponse.success)
				throw new Error('Failed to fetch the plan details, please try again.');

			if (planId === userResponse.member.is_subscribed && userResponse.member.subscription.id) {
				throw new Error('Hurray! You are already using this plan. 🎉');
			}

			const planResponse = await subscriptionService.getPlanDetails(planId);
			if (!planResponse.success) throw new Error(planResponse.message);

			selectedPlan = planResponse.plan;

			const response = await subscriptionService.getSetupIntent();
			if (!response.success) throw new Error('Something went wrong, please try again.');

			clientSecret = response.intent.client_secret;
			stripe = await loadStripe(PUBLIC_STRIPE_KEY);
		} catch (error) {
			errorMessage.push(error.message);
		} finally {
			loadingPaymentForm = false;
		}
	});

	async function submit() {
		if (processing) return;

		processing = true;
		try {
			const result = await stripe.confirmCardSetup(clientSecret, {
				payment_method: {
					card: cardElement,
					billing_details: { name }
				}
			});

			if (result.error) throw new Error(result.error.message);

			const subscriptionResponse = await subscriptionService.createSubscription({
				plan_id: planId,
				payment_method: result.setupIntent.payment_method
			});

			if (!subscriptionResponse.success) throw new Error(subscriptionResponse.error);

			showThankYou = true;

			// update user profile
			getUserData();
		} catch (error) {
			errorMessage.push(error.message);
		} finally {
			processing = false;
		}
	}
</script>

<div class="flex flex-col items-center min-h-screen py-12 sm:px-6 lg:px-8">
	{#if !showThankYou}
		<div
			class="pay-form w-full max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-900 shadow-md overflow-hidden sm:rounded-lg"
		>
			{#if loadingPaymentForm}
				<div class="flex justify-center mt-5">
					<div class="mx-auto text-center align-middle">
						<Loader />
					</div>
				</div>
			{/if}

			{#if !loadingPaymentForm && errorMessage.length}
				<Errors errorMessages={errorMessage} />
			{/if}

			{#if selectedPlan}
				<div class="col-span-12 md:col-span-6 lg:col-span-4">
					<div
						class="relative border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-900 h-full"
					>
						<div class="p-5 sm:p-6 text-center">
							<div class="py-1 mb-6">
								<Icon
									icon="famicons:card-sharp"
									class="max-w-[90px] mx-auto text-4xl text-primary-600 dark:text-primary-500"
								/>
							</div>
							<div class="w-[220px] mx-auto">
								<h5
									class="text-xl text-slate-700 dark:text-white font-heading font-bold leading-tighter -tracking-snug mb-1"
								>
									{selectedPlan?.name}
								</h5>
							</div>
							<div class="pt-5">
								<div class="text-2xl text-slate-600 dark:text-white font-bold">
									{selectedPlan?.currency_symbol}{selectedPlan?.charge}
									<span>/{selectedPlan?.billing_frequency}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<Elements {stripe}>
					<form on:submit|preventDefault={submit}>
						<div>
							<input
								name="name"
								class="input mt-1 block w-full"
								bind:value={name}
								placeholder="Your name"
								disabled={processing}
							/>
						</div>
						<div class="block mt-4">
							<CardNumber
								bind:element={cardElement}
								classes={{ base: 'input mt-1 block w-full' }}
							/>
						</div>
						<div class="mt-4 flex space-x-4">
							<CardExpiry classes={{ base: 'input mt-1 block w-full' }} />
							<CardCvc classes={{ base: 'input mt-1 block w-full' }} />
						</div>

						<div class="flex items-center justify-end mt-4">
							<button
								disabled={processing}
								type="submit"
								class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition ml-4"
							>
								{#if processing}
									Processing...
								{:else}
									Pay
								{/if}
							</button>
						</div>
					</form>
				</Elements>
			{/if}
		</div>
	{:else}
		<div class="thank-you-block">
			<div
				class="mt-4 bg-blue-50 border border-primary-500 text-sm text-gray-500 rounded-lg p-2 sm:p-5 dark:bg-blue-600/10 dark:border-primary-700"
			>
				<div class="flex">
					<div class="ms-3">
						<h3 class="text-primary-600 font-semibold dark:font-medium dark:text-white">
							Thank you for your payment!
						</h3>
						<p class="mt-2 text-gray-800 dark:text-neutral-400">
							You have successfully subscribed to our plan<br />
							You can always change your plan from your dashboard.
						</p>
						<div class="mt-2 sm:mt-4">
							<a
								href="my-subscription"
								class="text-primary-600 dark:text-primary-500 text-sm font-medium mt-2 inline-block hover:underline"
							>
								View Subscription
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.input,
	:global(.input) {
		border: 1px solid #d1d5db;
		display: block;
		margin-top: 0.25rem;
		border-radius: 0.375rem;
		width: 100%;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		padding: 0.5rem 0.75rem !important;
	}
</style>
