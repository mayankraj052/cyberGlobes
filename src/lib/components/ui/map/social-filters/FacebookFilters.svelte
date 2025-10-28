<script>
	import { Switch } from '$lib/components/ui/switch';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { FACEBOOK_CATEGORIES } from '$lib/constants/constants';
	import { MapService } from '$lib/services/map-service';
	import Icon from '@iconify/svelte';

	export let fbKeywords = '';
	export let fbPostTypes = [];
	export let fbPublicPosts;
	export let fbRecentPosts;
	export let fbEducationId = '';
	export let fbWorkId = '';
	export let fbCategoryId = '';
	export let educationSuggestions = {};
	export let workSuggestions = /** @type {{ id: string, text: string, image: string }[]} */ ([]);

	$: isEducationFetching = false;
	$: isWorkFetching = false;

	function debounce(func, wait) {
		let timeout;
		return function (...args) {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	}

	const debouncedHandleTypeSearchFilters = debounce(handleTypeSearchFilters, 800);

	function handleTypeSearchFilters(type, keyword, feature = 'facebook') {
		if (keyword === '') {
			if (type === 'education') {
				educationSuggestions = [];
			} else {
				workSuggestions = [];
			}

			return;
		}

		if (type === 'education') {
			isEducationFetching = true;
		}

		if (type === 'work') {
			isWorkFetching = true;
		}
		const mapService = new MapService();
		const payload = {
			type,
			keyword,
			feature
		};
		mapService.getSearchFilters(payload).then((response) => {
			if (response.success) {
				const suggestions = response.results.map((item) => ({
					id: item.node.value_object.id,
					text: item.node.text,
					image: item.node.value_object.profile_picture.uri
				}));
				if (type === 'education') {
					educationSuggestions = suggestions;
				} else {
					workSuggestions = suggestions;
				}
			} else {
				console.error(response);
			}

			if (type === 'education') {
				isEducationFetching = false;
			}

			if (type === 'work') {
				isWorkFetching = false;
			}
		});
	}

	function handleEducationSelect(event) {
		const selectedOption = event.target.selectedOptions[0];
		fbEducationId = selectedOption.value;
	}

	function handleWorkSelect(event) {
		const selectedOption = event.target.selectedOptions[0];
		fbWorkId = selectedOption.value;
	}
</script>

<Card.Root class="bg-blue-50 shadow-lg rounded-lg">
	<Card.Header>
		<Card.Title class="text-blue-700">Filters</Card.Title>
		<Card.Description class="text-gray-600">
			Customize your search criteria for Facebook Results.
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
					placeholder="Enter keywords"
					class="border-blue-300 focus:border-blue-500"
					bind:value={fbKeywords}
				/>
			</div>
		</div>
		<Separator class="my-2" />
		{#each fbPostTypes as filter, index}
			<div class="flex items-center justify-between space-x-4 mb-4">
				<div class="flex flex-col space-y-1">
					<p class="text-sm font-medium leading-none text-blue-700">{filter.label}</p>
					<p class="text-xs text-gray-500">{filter.description}</p>
				</div>
				<Switch class="bg-blue-500" bind:checked={fbPostTypes[index].enabled} />
			</div>
			{#if filter.label === 'Posts' && fbPostTypes[index].enabled}
				<Card.Root class="p-0 m-0 border-0">
					<Card.Content class="p-3">
						<div class="flex items-center justify-between space-x-4 mb-4">
							<div class="flex flex-col space-y-1">
								<p class="text-sm font-medium leading-none text-blue-700">Public Posts</p>
								<p class="text-xs text-gray-500">Fetch Public Posts</p>
							</div>
							<Switch class="bg-blue-500" bind:checked={fbPublicPosts} />
						</div>

						<Separator class="my-2" />

						<div class="space-y-4 mb-4">
							<div class="flex flex-col space-y-1">
								<label
									for="post-order-select"
									class="text-sm font-medium leading-none text-blue-700"
								>
									Post Sorting
								</label>
								<p class="text-xs text-gray-500">
									Select the order in which posts should be displayed.
								</p>
								<select
									id="post-order-select"
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
									bind:value={fbRecentPosts}
								>
									<option value="Relevancy">Relevancy</option>
									<option value="Recent">Recent</option>
								</select>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/if}

			{#if filter.label === 'Users' && fbPostTypes[index].enabled}
				<Card.Root class="p-0 m-0 border-0">
					<Card.Content class="p-3">
						<div class="space-y-4 mb-4">
							<div class="flex flex-col space-y-1">
								<label
									for="post-order-select"
									class="text-sm font-medium leading-none text-blue-700"
								>
									Education
								</label>
								<p class="text-xs text-gray-500">Filters users based on their education.</p>
								<Input
									id="education-input"
									placeholder="Enter keywords"
									class="border-blue-300 focus:border-blue-500"
									bind:value={fbEducationId}
									on:input={() => debouncedHandleTypeSearchFilters('education', fbEducationId)}
								/>
								{#if isEducationFetching}
									<p class="text-blue-500 text-xs flex items-center">
										<Icon class="w-4 h-4" icon="line-md:loading-twotone-loop" />
										<span class="ml-2">Fetching results, please wait...</span>
									</p>
								{/if}
								<select
									id="education-select"
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
									on:change={handleEducationSelect}
								>
									<option value="">Select an education</option>
									{#each educationSuggestions as suggestion}
										<option value={suggestion.id}>{suggestion.text}</option>
									{/each}
								</select>
							</div>
							<Separator class="my-2" />
							<div class="flex flex-col space-y-1">
								<label
									for="post-order-select"
									class="text-sm font-medium leading-none text-blue-700"
								>
									Work
								</label>
								<p class="text-xs text-gray-500">Filters users based on their work experience.</p>
								<Input
									id="work-input"
									placeholder="Enter keywords"
									class="border-blue-300 focus:border-blue-500"
									bind:value={fbWorkId}
									on:input={() => debouncedHandleTypeSearchFilters('work', fbWorkId)}
								/>
								{#if isWorkFetching}
									<p class="text-blue-500 text-xs flex items-center">
										<Icon class="w-4 h-4" icon="line-md:loading-twotone-loop" />
										<span class="ml-2">Fetching results, please wait...</span>
									</p>
								{/if}
								<select
									id="work-select"
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
									on:change={handleWorkSelect}
								>
									<option value="">Select a work experience</option>
									{#each workSuggestions as suggestion}
										<option value={suggestion.id}>{suggestion.text}</option>
									{/each}
								</select>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/if}

			{#if filter.label === 'Pages' && fbPostTypes[index].enabled}
				<Card.Root class="p-0 m-0 border-0">
					<Card.Content class="p-3">
						<div class="space-y-4 mb-4">
							<div class="flex flex-col space-y-1">
								<label
									for="post-order-select"
									class="text-sm font-medium leading-none text-blue-700"
								>
									Page Category
								</label>
								<p class="text-xs text-gray-500">Select the category of pages to filter pages</p>
								<select
									bind:value={fbCategoryId}
									id="post-order-select"
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
								>
									<option value="">Select a category</option>
									{#each FACEBOOK_CATEGORIES as category}
										<option value={category.value}>{category.label}</option>
									{/each}
								</select>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/if}

			{#if index !== fbPostTypes.length - 1}
				<Separator class="my-2" />
			{/if}
		{/each}
	</Card.Content>
</Card.Root>
