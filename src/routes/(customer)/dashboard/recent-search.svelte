<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Badge } from '$lib/components/ui/badge';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Icon from '@iconify/svelte';
	import * as Table from '$lib/components/ui/table';

	export let searches = null;
	export let loading;
</script>

<div class="space-y-8">
	{#if loading}
		{#each Array(6) as _, i}
			<div class="flex items-center animate-pulse">
				<div class="ml-4 space-y-1">
					<Skeleton class="h-4 w-40" />
					<Skeleton class="h-4 w-32" />
				</div>
				<div class="ml-auto">
					<Skeleton class="h-4 w-10" />
				</div>
			</div>
		{/each}
	{:else if searches && searches.length > 0}
		<Table.Root>
			<Table.Caption><a class="text-primary" href="/my-requests">View all</a></Table.Caption>
			<Table.Body>
				{#each searches as search}
					<Table.Row>
						<Table.Cell class="font-medium">
							{search.address} <br />
							{search.request_params.latitude}, {search.request_params.longitude}
						</Table.Cell>
						<Table.Cell>{search.request_origin}</Table.Cell>
						<Table.Cell class="text-right">
							<Badge variant="outline" class="w-max">-{search.api_credits} credits</Badge>
						</Table.Cell>
						<Table.Cell class="text-right">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<Icon icon="pepicons-pop:dots-y" />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									<DropdownMenu.Group>
										<DropdownMenu.Item>
											<a href="my-requests/{search.id}">View</a>
										</DropdownMenu.Item>
									</DropdownMenu.Group>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{:else}
		<p class="text-center text-gray-500">No data found</p>
	{/if}
</div>
