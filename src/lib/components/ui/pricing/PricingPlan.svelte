<script lang="ts">
	import { isLoggedIn, user } from '$lib/stores/authStore';
	export let plan;
	const activePlanID = $user?.subscription?.id || 0;
</script>

<div
	class={plan.is_recommended
		? 'relative rounded-3xl bg-gray-900 p-8 shadow-2xl ring-1 ring-gray-900/10 sm:p-10'
		: 'rounded-3xl rounded-t-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:mx-8 sm:p-10 lg:mx-0 lg:rounded-bl-3xl'}
>
	{#if activePlanID === plan.id}
		<span
			class="relative inline-flex rounded-full px-2 border border-primary-600 bg-primary-600 text-white text-xxs text-center font-medium leading-4.5 tracking-snug whitespace-nowrap align-middle"
			>Current Plan</span
		>
	{/if}
	<h3
		class={plan.is_recommended
			? 'text-base/7 font-semibold text-[#2C7BE5]'
			: 'text-base font-semibold text-[#2C7BE5]'}
	>
		{plan.name}
	</h3>
	<p class="mt-4 flex items-baseline gap-x-2">
		<span
			class={plan.is_recommended
				? 'text-5xl font-semibold tracking-tight text-white'
				: 'text-5xl font-semibold tracking-tight text-gray-900'}
		>
			{plan.currency_symbol}{plan.charge}
		</span>
		<span class={plan.is_recommended ? 'text-base text-gray-400' : 'text-base text-gray-500'}
			>/{plan.billing_frequency}</span
		>
	</p>
	<p
		class={plan.is_recommended
			? 'mt-6 text-base/7 text-gray-300'
			: 'mt-6 text-base/7 text-gray-600'}
	>
		{plan.caption}
	</p>
	{#if plan.features}
		<ul
			role="list"
			class={plan.is_recommended
				? 'mt-8 space-y-3 text-sm/6 text-gray-300 sm:mt-10'
				: 'mt-8 space-y-3 text-sm/6 text-gray-600 sm:mt-10'}
		>
			{#each plan.features as feature}
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
	{#if activePlanID !== plan.id}
		<a
			href={$isLoggedIn ? `/pay?plan=${plan.id}` : `/login`}
			class={plan.is_recommended
				? 'mt-8 block rounded-md bg-[#2C7BE5] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#000000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2C7BE5] hover:ring-1 hover:ring-[#2C7BE5] sm:mt-10'
				: 'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-[#2C7BE5] ring-1 ring-inset ring-indigo-200 hover:text-[#FFFFFF] hover:bg-[#2C7BE5] hover:ring-[#2C7BE5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2C7BE5] sm:mt-10'}
		>
			{$isLoggedIn ? `Get started today` : `Sign up`}
		</a>
	{/if}
</div>
