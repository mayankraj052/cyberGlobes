<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import TypingIndicator from '../loader/TypingIndicator.svelte';
	import { MapService } from '$lib/services/map-service';
	import { getDataFromURL } from '$lib/utils/generalUtils';
	import Echo from 'laravel-echo';
	import Pusher from 'pusher-js';
	import { marked } from 'marked';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';


	import { PUBLIC_VITE_PUSHER_APP_KEY, PUBLIC_VITE_PUSHER_APP_CLUSTER, PUBLIC_ECHO_BROADCASTER, PUBLIC_ECHO_PUSHER_HOST, PUBLIC_ECHO_PUSHER_PORT, PUBLIC_ECHO_PUSHER_SCHEME, PUBLIC_ECHO_PUSHER_ENCRYPTED, PUBLIC_ECHO_PUSHER_APP_ID, PUBLIC_API_URL } from '$env/static/public'; 
	import { AUTH_TOKEN, USER_LAT, USER_LNG, MAP_DEFAULT_LOCATION, AGENT_FROM_HOME } from '$lib/constants/constants';
	import { formatCoordinates } from '$lib/utils/locationUtils';
	import { locationUpdate, receivedPoints } from '$lib/stores/mapStore';
	
	// Browser environment check
	const isBrowser = typeof window !== 'undefined';
	
	// Chat messages state
	interface ChatMessage {
		role: 'user' | 'assistant';
		content: string;
		timestamp: Date;
	}
	
	let messages: ChatMessage[] = [];
	let inputMessage = '';
	let chatContainer: HTMLElement;
	let textareaEl: HTMLTextAreaElement;
	let isProcessing = false;
	let isFirstMessage = true;
	let apiResponse = null;
	let echoInstance = null;
	let conversationId = null;
	
	// Initialize MapService
	const mapService = new MapService();
	
	// Auto-resize textarea as content changes
	function resizeTextarea() {
		if (textareaEl) {
			// Reset height to auto to get the correct scrollHeight
			textareaEl.style.height = 'auto';
			// Set height to scrollHeight to fit content
			textareaEl.style.height = textareaEl.scrollHeight + 'px';
		}
	}

	// Watch for input changes to resize textarea
	$: if (inputMessage !== undefined && textareaEl) {
		resizeTextarea();
	}
	
	async function sendMessage() {
		if (!inputMessage.trim() || isProcessing) return;
		
		// Add user message
		const userMessage: ChatMessage = {
			role: 'user',
			content: inputMessage,
			timestamp: new Date()
		};
		
		messages = [...messages, userMessage];
		const userQuery = inputMessage;
		inputMessage = '';
		isProcessing = true;
		
		// Reset textarea height after clearing content
		await tick();
		resizeTextarea();
		
		// Scroll to bottom
		setTimeout(scrollToBottom, 50);
		
		if (isFirstMessage) {
			// Get latitude and longitude from local storage or default values
			const lat = localStorage.getItem(USER_LAT) || MAP_DEFAULT_LOCATION.lat.toString();
			const lng = localStorage.getItem(USER_LNG) || MAP_DEFAULT_LOCATION.lng.toString();
			
			// Prepare payload for API
			const payload = {
				message: userQuery,
				latitude: lat,
				longitude: lng
			};
			
			// Make API call to /insights/initiate
			mapService.getInsights(payload)
				.then(response => {
					// Store the API response but don't remove the typing indicator
					apiResponse = response;
					console.log('API response:', response);
					
					// Set isFirstMessage to false to avoid making the API call again
					isFirstMessage = false;
					
					 // Capture the conversation_id from the response
					if (response && response.success && response.conversation_id) {
						conversationId = response.conversation_id;

						// Check if conversation_id is already in the URL
						const currentUrl = new URL(window.location.href);
						const urlConversationId = currentUrl.searchParams.get('conversation_id');
						
						// If conversation_id is not in URL, append it
						if (!urlConversationId) {
							currentUrl.searchParams.set('conversation_id', conversationId);
							window.history.pushState({}, '', currentUrl.toString());
						}

						// get all query parameters from the URL
						const lat = getDataFromURL('lat');
						const lng = getDataFromURL('long');
						const search = getDataFromURL('search');
						// Initialize Echo and listen for updates on this conversation
						setupEchoListener(conversationId);
					}
				})
				.catch(error => {
					console.error('API call failed:', error);
					// Keep the typing indicator even in case of error, as requested
				});
		} else {
			// This is a subsequent message in the same conversation
			// Call generate/{id} endpoint with the message
			if (conversationId) {

				const lat = localStorage.getItem(USER_LAT) || MAP_DEFAULT_LOCATION.lat.toString();
				const lng = localStorage.getItem(USER_LNG) || MAP_DEFAULT_LOCATION.lng.toString();

				const payload = {
					message: userQuery,
					latitude: lat,
					longitude: lng
				};
				
				// Make API call to /insights/generate/{id}
				mapService.getPromptInsights(payload, conversationId)
					.then(response => {
						console.log('Generate response:', response);
						// The response will be handled by the Echo listener,
						// so we keep the typing indicator active
					})
					.catch(error => {
						console.error('Generate API call failed:', error);
						// Keep typing indicator in case of error
					});
			} else {
				console.error('No conversation ID available for subsequent message');
				isProcessing = false;
				setTimeout(scrollToBottom, 50);
			}
		}
	}
	
	function setupEchoListener(id) {
		 // Only run in browser environment
		if (!isBrowser) {
			return;
		}
		
		// Clean up any existing listener
		cleanupEchoListener();

		// Initialize new Echo instance if needed
		if (!echoInstance) {
			let authToken = localStorage.getItem(AUTH_TOKEN) || false;
			window.Pusher = Pusher;
			echoInstance = new Echo({
				broadcaster: PUBLIC_ECHO_BROADCASTER, // Use environment variable instead of hardcoded value
				key: PUBLIC_VITE_PUSHER_APP_KEY,
				cluster: PUBLIC_VITE_PUSHER_APP_CLUSTER,
				auth: {
					headers: {
						Authorization: `Bearer ${authToken}`,
						'Accept': 'application/json'
					},
					withCredentials: true
				},
				authEndpoint: PUBLIC_API_URL+'/broadcasting/auth',
				encrypted: PUBLIC_ECHO_PUSHER_ENCRYPTED === 'true',
				disableStats: true,
				wsHost: PUBLIC_ECHO_PUSHER_HOST,
				wsPort: PUBLIC_ECHO_PUSHER_PORT,
				wssPort: PUBLIC_ECHO_PUSHER_PORT,
				forceTLS: PUBLIC_ECHO_PUSHER_SCHEME === 'https',
				enabledTransports: ['ws', 'wss']
			});

		}
		
		// Listen for updates on this conversation channel
		echoInstance.private(`App.Models.Conversation.${id}`)
			.listen('.App\\Events\\LocationReceived', (event) => {
				console.log('LocationReceived event:', event);
				// Extract lat/lng from the response and save to local storage
				if (event && event.attributes) {
					try {
						// Parse the attributes JSON string
						const attributes = typeof event.attributes === 'string' 
							? JSON.parse(event.attributes) 
							: event.attributes;
						
						if (attributes.latitude !== undefined && attributes.longitude !== undefined) {
							localStorage.setItem(USER_LAT, attributes.latitude.toString());
							localStorage.setItem(USER_LNG, attributes.longitude.toString());
							
							// Trigger map update: reset map, fly to location, and show marker
							locationUpdate.set({
								latitude: parseFloat(attributes.latitude),
								longitude: parseFloat(attributes.longitude)
							});

							console.log('Location updated:', {
								latitude: parseFloat(attributes.latitude),
								longitude: parseFloat(attributes.longitude)
							});
						}
					} catch (error) {
						console.error('Error parsing location attributes:', error);
					}
				}
			})
			.listen('.App\\Events\\PointReceived', (event) => {
				console.log('PointReceived event:', event);
				// Handle received points from the PointReceived event
				if (event && event.point) {
					try {
						// Extract point data from the event structure
						const pointData = event.point;
						const metadata = pointData.metadata || {};
						const location = metadata.location || {};
						
						// Create a normalized point object for our application
						const normalizedPoint = {
							id: metadata.placeId || `point_${Date.now()}`,
							title: metadata.title || 'Unknown Place',
							description: pointData.pageContent || metadata.categoryName || '',
							latitude: location.lat,
							longitude: location.lng,
							address: metadata.address || '',
							type: metadata.categoryName || 'Point of Interest',
							price: metadata.price || null,
							phone: metadata.phone || null,
							website: metadata.url || metadata.website || null,
							url: metadata.url || metadata.website || null,
							imageUrl: metadata.imageUrl || null,
							neighborhood: metadata.neighborhood || null,
							city: metadata.city || '',
							postalCode: metadata.postalCode || '',
							countryCode: metadata.countryCode || '',
							reviewsCount: metadata.reviewsCount || null,
							openingHours: metadata.openingHours || [],
							additionalInfo: metadata.additionalInfo || {},
							conversationId: event.conversation_id,
							metadata: metadata
						};
						
						// Only add if we have valid coordinates
						if (normalizedPoint.latitude && normalizedPoint.longitude) {
							// Update the receivedPoints store
							receivedPoints.update(currentPoints => {
								return [...currentPoints, normalizedPoint];
							});
							
							console.log('Point processed and added:', normalizedPoint);
						} else {
							console.warn('Point received but missing coordinates:', event);
						}
					} catch (error) {
						console.error('Error processing received point:', error);
					}
				}
			})
			.listen('.App\\Events\\MessageReceived', (event) => {
				console.log('MessageReceived event:', event);
				// Process the received event data
				if (event && event.message && event.message.content) {
					// Add the assistant response to messages
					const assistantMessage = {
						role: 'assistant',
						content: event.message.content,
						timestamp: new Date()
					};
					
					messages = [...messages, assistantMessage];
					
					// Disable the processing indicator
					isProcessing = false;
					
					// Scroll to bottom after message is added
					setTimeout(scrollToBottom, 50);
				} else {
					// If no valid message content, still disable the loader
					isProcessing = false;
				}
			});
	}

	function loadConversations(conversationId) {
		mapService.getInsightsHistory(conversationId).then(data => {
			// Process the retrieved data
			if (data && data.success) {
				// Update messages with the conversation history
				messages = data.data.messages.map(msg => ({
					role: msg.role,
					content: msg.content,
					timestamp: new Date(msg.created_at)
				}));
				
				// Scroll to bottom after loading messages
				setTimeout(scrollToBottom, 50);
			} else {
				console.error('Failed to load conversation history:', data);
			}
		}).catch(error => {
			console.error('Error loading conversations:', error);
		});
	}
	
	function cleanupEchoListener() {
		 // Only run in browser environment
		if (!isBrowser) {
			return;
		}
		
		// Clean up Echo listener when component unmounts or conversation changes
		if (echoInstance && conversationId) {
			echoInstance.leave(`conversation.${conversationId}`);
			console.log(`Stopped listening on conversation.${conversationId}`);
		}
	}
	
	function scrollToBottom() {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}
	
	function handleKeydown(event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	// Get query parameter from URL function
	function getQueryParam() {
		if (!isBrowser) return null;
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get('query');
	}

	async function processQueryParamOnMount() {
        const queryParam = getQueryParam();
        if (queryParam && queryParam.trim() !== '') {
			// remove the query parameter from the URL
			const url = new URL(window.location.href);
			url.searchParams.delete('query');
			window.history.replaceState({}, document.title, url.toString());

            // Set the textarea value
            inputMessage = queryParam;
            
            // Wait for the next tick to ensure the DOM is updated
            await tick();
            
            // Resize textarea to fit content
            resizeTextarea();
            
            // Auto-submit after a short delay to ensure everything is rendered
            setTimeout(() => {
                sendMessage();
            }, 500);
        }
    }
	
	onMount(async () => {
		// Resize textarea initially
		resizeTextarea();

		// Check if conversation_id exists in URL and load conversation history
		if (isBrowser) {
			const urlParams = new URLSearchParams(window.location.search);
			const urlConversationId = urlParams.get('conversation_id');
			
			if (urlConversationId) {
				conversationId = urlConversationId;
				isFirstMessage = false; // Since we're loading an existing conversation
				
				// Load the conversation history
				loadConversations(conversationId);
				
				// check if conversation is from home page
				const isFromHome = localStorage.getItem(AGENT_FROM_HOME);
				localStorage.removeItem(AGENT_FROM_HOME);
				if (isFromHome) {
					isProcessing = true; // Keep processing indicator active
				}

				// Setup Echo listener for this conversation
				setupEchoListener(conversationId);
			}
		}

		// Process URL query parameter if present
        await processQueryParamOnMount();
	});
	
	onDestroy(() => {
		// Clean up Echo listener when component unmounts
		cleanupEchoListener();
		
		// Clear received points when component unmounts
		receivedPoints.set([]);
	});

	function handleNewChat() {
		if (confirm('Starting a new chat will clear the current conversation.')) {
			window.location.href = window.location.href.split('?')[0];
		}
	}


</script>

<div class="chatbot-wrapper h-full flex flex-col bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
	<div class="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
		<h2 class="text-lg font-bold">Assistant</h2>
		{#if conversationId}
			<button
				class="px-3 py-1 rounded flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm font-medium shadow-sm border border-gray-300 dark:border-gray-600 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition"
				on:click={() => {
					handleNewChat();
				}}
				type="button"
			>
				<Icon icon="line-md:chat-round" class="h-4 w-4" />
				New Chat
			</button>
		{/if}

	</div>
	
	<div 
		class="flex-grow overflow-y-auto p-4"
		bind:this={chatContainer}
	>
		{#each messages as message}
			<div class="mb-4 flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
				<div 
					class="max-w-[80%] p-3 rounded-lg {
						message.role === 'user' 
							? 'bg-blue-500 text-white rounded-tr-none' 
							: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none'
					}"
				>
					{#if message.role === 'assistant'}
						<div class="markdown-content">{@html marked(message.content)}</div>
					{:else}
						<p>{message.content}</p>
					{/if}
					<div class="text-xs mt-1 text-right opacity-70">
						{message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
					</div>
				</div>
			</div>
		{/each}
		
		{#if isProcessing}
			<TypingIndicator />
		{/if}
	</div>
	
	<div class="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
		<div class="flex items-end gap-2">
			<div class="flex-grow relative">
				<textarea
					bind:this={textareaEl}
					rows="1"
					class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white min-h-[42px] max-h-[200px] overflow-y-auto"
					placeholder="Ask something..."
					bind:value={inputMessage}
					on:input={resizeTextarea}
					on:keydown={handleKeydown}
				></textarea>
			</div>
			<button 
				class="bg-blue-500 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center disabled:opacity-50"
				on:click={sendMessage}
				disabled={!inputMessage.trim() || isProcessing}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
					<path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
				</svg>
			</button>
		</div>
	</div>
</div>

<style>
	.markdown-content :global(ul) {
		list-style-type: disc;
		padding-left: 1.5em;
		margin: 0.5em 0;
	}
	
	.markdown-content :global(ol) {
		list-style-type: decimal;
		padding-left: 1.5em;
		margin: 0.5em 0;
	}
	
	.markdown-content :global(h1),
	.markdown-content :global(h2),
	.markdown-content :global(h3),
	.markdown-content :global(h4),
	.markdown-content :global(h5),
	.markdown-content :global(h6) {
		margin: 0.5em 0;
		font-weight: bold;
	}
	
	.markdown-content :global(p) {
		margin: 0.5em 0;
	}
	
	.markdown-content :global(a) {
		color: #3b82f6;
		text-decoration: underline;
	}
	
	.markdown-content :global(code) {
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 3px;
		padding: 0.2em 0.4em;
		font-family: monospace;
	}
	
	.markdown-content :global(pre) {
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 3px;
		padding: 1em;
		margin: 0.5em 0;
		overflow-x: auto;
	}
	
	.markdown-content :global(blockquote) {
		border-left: 4px solid #e2e8f0;
		padding-left: 1em;
		margin: 0.5em 0;
		color: #4b5563;
	}
	
	.markdown-content :global(hr) {
		border: 0;
		border-top: 1px solid #e2e8f0;
		margin: 1em 0;
	}
</style>

