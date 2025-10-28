<script lang="ts">
	import { onMount } from 'svelte';

	export let options;
	export let series;

	let chartDiv;
	let ApexCharts;

	onMount(async () => {
		if (typeof window !== 'undefined') {
			const module = await import('apexcharts'); // Import dynamically ✅
			ApexCharts = module.default;

			let chart = new ApexCharts(chartDiv, { ...options, series });
			chart.render();

			return () => chart.destroy();
		}
	});
</script>

<div bind:this={chartDiv}></div>
