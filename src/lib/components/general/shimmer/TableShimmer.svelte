<script lang="ts">
	export let rows = 10;
	let skeletonRows = Array(rows).fill(0);
</script>

<table class="w-full border-collapse">
	<tbody>
		{#each skeletonRows as _, i}
			<tr class="border-b">
				<td class="p-3"><div class="h-4 w-40 bg-gray-300 rounded animate-pulse"></div></td>
				<td class="p-3"><div class="h-4 w-40 bg-gray-300 rounded animate-pulse"></div></td>
				<td class="p-3"><div class="h-4 w-40 bg-gray-300 rounded animate-pulse"></div></td>
				<td class="p-3"><div class="h-4 w-40 bg-gray-300 rounded animate-pulse"></div></td>
			</tr>
		{/each}
	</tbody>
</table>
