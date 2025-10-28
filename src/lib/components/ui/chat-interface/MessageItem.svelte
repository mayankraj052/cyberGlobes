<script lang="ts">
	import Icon from '@iconify/svelte';
	import { marked } from 'marked';

	interface Message {
		id: string;
		role: 'user' | 'assistant';
		content: string;
		timestamp: Date;
		isVoiceInput: boolean;
	}

	export let message: Message;

	// Parse markdown for assistant messages
	function parseMarkdown(content: string): string {
		if (message.role === 'assistant') {
			return marked(content, { breaks: true });
		}
		return content;
	}

	// Process content - always use markdown parsing for assistant messages
	function processContent(content: string): string {
		if (message.role === 'assistant') {
			// Ensure content is a string before passing to marked
			const contentStr = typeof content === 'string' ? content : String(content);
			return marked(contentStr, { breaks: true });
		}
		return typeof content === 'string' ? content : String(content);
	}
</script>

<div class={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
	<div class={`
		rounded-2xl p-4 relative
		${message.role === 'user' 
			? 'bg-primary text-primary-foreground ml-auto' 
			: 'bg-muted text-foreground'
		}
	`}>
		<!-- Assistant Avatar -->
		{#if message.role === 'assistant'}
			<div class="flex items-start gap-3">
				<div class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
					<Icon icon="lucide:bot" class="w-5 h-5 text-primary" />
				</div>
				<div class="flex-1">
					<div class="prose prose-sm max-w-none dark:prose-invert">
						{@html processContent(message.content)}
					</div>
				</div>
			</div>
		{:else}
			<!-- User Message -->
			<div class="flex items-start gap-2">
				{#if message.isVoiceInput}
					<Icon icon="lucide:mic" class="w-4 h-4 text-primary-foreground/70 flex-shrink-0 mt-1" />
				{/if}
				<div class="text-sm leading-relaxed whitespace-pre-wrap">
					{message.content}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	:global(.prose) {
		color: inherit;
	}
	
	:global(.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6) {
		color: inherit;
		margin-top: 1em;
		margin-bottom: 0.5em;
	}
	
	:global(.prose p) {
		margin-top: 0.75em;
		margin-bottom: 0.75em;
	}
	
	:global(.prose ul, .prose ol) {
		margin-top: 0.5em;
		margin-bottom: 0.5em;
	}
	
	:global(.prose li) {
		margin-top: 0.25em;
		margin-bottom: 0.25em;
	}
	
	:global(.prose strong) {
		color: inherit;
		font-weight: 600;
	}
	
	:global(.prose code) {
		background: rgba(0, 0, 0, 0.1);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-size: 0.875em;
	}
	
	:global(.prose pre) {
		background: rgba(0, 0, 0, 0.1);
		border-radius: 0.5rem;
		padding: 1rem;
		overflow-x: auto;
	}

	.group:hover .group-hover\:opacity-100 {
		opacity: 1;
	}

	/* Final message styling */
	:global(.prose a.inline-flex) {
		text-decoration: none !important;
		display: inline-flex !important;
		align-items: center !important;
		gap: 0.5rem !important;
		padding: 0.5rem 1rem !important;
		margin: 0.5rem 0 !important;
		border-radius: 0.5rem !important;
		transition: all 0.2s !important;
		font-weight: 500 !important;
	}
</style>