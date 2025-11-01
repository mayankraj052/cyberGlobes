<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import MessageItem from './MessageItem.svelte';
	import ProcessingMessage from './ProcessingMessage.svelte';
	import Icon from '@iconify/svelte';
	import { MapService } from '$lib/services/map-service.js';
	import Echo from 'laravel-echo';
	import Pusher from 'pusher-js';
	import {
		AUTH_TOKEN,
		USER_LAT,
		USER_LNG,
		MAP_DEFAULT_LOCATION
	} from '$lib/constants/constants.js';
	import {
		PUBLIC_VITE_PUSHER_APP_KEY,
		PUBLIC_VITE_PUSHER_APP_CLUSTER,
		PUBLIC_ECHO_BROADCASTER,
		PUBLIC_ECHO_PUSHER_HOST,
		PUBLIC_ECHO_PUSHER_PORT,
		PUBLIC_ECHO_PUSHER_SCHEME,
		PUBLIC_ECHO_PUSHER_ENCRYPTED,
		PUBLIC_API_URL
	} from '$env/static/public';
	import { putDataInURL } from '$lib/utils/generalUtils';
	import { browser } from '$app/environment';

	export let toggleSidebar: () => void;
	export let sidebarVisible: boolean;
	export let isMobile: boolean;
	export let messages: Array<{
		id: string;
		role: 'user' | 'assistant';
		content: string;
		timestamp: Date;
		isVoiceInput: boolean;
	}> = [];
	export let onNewMessage: (message: {
		id: string;
		role: 'user' | 'assistant';
		content: string;
		timestamp: Date;
		isVoiceInput: boolean;
	}) => void;
	export let conversationResults: Array<any> = [];
	export let selectedChatId: string = '';
	export let onConversationInitiated: ((conversationId: string) => void) | undefined = undefined;

	// Service instances
	const mapService = new MapService();

	// Conversation and real-time variables
	let conversationId: string | null = null;
	let echoInstance: Echo | null = null;

	let messageInput = '';
	let messagesContainer: HTMLElement;
	let textareaEl: HTMLTextAreaElement;
	let isProcessing = false;
	let currentProcessingStep = '';
	let hasUserSentMessage = false;
	let uploadedFile: File | null = null;
	let fileInputEl: HTMLInputElement;
	let completedSteps: string[] = [];

	
	$: isChatDisabled = isProcessing || messages.length > 0;
	

	// Helper function to check if step data is available in conversation results
	function hasStepData(results: Array<any> = []): boolean {
		console.log('Checking step data for results:', results);
		if (!results || results.length === 0) {
			console.log('No results available');
			return false;
		}

		// Check for various indicators of step data
		const hasData = results.some(
			(result) =>
				result.json_data ||
				result.step_name ||
				result.step_title ||
				result.step_type ||
				(result.status && result.status !== 'pending')
		);
		console.log('Has step data:', hasData);
		console.log('Sample result for debugging:', results[0]);
		return hasData;
	}

	// Helper function to generate visualization link
	function generateVisualizationLink(convId: string): string {
		return `/visualization?conversation_id=${convId}`;
	}

	// Setup Echo listener for real-time updates
	function setupEchoListener(id: string) {
		// Only run in browser environment
		if (!browser) {
			return;
		}

		// Clean up any existing listener
		cleanupEchoListener();

		// Initialize new Echo instance if needed
		if (!echoInstance) {
			let authToken = localStorage.getItem(AUTH_TOKEN) || false;
			window.Pusher = Pusher;
			echoInstance = new Echo({
				broadcaster: PUBLIC_ECHO_BROADCASTER,
				key: PUBLIC_VITE_PUSHER_APP_KEY,
				cluster: PUBLIC_VITE_PUSHER_APP_CLUSTER,
				auth: {
					headers: {
						Authorization: `Bearer ${authToken}`,
						Accept: 'application/json'
					},
					withCredentials: true
				},
				authEndpoint: PUBLIC_API_URL + '/broadcasting/auth',
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
		echoInstance
			.private(`App.Models.Conversation.${id}`)
			.listen('.App\\Events\\TodoReceived', (event) => {
				console.log('TodoReceived event:', event);
				// Handle todo list received
				if (event && event.todos) {
					// Map the received todos to the expected format
					conversationResults = event.todos.map((todo: any) => ({
						id: todo.id,
						step_name: todo.id,
						step_title: todo.title,
						step_type: todo.type,
						status: todo.status,
						created_at: todo.created_at,
						updated_at: todo.updated_at
					}));
					console.log('Updated conversation results with todos:', conversationResults);

					// Process steps will be automatically regenerated via reactive statement
					// This will show the list of todos that need to be executed
				}
			})
			.listen('.App\\Events\\TodoStarted', (event) => {
				console.log('TodoStarted event:', event);
				// Handle todo started
				if (event && event.todo) {
					// Find and update the specific todo in conversationResults
					const todoIndex = conversationResults.findIndex(
						(result: any) => result.id === event.todo.id
					);
					if (todoIndex !== -1) {
						conversationResults[todoIndex] = {
							...conversationResults[todoIndex],
							status: 'inprogress',
							updated_at: event.todo.updated_at || new Date().toISOString()
						};
						// Trigger reactivity
						conversationResults = [...conversationResults];
						console.log(`Todo ${event.todo.id} marked as in progress`);
					}
				}
			})
			.listen('.App\\Events\\TodoFinished', (event) => {
				console.log('TodoFinished event:', event);
				// Handle todo finished
				if (event && event.todo) {
					// Find and update the specific todo in conversationResults
					const todoIndex = conversationResults.findIndex(
						(result: any) => result.id === event.todo.id
					);
					if (todoIndex !== -1) {
						conversationResults[todoIndex] = {
							...conversationResults[todoIndex],
							status: event.todo.status || 'completed',
							error_details: event.todo.error_details,
							json_data: event.todo.json_data,
							updated_at: event.todo.updated_at || new Date().toISOString()
						};
						// Trigger reactivity
						conversationResults = [...conversationResults];
						console.log(
							`Todo ${event.todo.id} finished with status: ${event.todo.status || 'completed'}`
						);
					}
				}
			})
			.listen('.App\\Events\\FinalizingConversation', (event) => {
				console.log('FinalizingConversation event:', event);
				// Handle finalization step
				if (event && event.result) {
					// Add the finalization step to conversationResults
					const finalizationStep = {
						id: event.result.id,
						step_name: event.result.id,
						step_title: event.result.title,
						step_type: event.result.type,
						status: event.result.status,
						error_details: event.result.error_details,
						json_data: event.result.json_data,
						created_at: event.result.created_at,
						updated_at: event.result.updated_at || new Date().toISOString()
					};

					// Add to conversationResults
					conversationResults = [...conversationResults, finalizationStep];
					console.log('Added finalization step to conversation results');
				}
			})
			.listen('.App\\Events\\MessageReceived', (event) => {
				console.log('MessageReceived event:', event);
				// Handle completed message/response
				if (event && event.message) {
					// Update the final_response step if result data is provided
					if (event.result) {
						// Find and update the final_response step in conversationResults
						const resultIndex = conversationResults.findIndex(
							(result: any) => result.id === event.result.id
						);
						if (resultIndex !== -1) {
							conversationResults[resultIndex] = {
								...conversationResults[resultIndex],
								step_name: event.result.id,
								step_title: event.result.title,
								step_type: event.result.type,
								status: event.result.status || 'completed',
								error_details: event.result.error_details,
								json_data: event.result.json_data,
								updated_at: event.result.updated_at || new Date().toISOString()
							};
							// Trigger reactivity
							conversationResults = [...conversationResults];
							console.log(
								`Updated final_response step ${event.result.id} with status: ${
									event.result.status || 'completed'
								}`
							);
						} else {
							// If step doesn't exist, add it as a new step
							const finalResponseStep = {
								id: event.result.id,
								step_name: event.result.id,
								step_title: event.result.title,
								step_type: event.result.type,
								status: event.result.status || 'completed',
								error_details: event.result.error_details,
								json_data: event.result.json_data,
								created_at: event.result.created_at,
								updated_at: event.result.updated_at || new Date().toISOString()
							};
							conversationResults = [...conversationResults, finalResponseStep];
							console.log('Added final_response step to conversation results');
						}
					}

					// Stop processing state
					isProcessing = false;

					let messageContent = event.message.content || event.message;
					// Add the assistant's response
					const assistantMessage = {
						id: `assistant-${Date.now()}`,
						role: 'assistant' as const,
						content: messageContent,
						timestamp: new Date(),
						isVoiceInput: false
					};
					onNewMessage(assistantMessage);
					// Clear processing step
					currentProcessingStep = '';
				}
			});
	}

	// Cleanup function for Echo
	function cleanupEchoListener() {
		if (echoInstance && conversationId) {
			echoInstance.leave(`App.Models.Conversation.${conversationId}`);
		}
	}

	// Generate dynamic process steps based on conversation results
	$: processSteps = generateProcessSteps(conversationResults);
	// Display results when conversation data is loaded from URL
	$: if (conversationResults && conversationResults.length > 0 && !currentProcessingStep) {
		displayExistingResults();
	}

	// Get appropriate icon for different step types
	function getStepIcon(stepType: string): string {
		const iconMap: Record<string, string> = {
			analysis: 'lucide:brain',
			planning: 'lucide:list-checks',
			ai: 'lucide:cpu',
			service: 'lucide:search',
			scripter: 'lucide:cog',
			'ai-image': 'lucide:image',
			default: 'lucide:play-circle'
		};
		return iconMap[stepType] || iconMap['default'];
	}

	function generateProcessSteps(results: Array<any>) {
		const steps = [];
		// First step is always constant when results exist
		if (results && results.length > 0) {
			steps.push({
				title: 'Understanding the user input...',
				description: 'Analyzing your query and requirements to determine the best approach.',
				status: 'completed',
				icon: 'lucide:brain',
				stepType: 'analysis'
			});
			// Second step shows number of todos
			steps.push({
				title: `Creating ${results.length} Todos`,
				description:
					'Breaking down the task into manageable steps for data collection and analysis.',
				status: 'completed',
				icon: 'lucide:list-checks',
				stepType: 'planning'
			});
			// Add each result as a step
			results.forEach((result, index) => {
				const stepType = result.step_type?.toLowerCase() || 'default';
				steps.push({
					title: `${result.step_name?.toUpperCase()}: ${result.step_title}`,
					description: result.step_type,
					status: result.status,
					error_details: result.error_details,
					json_data: result.json_data,
					icon: getStepIcon(stepType),
					stepType: stepType
				});
			});
		} else {
			// Default steps when no results
			steps.push(
				{
					title: 'Understanding the user input...',
					description: 'Analyzing your query and requirements to determine the best approach.',
					status: 'inprogress',
					icon: 'lucide:brain',
					stepType: 'analysis'
				},
				{
					title: 'Creating Todos',
					description:
						'Breaking down the task into manageable steps for data collection and analysis.',
					status: 'todo',
					icon: 'lucide:list-checks',
					stepType: 'planning'
				}
			);
		}

		return steps;
	}

	function formatStepWithStatus(step: any): string {
		let formattedTitle = `**${step.title}**`;
		let description = step.description;
		// Add error details for failed steps
		if (step.status === 'failed' && step.error_details) {
			description += `\n\n**Error:** ${step.error_details}`;
		}

		// Note: Per user requirements, completed steps should not show download links
		// if (step.status === 'completed' && step.json_data) {
		//     description += `\n\n[View Results](${step.json_data})`;
		// }

		return `${formattedTitle}\n${description}`;
	}

	function displayExistingResults() {
		console.log('Displaying existing results:', conversationResults);
		// Display all steps immediately for loaded conversations
		completedSteps = processSteps.map((step) => formatStepWithStatus(step));
		currentProcessingStep = completedSteps.join('\n\n');

		// Check if we should append visualization link
		const shouldAddVisualizationLink =
			hasStepData(conversationResults) ||
			(conversationResults && conversationResults.length > 0) ||
			currentProcessingStep.includes('View Step Data');

		console.log('Should add visualization link:', shouldAddVisualizationLink);
		if (shouldAddVisualizationLink) {
			// Try to get conversation ID from multiple sources
			let convId = conversationId || selectedChatId;
			// If still no ID, try to extract from conversationResults
			if (!convId || String(convId).startsWith('new-')) {
				// Try to get conversation_id from the first result that has it
				const resultWithId = conversationResults.find((result) => result.conversation_id);
				if (resultWithId) {
					convId = resultWithId.conversation_id.toString();
				}
			}

			// Extract conversation ID from URL as fallback
			if (!convId || String(convId).startsWith('new-')) {
				const urlParams = new URLSearchParams(window.location.search);
				const urlConvId = urlParams.get('conversation_id');
				if (urlConvId) {
					convId = urlConvId;
				}
			}

			console.log('Conversation ID for visualization link:', convId);
			// Convert to string and check if valid
			const convIdStr = String(convId);
		}

		isProcessing = false;
		// Set to false since these are already completed results
		console.log('Current processing step set to:', currentProcessingStep);
	}

	function autoResize() {
		if (textareaEl) {
			textareaEl.style.height = 'auto';
			textareaEl.style.height = Math.min(textareaEl.scrollHeight, 120) + 'px';
		}
	}

	function handleFileUpload() {
		fileInputEl?.click();
	}

	function onFileSelected(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			uploadedFile = file;
		}
	}

	function removeFile() {
		uploadedFile = null;
		if (fileInputEl) {
			fileInputEl.value = '';
		}
	}

	async function sendMessage() {
		console.log('sendMessage called');
		console.log('messageInput:', messageInput);
		console.log('uploadedFile:', uploadedFile);
		console.log('isProcessing:', isProcessing);
		console.log('selectedChatId:', selectedChatId);

		// --- MODIFIED CHECK ---
		// Check against the new isChatDisabled variable
		if ((!messageInput.trim() && !uploadedFile) || isChatDisabled) {
			console.log('Returning early - invalid input or already processing/disabled');
			return;
		}
		// --- END MODIFIED CHECK ---

		const userQuery = messageInput.trim();
		const userMessage = {
			id: Date.now().toString(),
			role: 'user' as const,
			content: uploadedFile
				? `📎 **File uploaded:** ${uploadedFile.name}\n\n${userQuery || 'Please analyze this file.'}`
				: userQuery,
			timestamp: new Date(),
			isVoiceInput: false
		};

		onNewMessage(userMessage);
		messageInput = '';
		uploadedFile = null;
		if (fileInputEl) {
			fileInputEl.value = '';
		}
		isProcessing = true; // This will trigger isChatDisabled to become true
		completedSteps = [];

		// Reset textarea height
		if (textareaEl) {
			textareaEl.style.height = 'auto';
		}

		// Check if we have auth token
		const authToken = localStorage.getItem(AUTH_TOKEN);
		console.log('Auth token available:', !!authToken);
		// Always use initiate API for all messages
		try {
			// Get user location from localStorage or use defaults
			const lat = localStorage.getItem(USER_LAT) || MAP_DEFAULT_LOCATION.lat.toString();
			const lng = localStorage.getItem(USER_LNG) || MAP_DEFAULT_LOCATION.lng.toString();

			// Prepare payload for initiate API
			const payload = {
				message: userQuery,
				latitude: parseFloat(lat),
				longitude: parseFloat(lng)
			};
			console.log('Making initiate API call with payload:', payload);

			// Make API call to insights/initiate
			const response = await mapService.getInsights(payload);
			console.log('Initiate API response:', response);

			if (response && response.success && response.conversation_id) {
				conversationId = response.conversation_id;
				// Update URL with the real conversation ID
				putDataInURL('conversation_id', conversationId);

				// Set up real-time listener for this conversation
				setupEchoListener(conversationId);
				// Notify parent component that conversation was initiated
				if (onConversationInitiated) {
					onConversationInitiated(conversationId);
				}

				console.log('Conversation initiated successfully:', conversationId);
			} else {
				console.error('Failed to initiate conversation:', response);
				throw new Error(response?.message || 'Failed to initiate conversation');
			}
		} catch (error) {
			console.error('Error calling initiate API:', error);
			isProcessing = false;
			// Show error message to user
			const errorMessage = {
				id: `error-${Date.now()}`,
				role: 'assistant' as const,
				content: `❌ **Error starting conversation**\n\nSorry, I encountered an error while processing your request. Please try again.`,
				timestamp: new Date(),
				isVoiceInput: false
			};
			onNewMessage(errorMessage);
			return;
		}

		// Show initial processing steps
		currentProcessingStep =
			"🤖 **Processing your request...**\n\nI'm analyzing your query and preparing the response. This may take a moment.";
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	// Scroll to bottom when new messages are added
	afterUpdate(() => {
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	});
	onMount(() => {
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}

		// If we have an existing conversation ID and it's not a new chat, set up listener
		if (selectedChatId && !selectedChatId.startsWith('new-')) {
			conversationId = selectedChatId;
			setupEchoListener(conversationId);
		}

		// Cleanup on component destroy
		return () => {
			cleanupEchoListener();
		};
	});
</script>

<div class="h-full flex flex-col">
	<div bind:this={messagesContainer} class="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
		{#if messages.length === 0}
			<div class="flex items-center justify-center h-full">
				<div class="text-center max-w-md">
					<div
						class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
					>
						<Icon icon="lucide:bot" class="w-8 h-8 text-primary" />
					</div>
					<h2 class="text-xl font-semibold text-foreground mb-2">Cyberglobes AI Assistant</h2>
					<p class="text-muted-foreground mb-6">
						Ask me anything about geospatial data, mapping, and location-based insights. I'm here to
						help!
					</p>
					<div class="text-sm text-muted-foreground">
						<p>Try asking about:</p>
						<ul class="mt-2 space-y-1">
							<li>• Location analysis and mapping</li>
							<li>• Geographic data visualization</li>
							<li>• Spatial patterns and trends</li>
						</ul>
					</div>
				</div>
			</div>
		{:else}
			{#each messages as message (message.id)}
				{#if message.role === 'user'}
					<MessageItem {message} />
				{/if}
			{/each}

			{#if currentProcessingStep}
				<ProcessingMessage
					content={currentProcessingStep}
					steps={processSteps}
					isComplete={!isProcessing}
				/>
			{/if}

			{#each messages as message (message.id)}
				{#if message.role === 'assistant'}
					<MessageItem {message} />
				{/if}
			{/each}
		{/if}
	</div>

	<div
		class="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2"
	>
		{#if uploadedFile}
			<div
				class="mb-4 p-3 bg-muted/50 rounded-lg border border-border/50 flex items-center justify-between"
			>
				<div class="flex items-center gap-2">
					<Icon icon="lucide:paperclip" class="w-4 h-4 text-muted-foreground" />
					<span class="text-sm font-medium">{uploadedFile.name}</span>
					<span class="text-xs text-muted-foreground">
						({Math.round(uploadedFile.size / 1024)} KB)
					</span>
				</div>
				<Button
					variant="ghost"
					size="sm"
					type="button"
					on:click={removeFile}
					class="p-1 h-auto text-muted-foreground hover:text-foreground"
				>
					<Icon icon="lucide:x" class="w-3 h-3" />
				</Button>
			</div>
		{/if}

		<form on:submit|preventDefault={sendMessage} class="relative">
			<input
				bind:this={fileInputEl}
				type="file"
				on:change={onFileSelected}
				accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.json,.xml"
				class="hidden"
			/>

			<div
				class="flex items-end gap-3 bg-muted/30 rounded-md p-2 border border-border/50 focus-within:border-primary/50 transition-colors"
			>
				<div
					class="flex-1 pt-1"
					class:opacity-50={isChatDisabled}
					class:cursor-not-allowed={isChatDisabled}
				>
					<textarea
						bind:this={textareaEl}
						bind:value={messageInput}
						on:input={autoResize}
						on:keydown={handleKeydown}
						placeholder={isChatDisabled
							? 'This chat is complete. Start a new chat to ask more questions.'
							: "Ask me about locations, maps, demographics, or data analysis... e.g., 'Show me restaurants in New York' or 'Analyze population trends'"}
						class="w-full bg-transparent border-0 outline-none resize-none h-full max-h-[300px] placeholder:text-muted-foreground text-sm leading-6"
						rows="3"
						disabled={isChatDisabled}
					></textarea>
				</div>

				<div class="flex flex-col items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						type="button"
						on:click={handleFileUpload}
						disabled={isChatDisabled}
						class="p-2 text-muted-foreground hover:text-foreground rounded-xl"
						title="Upload file"
					>
						<Icon icon="lucide:paperclip" class="w-4 h-4" />
					</Button>

					<Button
						variant="default"
						size="sm"
						type="submit"
						disabled={(!messageInput.trim() && !uploadedFile) || isChatDisabled}
						class="p-2 rounded-xl min-w-[36px] min-h-[36px]"
					>
						<Icon
							icon={isProcessing ? 'lucide:loader-2' : 'lucide:send'}
							class={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`}
						/>
					</Button>
				</div>
			</div>
		</form>
	</div>
</div>
