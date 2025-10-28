<script>
	export let title = '';
	export let value = '';
</script>

<div class="col-span-12 sm:col-span-6 2xl:col-span-3">
	<div
		class="border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-900 h-full"
	>
		<div class="p-5 sm:p-6">
			<h6
				class="font-heading text-base -tracking-snug leading-tighter font-bold text-slate-700 dark:text-white"
			>
				{title}
			</h6>
			<div class="flex items-center justify-between my-2">
				<div class="text-3xl font-medium text-slate-700 dark:text-white">{value}</div>
			</div>
		</div>
	</div>
</div>
