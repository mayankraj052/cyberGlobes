<script>
	import ThemeSwitcher from '../general/ThemeSwitcher.svelte';
	import UserNav from '../general/UserNav.svelte';
	import Toast from '../ui/toast/Toast.svelte';
</script>

<div class="border-b">
	<Toast />
	<div class="flex h-16 items-center px-4 dark:bg-gray-900">
		<div class="ml-auto flex items-center space-x-4">
			<ThemeSwitcher />
			<UserNav />
		</div>
	</div>
</div>
<!-- header -->
