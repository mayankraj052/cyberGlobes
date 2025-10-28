<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import { ConversationService } from '$lib/services/conversation-service.js';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getDataFromURL, putDataInURL, removeDataFromURL } from '$lib/utils/generalUtils';

	const conversationService = new ConversationService();

	export let selectedChatId = '';
	export let onChatSelect: (chatId: string) => void;
	export let onConversationLoaded: ((data: any) => void) | undefined = undefined;

	// Expose refresh function to parent component
	export function refreshConversations() {
		console.log('Refreshing conversations, current selectedChatId:', selectedChatId);
		loadConversations(1, false);
	}

	let conversations: any[] = [];
	let loading = true;
	let error = '';
	let currentPage = 1;
	let hasMoreData = true;

	interface ApiResponse {
		success?: boolean;
		conversations?: {
			data: any[];
			meta: {
				current_page: number;
				last_page: number;
				per_page: number;
				total: number;
			};
			links: {
				next: string | null;
				prev: string | null;
			};
		};
		message?: string;
	}

	async function loadConversations(page = 1, append = false) {
		try {
			loading = true;
			error = '';
			
			const response = await conversationService.getConversations(page) as ApiResponse;
			
			if (response?.success && response?.conversations) {
				const newConversations = transformConversations(response.conversations.data);
				
				if (append) {
					// Filter out duplicates when appending
					const existingIds = new Set(conversations.map(c => c.id));
					const uniqueNewConversations = newConversations.filter(c => !existingIds.has(c.id));
					conversations = [...conversations, ...uniqueNewConversations];
				} else {
					conversations = newConversations;
				}
				
				// Check if there's more data based on pagination info
				hasMoreData = response.conversations.meta.current_page < response.conversations.meta.last_page;
				currentPage = response.conversations.meta.current_page;
			} else {
				error = response?.message || 'Failed to load conversations';
			}
		} catch (err) {
			console.error('Error loading conversations:', err);
			error = 'Failed to load conversations. Please try again.';
		} finally {
			loading = false;
		}
	}

	function transformConversations(apiConversations: any[]) {
		const transformed = apiConversations.map((conv: any, index: number) => ({
			id: conv.id ? conv.id.toString() : `temp-${Date.now()}-${index}`,
			title: conv.title || 'Untitled Conversation'
		}));
		console.log('Transformed conversations:', transformed);
		console.log('Selected chat ID for comparison:', selectedChatId);
		return transformed;
	}

	function selectChat(chatId: string) {
		console.log('Selecting chat:', chatId);
		// Don't update local selectedChatId - let parent handle it
		// Update URL with conversation ID
		putDataInURL('conversation_id', chatId);
		// Notify parent to update its state
		onChatSelect(chatId);
		// Load conversation data
		loadConversationData(chatId);
	}

	async function loadConversationData(conversationId: string) {
		try {
			const response = await conversationService.retrieveConversation(conversationId) as any;
			if (response && response.success) {
				// Emit conversation data to parent component
				if (onConversationLoaded) {
					onConversationLoaded(response);
				}
			}
		} catch (error) {
			console.error('Error loading conversation data:', error);
		}
	}

	async function createNewChat() {
		// Remove any existing conversation_id from URL to start fresh
		removeDataFromURL('conversation_id');
		
		// Generate a temporary chat ID for UI state management
		// The actual conversation will be created when user sends their first message
		const newChatId = `new-${Date.now()}`;
		selectedChatId = newChatId;
		onChatSelect(newChatId);
		
		// Don't reload conversations yet since no backend conversation exists
		// The conversation will be created via initiate API when user sends first message
		console.log('New chat session started, ready for first message');
	}

	let chatListElement: HTMLElement;
	let scrollTimeout: ReturnType<typeof setTimeout>;

	function handleScroll() {
		if (!chatListElement || loading || !hasMoreData) return;
		
		// Throttle scroll events
		if (scrollTimeout) {
			clearTimeout(scrollTimeout);
		}
		
		scrollTimeout = setTimeout(() => {
			const { scrollTop, scrollHeight, clientHeight } = chatListElement;
			const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
			
			// Load more when user has scrolled 80% of the way down
			// Only if current page is less than last page
			if (scrollPercentage > 0.8 && hasMoreData) {
				loadConversations(currentPage + 1, true);
			}
		}, 100);
	}

	onMount(() => {
		loadConversations();
		
		// Check if there's a conversation_id in the URL
		const conversationIdFromUrl = getDataFromURL('conversation_id');
		if (conversationIdFromUrl && typeof conversationIdFromUrl === 'string') {
			selectedChatId = conversationIdFromUrl;
			onChatSelect(conversationIdFromUrl);
			loadConversationData(conversationIdFromUrl);
		}
	});
