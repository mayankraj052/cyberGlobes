<script lang="ts">
	import { MapService } from '$lib/services/map-service';
	import { groupSocialMediaData } from '$lib/utils/socialMediaUtils';
	import { socialMediaJson } from '$lib/stores/mapStore.ts';
	import { marked } from 'marked';
	import { onMount, afterUpdate } from 'svelte';
	import { getDataFromURL, putDataInURL } from '$lib/utils/generalUtils';
	import { page } from '$app/stores';

	import * as Avatar from '$lib/components/ui/avatar/index.ts';
	import { user } from '$lib/stores/authStore';
	import Icon from '@iconify/svelte';

	let markdown = '';
	let loading = true;
	let displayedMarkdown = '';
	let prompt = '';
	let messages = [];
	let sendDisabled = true;
	let messageContainer;

	async function handleInsightsHistory(insightId) {
		const mapService = new MapService();
		const data = await mapService.getInsightsHistory(insightId);

		if (data && data.success) {
			if (!insightId) {
				putDataInURL('insight', data.collection_id);
			}
			displayParsedMessages(data.messages);
		} else {
			markdown = 'No insights available, please try again.';
			displayedMarkdown = markdown;
		}
		loading = false;
		sendDisabled = false;
	}

	function displayParsedMessages(parsedMessages) {
		messages = parsedMessages.map((msg) => {
			return {
				type: msg.role === 'assistant' ? 'assistant' : 'user',
				content: msg.content[0] && msg.content[0].text ? msg.content[0].text.value : ''
			};
		});
		sendDisabled = false;
		scrollToBottom();
	}

	async function handleInitialInsight() {
		const mapService = new MapService();
		const groupedSocialMediaData = groupSocialMediaData($socialMediaJson.socialData);
		const payload = JSON.stringify(groupedSocialMediaData);
		const data = await mapService.getInsights(payload);

		if (data && data.success) {
			markdown = data.assistant_response;
			messages = [{ type: 'assistant', content: markdown }];
			putDataInURL('insight', data.collection_id);
		} else {
			markdown = 'No insights available, please try again.';
			displayedMarkdown = markdown;
		}
		loading = false;
		sendDisabled = false;
	}

	onMount(async () => {
		const insightId = getDataFromURL('insight');

		if (insightId) {
			handleInsightsHistory(insightId);
		} else {
			handleInitialInsight();
		}
	});

	async function sendPrompt() {
		if (!prompt.trim()) return;

		messages = [...messages, { type: 'user', content: prompt }];
		sendDisabled = true;
		loading = true;
		const userPrompt = prompt;
		prompt = '';

		const mapService = new MapService();
		const insightId = getDataFromURL('insight');
		const data = await mapService.getPromptInsights({ message: userPrompt }, insightId);
		if (data && data.success) {
			markdown = data.assistant_response;
			messages = [...messages, { type: 'assistant', content: markdown }];
		} else {
			markdown = 'No insights available, please try again.';
			displayedMarkdown = markdown;
		}
		loading = false;
		sendDisabled = false;
		scrollToBottom();
	}

	function scrollToBottom() {
		if (messageContainer) {
			messageContainer.scrollTop = messageContainer.scrollHeight;
		}
	}

	afterUpdate(scrollToBottom);
</script>

<div class="flex flex-col max-w-2xl mx-auto p-4 bg-gray-100 shadow-lg rounded-lg h-screen">
	<div
		class="flex flex-col space-y-4 overflow-y-auto flex-grow p-4 bg-white rounded-lg"
		bind:this={messageContainer}
	>
		{#each messages as message}
			<div class="flex items-start {message.type === 'user' ? 'justify-end' : 'justify-start'}">
				{#if message.type === 'user'}
					<div class="flex items-center space-x-2">
						<div class="p-3 rounded-lg bg-blue-500 text-white max-w-xs md:max-w-md">
							<div class="markdown-content">{@html marked(message.content)}</div>
						</div>
						<i>User</i>
					</div>
				{:else}
					<div class="flex items-center space-x-2">
						<i>AI</i>
						<div class="p-3 rounded-lg bg-gray-200 text-gray-800 max-w-xs md:max-w-md">
							<div class="markdown-content">{@html marked(message.content)}</div>
						</div>
					</div>
				{/if}
			</div>
		{/each}
		{#if loading}
			<div class="flex justify-start">
				<div class="markdown-content1">
					<Icon icon="svg-spinners:3-dots-fade" class="w-8 h-8" />
				</div>
			</div>
		{/if}
	</div>

	<div class="flex items-center space-x-2 mt-4">
		<textarea
			class="flex-1 p-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			bind:value={prompt}
			placeholder="Type your message here..."
			rows="5"
			disabled={sendDisabled}
		></textarea>
		<button
			class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
			on:click={sendPrompt}
			disabled={sendDisabled}
		>
			Send
		</button>
	</div>
</div>

<style>
	.dots::after {
		content: '';
		display: inline-block;
		animation: ellipsis 1.25s infinite;
	}

	@keyframes ellipsis {
		0% {
			content: '';
		}
		33% {
			content: '.';
		}
		66% {
			content: '..';
		}
		100% {
			content: '...';
		}
	}
</style>
