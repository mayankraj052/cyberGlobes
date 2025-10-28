<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Button } from '$lib/components/ui/button/index.ts';
	import { logout, user } from '$lib/stores/authStore';
	import Icon from '@iconify/svelte';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
			<Avatar.Root class="h-8 w-8">
				{#if $user?.profile_photo_url}
					<Avatar.Image src={$user.profile_photo_url} alt="user" />
				{/if}
				<Avatar.Fallback>User</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">{$user?.name ? $user.name : 'User'}</p>
				<p class="text-muted-foreground text-xs leading-none">{$user?.email ? $user.email : ''}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item>
				<Icon icon="lucide:user" class="mr-2 h-4 w-4" />
				<a href="/profile">
					<span>Profile</span>
				</a>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<Icon icon="lucide:credit-card" class="mr-2 h-4 w-4" />
				<a href="my-subscription">
					<span>My Subscription</span>
				</a>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<Icon icon="lucide:log-out" class="mr-2 h-4 w-4" />
			<a href="javascript:void(0)" on:click={logout()}>
				<span>Log out</span>
			</a>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