</script>

<div class="h-full flex flex-col p-4 bg-muted/20">
	<!-- Header -->
	<div class="mb-6">
		<h2 class="text-lg font-semibold mb-2">Chat History</h2>
		<p class="text-sm text-muted-foreground">Your previous conversations with the AI assistant</p>
	</div>

	<!-- New Chat Button -->
	<Button 
		on:click={createNewChat}
		class="w-full mb-6 justify-start gap-2"
		variant="default"
	>
		<Icon icon="lucide:plus" class="w-4 h-4" />
		Start New Chat
	</Button>

	<!-- Chat List -->
	<div 
		bind:this={chatListElement}
		class="flex-1 overflow-y-auto space-y-1" 
		on:scroll={handleScroll}
	>
		{#if loading && conversations.length === 0}
			<div class="flex items-center justify-center p-4">
				<Icon icon="lucide:loader-2" class="w-6 h-6 animate-spin text-muted-foreground" />
				<span class="ml-2 text-sm text-muted-foreground">Loading conversations...</span>
			</div>
		{:else if error}
			<div class="p-4 text-center">
				<Icon icon="lucide:alert-circle" class="w-6 h-6 text-destructive mx-auto mb-2" />
				<p class="text-sm text-destructive mb-2">{error}</p>
				<Button 
					size="sm" 
					variant="outline" 
					on:click={() => loadConversations()}
				>
					<Icon icon="lucide:refresh-cw" class="w-4 h-4 mr-2" />
					Retry
				</Button>
			</div>
		{:else if conversations.length === 0}
			<div class="p-4 text-center">
				<Icon icon="lucide:message-circle" class="w-8 h-8 text-muted-foreground mx-auto mb-2" />
				<p class="text-sm text-muted-foreground mb-2">No conversations yet</p>
				<p class="text-xs text-muted-foreground">Start a new chat to begin</p>
			</div>
		{:else}
			{#each conversations as chat (chat.id)}
				<div 
					class={`
						p-3 cursor-pointer transition-all rounded-lg border
						${selectedChatId === chat.id 
							? 'bg-primary/10 border-primary/20 text-primary' 
							: 'hover:bg-accent/50 border-transparent text-foreground'
						}
					`}
					on:click={() => selectChat(chat.id)}
					role="button"
					tabindex="0"
					on:keydown={(e) => e.key === 'Enter' && selectChat(chat.id)}
				>
					<div class="flex items-center justify-between">
						<h3 class="font-medium text-sm truncate flex-1">
							{chat.title}
						</h3>
						
						{#if selectedChatId === chat.id}
							<div class="w-2 h-2 bg-primary rounded-full ml-2 flex-shrink-0"></div>
						{/if}
					</div>
				</div>
			{/each}
			
			<!-- Loading indicator for pagination -->
			{#if loading && conversations.length > 0}
				<div class="flex justify-center p-2">
					<Icon icon="lucide:loader-2" class="w-4 h-4 animate-spin text-muted-foreground" />
				</div>
			{/if}
		{/if}
	</div>
</div>