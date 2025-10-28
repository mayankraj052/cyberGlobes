<script>
	import { goto } from '$app/navigation';
	import { user, isLoggedIn } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	let activPlan = null;

	onMount(() => {
		if ($isLoggedIn) {
			activPlan = $user.subscription;

			if (activPlan === null) {
				goto('/pricing');
			}
		}
	});
</script>

<main>
	<div>
		<div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
			<div class="mt-10 sm:mt-0">
				<div class="md:grid md:grid-cols-3 md:gap-6">
					<div class="md:col-span-1 flex justify-between">
						<div class="px-4 sm:px-0">
							<h3 class="text-lg font-medium text-gray-900">Active Plan</h3>
							<p class="mt-1 text-sm text-gray-600">
								Check your current plan or upgrade to a new one.
							</p>
						</div>

						<div class="px-4 sm:px-0"></div>
					</div>

					{#if activPlan}
						<div class="px-4 py-5 bg-white sm:p-6 shadow sm:rounded-tl-md sm:rounded-tr-md">
							<div class="mt-5 md:mt-0 md:col-span-2">
								<h3 class="text-base font-semibold text-[#2C7BE5]">{activPlan.title}</h3>
								<p class="mt-4 flex items-baseline gap-x-2">
									<span class="text-5xl font-semibold tracking-tight text-gray-900"
										>{activPlan.currency_symbol}{activPlan.charge}</span
									>
									<span class="text-base text-gray-500">/{activPlan.billing_frequency}</span>
								</p>
								{#if activPlan.features}
									<ul role="list" class="mt-8 space-y-3 text-sm/6 text-gray-600 sm:mt-10">
										{#each activPlan.features as feature}
											<li class="flex gap-x-3">
												<svg
													class="h-6 w-5 flex-none text-[#2C7BE5]"
													viewBox="0 0 20 20"
													fill="currentColor"
													aria-hidden="true"
													data-slot="icon"
												>
													<path
														fill-rule="evenodd"
														d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
														clip-rule="evenodd"
													/>
												</svg>
												{feature}
											</li>
										{/each}
									</ul>
								{/if}
								<div
									class="flex items-center justify-end px-4 py-3 bg-gray-50 text-right sm:px-6 sm:rounded-br-md"
								>
									<a
										href="/pricing"
										class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition ml-4"
									>
										Change Plan
									</a>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</main>
