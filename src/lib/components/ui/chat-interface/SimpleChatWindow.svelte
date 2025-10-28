<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import ChatMessage from './ChatMessage.svelte';
	import { onMount, afterUpdate } from 'svelte';

	let messages: Array<{id: string, text: string, isUser: boolean}> = [];
	let inputValue = '';
	let messagesContainer: HTMLElement;
	let isProcessing = false;

	const processSteps = [
		"Understanding the user input...",
		"Executing step 1/3 ...",
		"Executing step 2/3 ...",
		"Executing step 3/3 ..."
	];

	async function handleSubmit() {
		if (!inputValue.trim() || isProcessing) return;

		// Add user message
		const userMessage = {
			id: `user-${Date.now()}`,
			text: inputValue.trim(),
			isUser: true
		};

		messages = [...messages, userMessage];
		inputValue = '';
		isProcessing = true;

		// Process the mock sequence
		for (let i = 0; i < processSteps.length; i++) {
			await new Promise(resolve => setTimeout(resolve, 3000));
			
			const stepMessage = {
				id: `step-${Date.now()}-${i}`,
				text: processSteps[i],
				isUser: false
			};
			
			messages = [...messages, stepMessage];
		}

		// Final message with link
		await new Promise(resolve => setTimeout(resolve, 3000));
		const finalMessage = {
			id: `final-${Date.now()}`,
			text: `Here's your output. <a href="/visualization" target="_blank" class="text-blue-600 hover:text-blue-800 underline">View Visualization</a>`,
			isUser: false
		};

		messages = [...messages, finalMessage];
		isProcessing = false;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	}

	// Auto-scroll to bottom when new messages are added
	afterUpdate(() => {
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	});
</script>

<div class="flex flex-col h-full bg-white">
	<!-- Messages Container -->
	<div 
		bind:this={messagesContainer}
		class="flex-1 overflow-y-auto p-6 space-y-4"
	>
		{#each messages as message (message.id)}
			<ChatMessage text={message.text} isUser={message.isUser} />
		{/each}
	</div>

	<!-- Input Area -->
	<div class="border-t bg-white p-6">
		<form on:submit|preventDefault={handleSubmit} class="max-w-4xl mx-auto">
			<div class="flex gap-3">
				<Input
					bind:value={inputValue}
					on:keydown={handleKeyDown}
					placeholder="Type your message here..."
					disabled={isProcessing}
					class="flex-1 text-base py-3 px-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
				<Button
					type="submit"
					disabled={!inputValue.trim() || isProcessing}
					class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-300"
				>
					{isProcessing ? 'Processing...' : 'Send'}
				</Button>
			</div>
		</form>
	</div>
</div>