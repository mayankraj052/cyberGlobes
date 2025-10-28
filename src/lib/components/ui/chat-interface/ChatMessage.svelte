<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let text: string;
	export let isUser: boolean = false;

	let displayText = '';
	let showMessage = false;

	onMount(() => {
		showMessage = true;
		
		if (!isUser) {
			// Typing animation for AI messages
			typeMessage();
		} else {
			// Instant display for user messages
			displayText = text;
		}
	});

	async function typeMessage() {
		await new Promise(resolve => setTimeout(resolve, 200)); // Small delay before typing starts
		
		for (let i = 0; i <= text.length; i++) {
			displayText = text.slice(0, i);
			await new Promise(resolve => setTimeout(resolve, 30)); // Typing speed
		}
	}
</script>

{#if showMessage}
	<div 
		class={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}
		in:fade={{ duration: 300 }}
	>
		<div class={`
			max-w-[80%] px-4 py-3 rounded-lg
			${isUser 
				? 'bg-blue-600 text-white ml-auto' 
				: 'bg-gray-100 text-gray-800'
			}
		`}>
			<div class="text-sm leading-relaxed">
				{#if isUser}
					{displayText}
				{:else}
					{@html displayText}
				{/if}
			</div>
		</div>
	</div>
{/if}