<script lang="ts">
	import { user } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import { DashboardService } from '$lib/services/dashboard-service';
	import { Badge } from '$lib/components/ui/badge';
	import SubscriptionNotice from '$lib/components/general/subscription/SubscriptionNotice.svelte';
	import * as Card from '$lib/components/ui/card/index.ts';
	import Icon from '@iconify/svelte';
	import { Overview, RecentSearch } from './index.ts';

	let data = {};
	let loading = false;

	let recent_searches: any[] = [];
	let api_credits_usage: Record<string, number> = {};

	onMount(async () => {
		loading = true;
		const dashboardService = new DashboardService();
		try {
			const response = await dashboardService.dashboardContent();
			if (!response.success) {
				throw new Error('Failed to fetch data');
			}
			data = response;
			recent_searches = data?.recent_searches || {};
			api_credits_usage = data?.api_credits_usage || {};
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			loading = false;
		}
	});
</script>

<div class="container max-w-100">
	<div class="flex-1 space-y-4">
		<h2 class="text-3xl font-bold tracking-tight text-dark dark:text-white">Dashboard</h2>
		<!-- Subscription Notice -->
		<SubscriptionNotice />
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{#if $user}
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">Total Credits</Card.Title>
						<Icon icon="akar-icons:coin" class="text-muted-foreground h-4 w-4" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold">{$user.api_credits ?? 0}</div>
						<p class="text-muted-foreground text-xs">Available credits</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium"
							>Subscriptions
							{#if $user.subscription}
								<Badge class="bg-primary">{$user.subscription.billing_frequency}</Badge>
							{:else}
								<Badge class="bg-primary">No Subscription</Badge>
							{/if}
						</Card.Title>
						<Icon class="text-muted-foreground h-4 w-4" icon="ion:card-outline" />
					</Card.Header>
					<Card.Content>
						{#if $user.subscription}
							<div class="text-2xl font-bold">
								{$user.subscription.currency_symbol}{$user.subscription.charge}
							</div>
							<p class="text-muted-foreground text-xs">
								Next billing date: {$user.next_billing_date ?? 'N/A'}
							</p>
						{:else}
							<div class="text-2xl font-bold">0</div>
							<p class="text-muted-foreground text-xs">No active subscription</p>
						{/if}
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">Total Hits</Card.Title>
						<Icon icon="lucide:activity" class="text-muted-foreground h-4 w-4" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold">{$user.total_search_requests ?? 0}</div>
						<p class="text-muted-foreground text-xs">Overall hits</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">
							<a href="/profile">{$user.name}</a>
						</Card.Title>
						<Icon icon="lucide:user" class="text-muted-foreground h-4 w-4" />
					</Card.Header>
					<Card.Content>
						<div class="text-2sm font-bold"><i>Last login</i> {$user.last_login}</div>
						<p class="text-muted-foreground text-xs">IP: {$user.last_login_ip}</p>
					</Card.Content>
				</Card.Root>
			{:else}
				{#each Array(4) as _}
					<Card.Root>
						<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
							<Card.Title class="text-sm font-medium bg-gray-300 animate-pulse h-4 w-1/3 rounded"
							></Card.Title>
							<div class="h-4 w-4 bg-gray-300 animate-pulse rounded"></div>
						</Card.Header>
						<Card.Content>
							<div class="h-8 bg-gray-300 animate-pulse w-1/2 rounded"></div>
							<div class="h-4 bg-gray-300 animate-pulse w-3/4 rounded mt-2"></div>
						</Card.Content>
					</Card.Root>
				{/each}
			{/if}
		</div>
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7 h-full">
			<Card.Root class="col-span-4 flex flex-col h-[500px]">
				<Card.Header>
					<Card.Title>Recent Usage</Card.Title>
				</Card.Header>
				<Card.Content class="flex-grow">
					<Overview {loading} usages={api_credits_usage} />
				</Card.Content>
			</Card.Root>

			<Card.Root class="col-span-3 flex flex-col h-[500px]">
				<Card.Header>
					<Card.Title>Recent Searches</Card.Title>
				</Card.Header>
				<Card.Content class="flex-grow overflow-y-auto">
					<RecentSearch {loading} searches={recent_searches} />
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
