<script lang="ts">
	import { Bar } from '$lib/components/charts/index.ts';
	export let usages;
	export let loading;
</script>

<Bar {usages} {loading} />
