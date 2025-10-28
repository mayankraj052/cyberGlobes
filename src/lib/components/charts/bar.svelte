<script>
	import { onMount } from 'svelte';
	import ApexChart from './ApexChart.svelte';
	import { tick } from 'svelte';

	export let usages = {};
	export let loading;

	let options = {};
	let series = [];
	let xData = [];
	let yData = [];

	function updateChartData() {
		if (!usages || Object.keys(usages).length === 0) {
			console.log('No data available yet');
			return;
		}

		xData = [];
		yData = [];

		for (let key in usages) {
			const date = new Date(key);
			const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
			xData.push(formattedDate);
			yData.push(usages[key]);
		}

		options = {
			chart: {
				type: 'bar',
				toolbar: { show: false },
				animations: {
					enabled: true,
					easing: 'easeinout',
					speed: 800
				}
			},
			plotOptions: {
				bar: {
					borderRadius: 6,
					horizontal: false,
					columnWidth: '70%'
				}
			},
			dataLabels: { enabled: false },
			colors: ['#3b82f6'],
			xaxis: { categories: xData },
			yaxis: {},
			tooltip: { theme: 'dark' }
		};

		series = [{ name: 'Usages', data: yData }];
	}

	onMount(async () => {
		await tick();
		updateChartData();
	});

	$: if (usages && Object.keys(usages).length > 0) {
		updateChartData();
	}
</script>

<div class="w-full">
	{#if series.length > 0}
		<ApexChart {options} {series} />
	{:else if loading === false}
		<div
			role="status"
			class="max-full p-4 border border-gray-200 rounded-sm shadow-sm animate-pulse md:p-6 dark:border-gray-700"
		>
			<div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2.5"></div>
			<div class="w-48 h-2 mb-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
			<div class="flex items-baseline mt-4">
				<div class="w-full bg-gray-200 rounded-t-lg h-72 dark:bg-gray-700"></div>
				<div class="w-full h-56 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
				<div class="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-700"></div>
				<div class="w-full h-64 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
				<div class="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-700"></div>
				<div class="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-700"></div>
				<div class="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-700"></div>
			</div>
			<span class="sr-only">Loading...</span>
		</div>
	{:else}
		<p class="text-muted-foreground text-xs">No data found</p>
	{/if}
</div>
