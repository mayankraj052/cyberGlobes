<script>
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import {
		FACEBOOK_MARKETPLACE_CATEGORIES,
		FACEBOOK_MARKETPLACE_SORT_OPTIONS
	} from '$lib/constants/constants';

	export let fbmKeywords = '';
	export let fbmMinPrice = '';
	export let fbmMaxPrice = '';
	export let fbmSort = '';
	export let fbmCategoryId = '';
</script>

<Card.Root class="bg-blue-50 shadow-lg rounded-lg">
	<Card.Header>
		<Card.Title class="text-blue-700">Filters</Card.Title>
		<Card.Description class="text-gray-600">
			Customize your search criteria for Facebook Marketplace results.
			<Separator class="my-2" />
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="space-y-4 mb-4">
			<div class="flex flex-col space-y-1">
				<label for="keyword-input" class="text-sm font-medium leading-none text-blue-700">
					Keywords
				</label>
				<p class="text-xs text-gray-500">
					Enter keywords, e.g., <code class="text-pink-600">keyword1, keyword2</code> separated by commas.
				</p>
				<Input
					id="keyword-input"
					placeholder="Enter keyword or hashtags"
					class="border-blue-300 focus:border-blue-500"
					bind:value={fbmKeywords}
				/>
			</div>

			<div class="flex flex-col space-y-1">
				<label for="post-order-select" class="text-sm font-medium leading-none text-blue-700">
					Category
				</label>
				<p class="text-xs text-gray-500">Select the category to filter results</p>
				<select
					bind:value={fbmCategoryId}
					id="post-order-select"
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
				>
					<option value="">Select a category</option>
					{#each FACEBOOK_MARKETPLACE_CATEGORIES as category}
						<option value={category.value}>{category.label}</option>
					{/each}
				</select>
			</div>

			<div class="flex flex-col space-y-1">
				<label for="keyword-input" class="text-sm font-medium leading-none text-blue-700">
					Price Range
				</label>
				<p class="text-xs text-gray-500">Enter the price range</p>
				<div class="flex space-x-2">
					<Input
						id="min-price-input"
						placeholder="Min Price"
						class="border-blue-300 focus:border-blue-500"
						bind:value={fbmMinPrice}
					/>
					<Input
						id="max-price-input"
						placeholder="Max Price"
						class="border-blue-300 focus:border-blue-500"
						bind:value={fbmMaxPrice}
					/>
				</div>
			</div>

			<div class="flex flex-col space-y-1">
				<label for="post-order-select" class="text-sm font-medium leading-none text-blue-700">
					Sort Option
				</label>
				<p class="text-xs text-gray-500">Select the sort option</p>
				<select
					bind:value={fbmSort}
					id="post-order-select"
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
				>
					<option value="">Select a sorting option</option>
					{#each FACEBOOK_MARKETPLACE_SORT_OPTIONS as sortOption}
						<option value={sortOption.value}>{sortOption.label}</option>
					{/each}
				</select>
			</div>
		</div>
		<Separator class="my-2" />
	</Card.Content>
</Card.Root>
