<script>
	import { Switch } from '$lib/components/ui/switch';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	export let xKeywords = '';
	export let xUsernames = '';
	export let xPostTypes = [];
</script>

<Card.Root class="bg-blue-50 shadow-lg rounded-lg">
	<Card.Header>
		<Card.Title class="text-blue-700">Filters</Card.Title>
		<Card.Description class="text-gray-600">
			Customize your search criteria
			<Separator class="my-2" />
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="space-y-4 mb-4">
			<div class="flex flex-col space-y-1">
				<label for="keyword-input" class="text-sm font-medium leading-none text-blue-700"
					>Keywords or Hashtags</label
				>
				<p class="text-xs text-gray-500">
					Enter keywords, e.g., <code class="text-pink-600">keyword1, keyword2</code>, or hashtags,
					e.g., <code class="text-pink-600">#ElonMusk, #chatGPT</code>, separated by commas.
				</p>
				<Input
					id="keyword-input"
					placeholder="Enter keyword or hashtags"
					class="border-blue-300 focus:border-blue-500"
					bind:value={xKeywords}
				/>
			</div>
			<div class="flex flex-col space-y-1">
				<label for="username-input" class="text-sm font-medium leading-none text-blue-700"
					>Usernames</label
				>
				<p class="text-xs text-gray-500">
					Enter usernames, e.g., <code class="text-pink-600">username1, username2</code>, separated
					by commas.
				</p>
				<Input
					id="username-input"
					placeholder="Enter comma-separated usernames"
					class="border-blue-300 focus:border-blue-500"
					bind:value={xUsernames}
				/>
			</div>
		</div>
		<Separator class="my-2" />
		{#each xPostTypes as filter, index}
			<div class="flex items-center justify-between space-x-4 mb-4">
				<div class="flex flex-col space-y-1">
					<p class="text-sm font-medium leading-none text-blue-700">{filter.label}</p>
					<p class="text-xs text-gray-500">{filter.description}</p>
				</div>
				<Switch class="bg-blue-500" bind:checked={xPostTypes[index].enabled} />
			</div>
		{/each}
	</Card.Content>
</Card.Root>
