<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import ChatSidebar from './ChatSidebar.svelte';
	import ChatWindow from './ChatWindow.svelte';
	import { chatStore } from '$lib/stores/chatStore';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button';
	import VisualizationPanel from '../visualization/VisualizationPanel.svelte';
	import InstagramStepsSidebar from '../visualization/InstagramStepsSidebar.svelte';
	import { getDataFromURL } from '$lib/utils/generalUtils';
	import { ConversationService } from '$lib/services/conversation-service';
	import Echo from 'laravel-echo';
	import Pusher from 'pusher-js';
	import { AUTH_TOKEN } from '$lib/constants/constants.js';
	import { PUBLIC_VITE_PUSHER_APP_KEY, PUBLIC_VITE_PUSHER_APP_CLUSTER, PUBLIC_ECHO_BROADCASTER, PUBLIC_ECHO_PUSHER_HOST, PUBLIC_ECHO_PUSHER_PORT, PUBLIC_ECHO_PUSHER_SCHEME, PUBLIC_ECHO_PUSHER_ENCRYPTED, PUBLIC_API_URL } from '$env/static/public';
	import { browser } from '$app/environment';

	let sidebarVisible = true;
	let isMobile = false;
	let selectedChatId = '';
	let currentMessages: Array<{id: string, role: 'user' | 'assistant', content: string, timestamp: Date, isVoiceInput: boolean}> = [];
	let conversationResults: Array<any> = [];
	let chatSidebarRef: any;

	// Drag separator variables
	let isDragging = false;
	let chatWindowHeight = 65; // Initial height percentage for chat window (65% top, 35% bottom)
	let separatorRef: HTMLElement;
	let sidebarRef: HTMLElement;

	// Visualization state
	let rightSidebarVisible = true;
	let conversationService = new ConversationService();
	let selectedStep = '';
	let hasVisualizationData = false;
	let lastUserQuery = '';
	let scripterResults: Array<any> = [];
	let selectedViewType = 'datatable';
	let visualizationSidebarRef: any;
	let hasSavedVisualizationsCount = 0; // Track count of saved visualizations from DB

	// Echo/Pusher state for real-time events
	let echoInstance: Echo | null = null;
	let conversationId: string | null = null;
	let isAnalyzing = false;
	let analyzeSessionId: string | null = null;
	let lastAnalyzedStep: string | null = null;

	// Visualization functions
	function toggleRightSidebar() {
		rightSidebarVisible = !rightSidebarVisible;
	}

	// Setup Echo listener for visualization events
	function setupVisualizationEchoListener(id: string) {
		if (!browser) {
			return;
		}

		// Clean up any existing listener
		cleanupVisualizationEchoListener();

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

		// Listen for VisualizationsDetected event
		echoInstance.private(`App.Models.Conversation.${id}`)
			.listen('.App\\Events\\VisualizationsDetected', async (event) => {
				console.log('VisualizationsDetected event received:', event);
			console.log('Event structure:', {
				hasVisualizations: !!event.visualizations,
				visualizationsCount: event.visualizations?.length,
				hasVisualizationIds: !!(event.visualization_ids || event.metadata?.visualization_ids),
				visualizationIds: event.visualization_ids || event.metadata?.visualization_ids,
				sessionId: event.session_id
			});
				if (event && event.visualizations) {
					// Check both event.visualization_ids and event.metadata.visualization_ids
					let visualizationIds = event.visualization_ids || event.metadata?.visualization_ids;
					if (!visualizationIds && event.conversation_id) {
						try {
							console.log('⚠️ Backend did not send visualization_ids, fetching from database...');
							const response = await conversationService.retrieveConversation(event.conversation_id.toString());
							if (response?.success && response.data?.visualizations) {
								// Get the IDs of visualizations that match the types from the event
								const eventTypes = event.visualizations.filter((v: any) => v.applicable).map((v: any) => v.type);
								visualizationIds = response.data.visualizations
									.filter((v: any) => eventTypes.includes(v.type))
									.map((v: any) => v.id);
								console.log('✅ Fetched visualization IDs from database:', visualizationIds);
							}
						} catch (error) {
							console.error('❌ Failed to fetch visualization IDs from database:', error);
						}
					}

					// Pass auto-generated visualizations to visualization sidebar
					if (visualizationSidebarRef && visualizationSidebarRef.handleAutoVisualizations) {
						visualizationSidebarRef.handleAutoVisualizations(
							event.visualizations,
							event.session_id,
							visualizationIds // Pass visualization IDs (from event or fetched from DB)
						);
					}
				}
			});
	}

	// Cleanup function for visualization Echo
	function cleanupVisualizationEchoListener() {
		if (echoInstance && conversationId) {
			echoInstance.leave(`App.Models.Conversation.${conversationId}`);
		}
	}

	function handleStepSelect(stepId: string) {
		selectedStep = stepId;
		
		// Find the selected step data
		const selectedStepData = conversationResults.find(result =>
			(result.id || `step-${conversationResults.indexOf(result)}`) === stepId
		);

		// Set visualization data availability based on step data
		hasVisualizationData = !!selectedStepData;
		
		// Update last user query based on step data
		if (selectedStepData) {
			lastUserQuery = selectedStepData.query || selectedStepData.message || selectedStepData.content || lastUserQuery;
		}
		
		console.log('Step selected:', {
			stepId,
			stepData: selectedStepData,
			hasData: hasVisualizationData
		});
	}

	function handleScripterResults(results: any[], viewType: string, cardId: string) {
		scripterResults = results;
		// Show visualization data when we have scripter results
		hasVisualizationData = results.length > 0;
		// Store the selected view type directly from sidebar
		selectedViewType = viewType;
		console.log('Received scripter results from card:', cardId);
		console.log('Results:', results);
		console.log('Selected view type:', viewType);
	}

	async function loadVisualizationData(conversationId: string) {
		try {
			console.log('Loading visualization data for ID:', conversationId);
			const response = await conversationService.retrieveConversation(conversationId);

			if (response && response.success) {
				const data = response.data;

				// CRITICAL: Set the count BEFORE setting conversationResults
				// This ensures the prop is available when reactive statements fire
				if (data?.visualizations && data.visualizations.length > 0) {
					hasSavedVisualizationsCount = data.visualizations.length;
					console.log('🔐 Set hasSavedVisualizationsCount to:', hasSavedVisualizationsCount);

					// Also set the flag for backward compatibility
					if (visualizationSidebarRef?.setSavedVisualizationsFlag) {
						visualizationSidebarRef.setSavedVisualizationsFlag(true);
					}
				} else {
					hasSavedVisualizationsCount = 0;
				}

				conversationResults = data?.results || response.results || [];
				hasVisualizationData = conversationResults.length > 0;

				// Set user query from conversation if available
				if (data && data.user_query) {
					lastUserQuery = data.user_query;
				}

				// Load saved visualizations from database BEFORE setting selectedStep
				// This ensures handleAutoVisualizations() is called before reactive statement triggers
				if (data?.visualizations && data.visualizations.length > 0) {
					loadSavedVisualizations(data.visualizations);
				}

				// Auto-select first step AFTER loading visualizations
				// This prevents reactive statement from triggering analyze-step when we have saved visualizations
				if (conversationResults.length > 0 && !selectedStep) {
					selectedStep = conversationResults[0].id || 'step-0';
				}

				console.log('Visualization data loaded:', {
					results: conversationResults.length,
					selectedStep: selectedStep,
					savedVisualizations: data?.visualizations?.length || 0
				});
			}
		} catch (err) {
			console.error('Error loading visualization data:', err);
		}
	}

	// Helper function to load saved visualizations into sidebar
	function loadSavedVisualizations(visualizations: any[]) {
		if (!visualizationSidebarRef || !visualizations.length) return;

		// Pass full visualization objects from DB (including status, results, etc.)
		// Filter out failed visualizations but keep all other statuses (completed, processing, pending)
		const applicableVisualizations = visualizations
			.filter(viz => viz.status !== 'failed')
			.map(viz => ({
				// Keep all original fields from DB
				...viz,
				// Ensure required fields for card rendering
				applicable: true,
				priority: viz.priority || 0
			}));

		// Load saved visualizations into sidebar (no need for separate visualizationIds array)
		if (applicableVisualizations.length > 0 && visualizationSidebarRef.handleAutoVisualizations) {
			visualizationSidebarRef.handleAutoVisualizations(
				applicableVisualizations,
				'saved-from-db' // Special session ID to indicate these are loaded from DB
				// No visualizationIds parameter needed - IDs are in the viz objects themselves
			);
		}

		console.log(`Loaded ${applicableVisualizations.length} saved visualizations from database`, {
			vizStatusCompleted: applicableVisualizations.filter(v => v.status === 'completed').length,
			vizStatusProcessing: applicableVisualizations.filter(v => v.status === 'processing').length,
			vizStatusPending: applicableVisualizations.filter(v => v.status === 'pending').length,
			scripterJobCompleted: applicableVisualizations.filter(v => v.scripter_job?.status === 'completed').length,
			hasResults: applicableVisualizations.filter(v => v.results?.processed_data).length,
			fullyCompleted: applicableVisualizations.filter(v => v.scripter_job?.status === 'completed' && v.results?.processed_data).length
		});
	}

	// Mock conversation data
	const mockConversations: {[key: string]: Array<{id: string, role: 'user' | 'assistant', content: string, timestamp: Date, isVoiceInput: boolean}>} = {
		'1': [
			{
				id: '1-1',
				role: 'user',
				content: 'Can you help me find restaurants near Times Square?',
				timestamp: new Date('2024-01-15T14:31:00'),
				isVoiceInput: false
			},
			{
				id: '1-2',
				role: 'assistant',
				content: 'Absolutely! I can help you find restaurants near Times Square. There are many great options in that area.',
				timestamp: new Date('2024-01-15T14:31:30'),
				isVoiceInput: false
			}
		],
		'2': [
			{
				id: '2-1',
				role: 'user',
				content: 'What are the property values in Manhattan?',
				timestamp: new Date('2024-01-15T10:15:00'),
				isVoiceInput: false
			},
			{
				id: '2-2',
				role: 'assistant',
				content: 'Property values in Manhattan vary significantly by neighborhood. Let me provide you with current market data.',
				timestamp: new Date('2024-01-15T10:15:30'),
				isVoiceInput: false
			}
		],
		'3': [
			{
				id: '3-1',
				role: 'user',
				content: 'Show me traffic patterns during rush hour',
				timestamp: new Date('2024-01-14T16:45:00'),
				isVoiceInput: false
			},
			{
				id: '3-2',
				role: 'assistant',
				content: 'Here\'s the traffic analysis for rush hour patterns in your area of interest.',
				timestamp: new Date('2024-01-14T16:45:30'),
				isVoiceInput: false
			}
		]
	};

	// Check if we're on mobile screen
	function checkMobile() {
		if (typeof window !== 'undefined') {
			isMobile = window.innerWidth < 1024; // Use larger breakpoint for better UX
			if (isMobile) {
				sidebarVisible = false;
			} else {
				sidebarVisible = true; // Always show on desktop in frontend layout
			}
		}
	}

	onMount(() => {
		checkMobile();
		
		// Check if there's a conversation_id in the URL for visualization
		const urlConversationId = getDataFromURL('conversation_id');
		if (urlConversationId && typeof urlConversationId === 'string') {
			conversationId = urlConversationId;
			loadVisualizationData(urlConversationId);
			setupVisualizationEchoListener(urlConversationId);
		}
		
		const handleResize = () => {
			checkMobile();
		};

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
			cleanupVisualizationEchoListener();
		};
	});

	onDestroy(() => {
		cleanupVisualizationEchoListener();
	});

	function toggleSidebar() {
		sidebarVisible = !sidebarVisible;
	}

	function handleChatSelect(chatId: string) {
		console.log('handleChatSelect called with:', chatId);
		selectedChatId = chatId;
		console.log('selectedChatId updated to:', selectedChatId);
		currentMessages = mockConversations[chatId] || [];

		// Close sidebar on mobile after selection
		if (isMobile) {
			sidebarVisible = false;
		}
	}

	// Helper function to check if step data is available in conversation results
	function hasStepData(results: Array<any> = []): boolean {
		if (!results || results.length === 0) return false;
		return results.some(result => 
			result.json_data || 
			result.step_name || 
			result.step_title ||
			result.step_type ||
			(result.status && result.status !== 'pending')
		);
	}

	function handleConversationLoaded(conversationData: any) {
		console.log('Conversation loaded:', conversationData);
		if (conversationData && conversationData.success && conversationData.data) {
			// Store conversation results for processing steps first
			if (conversationData.data.results) {
				conversationResults = conversationData.data.results;
				console.log('Conversation results set:', conversationResults);
			}

			// Transform the API messages to match our component structure
			if (conversationData.data.messages) {
				console.log('Processing messages:', conversationData.data.messages);
				console.log('Conversation ID from data:', conversationData.data.conversation_id);
				console.log('Has step data:', hasStepData(conversationResults));
				
				currentMessages = conversationData.data.messages.map((msg: any, index: number) => {
					let content = msg.content || '';
					console.log(`Message ${index}: role=${msg.role}, isLast=${index === conversationData.data.messages.length - 1}`);
					
					// If this is the final assistant message and we have step data, append visualization link
					if (msg.role === 'assistant' && 
						index === conversationData.data.messages.length - 1 && 
						hasStepData(conversationResults)) {
						
						// Try to get conversation ID from multiple sources
						let convId = conversationData.data.conversation_id || 
									conversationData.data.id ||
									(conversationResults.length > 0 ? conversationResults[0].conversation_id : null);
						
						// Fallback: extract from URL
						if (!convId) {
							const urlParams = new URLSearchParams(window.location.search);
							convId = urlParams.get('conversation_id');
						}
						
						console.log('Final conversation ID for visualization:', convId);
					}
					
					return {
						id: msg.id || `msg-${index}`,
						role: msg.role || 'user',
						content: content,
						timestamp: new Date(msg.created_at || Date.now()),
						isVoiceInput: false
					};
				});
				console.log('Messages set:', currentMessages);
			}
		}

		// Load visualization data for the right sidebar
		if (conversationData && conversationData.data && conversationData.data.conversation_id) {
			conversationId = conversationData.data.conversation_id;
			loadVisualizationData(conversationData.data.conversation_id);
			// Setup Echo listener for visualization events
			setupVisualizationEchoListener(conversationId);
		}
	}

	function handleNewMessage(message: {id: string, role: 'user' | 'assistant', content: string, timestamp: Date, isVoiceInput: boolean}) {
		// Check if message with same ID exists (for replacing processing messages)
		const existingIndex = currentMessages.findIndex(m => m.id === message.id);

		if (existingIndex !== -1) {
			// Replace existing message
			currentMessages[existingIndex] = message;
			currentMessages = [...currentMessages];
		} else {
			// Add new message
			currentMessages = [...currentMessages, message];
		}

		// If no chat is selected, create a new one
		if (!selectedChatId) {
			selectedChatId = `new-${Date.now()}`;
		}
	}

	async function handleConversationInitiated(conversationIdParam: string) {
		console.log('Conversation initiated, refreshing sidebar:', conversationIdParam);
		// Update selected chat ID - convert to string to ensure consistency
		selectedChatId = String(conversationIdParam);
		console.log('Updated selectedChatId to:', selectedChatId);
		
		// Setup visualization listeners for new conversation
		conversationId = conversationIdParam;
		setupVisualizationEchoListener(conversationIdParam);
		
		// Refresh the conversation list in the sidebar
		if (chatSidebarRef?.refreshConversations) {
			// Wait a bit to allow backend to persist the conversation
			await new Promise(resolve => setTimeout(resolve, 500));
			chatSidebarRef.refreshConversations();
		}
	}

	// Drag separator functions
	function handleSeparatorMouseDown(event: MouseEvent) {
		if (isMobile) return; // Disable dragging on mobile
		
		isDragging = true;
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		event.preventDefault();
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging || !sidebarRef) return;

		const sidebarRect = sidebarRef.getBoundingClientRect();
		const relativeY = event.clientY - sidebarRect.top;
		const newHeightPercentage = (relativeY / sidebarRect.height) * 100;

		// Constrain between 20% and 80% to prevent sections from becoming too small
		chatWindowHeight = Math.max(20, Math.min(80, newHeightPercentage));
	}

	function handleMouseUp() {
		isDragging = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	}

	// Touch events for mobile
	function handleSeparatorTouchStart(event: TouchEvent) {
		isDragging = true;
		document.addEventListener('touchmove', handleTouchMove);
		document.addEventListener('touchend', handleTouchEnd);
		event.preventDefault();
	}

	function handleTouchMove(event: TouchEvent) {
		if (!isDragging || !sidebarRef) return;

		const touch = event.touches[0];
		const sidebarRect = sidebarRef.getBoundingClientRect();
		const relativeY = touch.clientY - sidebarRect.top;
		const newHeightPercentage = (relativeY / sidebarRect.height) * 100;

		// Constrain between 20% and 80%
		chatWindowHeight = Math.max(20, Math.min(80, newHeightPercentage));
	}

	function handleTouchEnd() {
		isDragging = false;
		document.removeEventListener('touchmove', handleTouchMove);
		document.removeEventListener('touchend', handleTouchEnd);
	}
</script>

<div class="h-full flex bg-background max-h-full overflow-hidden">
	<!-- Mobile backdrop for left sidebar -->
	{#if isMobile && sidebarVisible}
		<div 
			class="fixed inset-0 bg-black/50 z-40 lg:hidden"
			on:click={toggleSidebar}
			role="button"
			tabindex="0"
			on:keydown={(e) => e.key === 'Escape' && toggleSidebar()}
		></div>
	{/if}

	<!-- Mobile backdrop for right sidebar -->
	{#if isMobile && rightSidebarVisible}
		<div 
			class="fixed inset-0 bg-black/50 z-40 lg:hidden"
			on:click={toggleRightSidebar}
			role="button"
			tabindex="0"
			on:keydown={(e) => e.key === 'Escape' && toggleRightSidebar()}
		></div>
	{/if}

	<!-- Sidebar with Chat Window on top and Communications list on bottom -->
	<div 
		bind:this={sidebarRef}
		class={`
		${isMobile ? 'fixed' : 'relative'}
		${sidebarVisible ? 'translate-x-0' : '-translate-x-full'}
		${isMobile ? 'z-50' : 'z-10'}
		transition-all duration-300 ease-in-out
		${sidebarVisible ? 'w-96' : 'w-0'}
		h-full bg-muted/30 border-r overflow-hidden flex flex-col
	`}>
		{#if sidebarVisible}
			<!-- Chat Window Section - Dynamic height -->
			<div class="flex flex-col min-h-0 border-b bg-background" style="height: {chatWindowHeight}%;">
				<ChatWindow
					{toggleSidebar}
					{sidebarVisible}
					{isMobile}
					messages={currentMessages}
					onNewMessage={handleNewMessage}
					{conversationResults}
					{selectedChatId}
					onConversationInitiated={handleConversationInitiated}
				/>
			</div>

			<!-- Draggable Separator Bar -->
			<div 
				bind:this={separatorRef}
				class={`h-2 bg-border hover:bg-border/80 cursor-row-resize transition-colors duration-200 flex items-center justify-center group ${isDragging ? 'bg-primary' : ''}`}
				on:mousedown={handleSeparatorMouseDown}
				on:touchstart={handleSeparatorTouchStart}
				role="separator"
				tabindex="0"
				aria-label="Resize sections"
			>
				<!-- Visual indicator for drag handle -->
				<div class="w-8 h-1 bg-muted-foreground/40 rounded-full group-hover:bg-muted-foreground/60 transition-colors"></div>
			</div>

			<!-- Communications List Section - Dynamic height -->
			<div class="flex flex-col min-h-0 bg-muted/20" style="height: {100 - chatWindowHeight}%;">
				<ChatSidebar
					bind:this={chatSidebarRef}
					{selectedChatId}
					onChatSelect={handleChatSelect}
					onConversationLoaded={handleConversationLoaded}
				/>
			</div>
		{/if}
	</div>

	<!-- Main Body Area - Now with Chat Header and Visualization Panel -->
	<div class={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarVisible ? '' : 'ml-0'} bg-background`}>
		<!-- Chat Header moved from ChatWindow -->
		<div class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<Button
						variant={sidebarVisible ? "ghost" : "default"}
						size="sm"
						on:click={toggleSidebar}
						class={`p-2 lg:flex ${!sidebarVisible ? 'ring-2 ring-primary/20' : ''}`}
						title={sidebarVisible ? 'Hide chat history' : 'Show chat history'}
					>
						<Icon icon={sidebarVisible ? 'lucide:sidebar-close' : 'lucide:sidebar-open'} class="w-4 h-4" />
					</Button>
					
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
							<Icon icon="lucide:bot" class="w-5 h-5 text-primary-foreground" />
						</div>
						<div>
							<h1 class="font-semibold text-xl">Cyberglobes AI Assistant</h1>
							<p class="text-sm text-muted-foreground">Ask me anything about geospatial data and mapping</p>
						</div>
					</div>
				</div>

				<!-- Right sidebar toggle -->
				<Button
					variant={rightSidebarVisible ? "ghost" : "default"}
					size="sm"
					on:click={toggleRightSidebar}
					class={`p-2 ${!rightSidebarVisible ? 'ring-2 ring-primary/20' : ''}`}
					title={rightSidebarVisible ? 'Hide visualization sidebar' : 'Show visualization sidebar'}
				>
					<Icon icon={rightSidebarVisible ? 'lucide:panel-right-close' : 'lucide:panel-right-open'} class="w-4 h-4" />
				</Button>
			</div>
		</div>

		<!-- Visualization Panel Area -->
		<div class="flex-1 min-h-0">
			<VisualizationPanel 
				hasData={hasVisualizationData} 
				{selectedStep}
				{lastUserQuery}
				{conversationResults}
				{scripterResults}
				{selectedViewType}
			/>
		</div>

		<!-- Footer moved from ChatSidebar -->
		<div class="pt-6 border-t border-border/50 p-4">
			<div class="text-xs text-muted-foreground text-center space-y-1">
				<div class="flex items-center justify-center gap-1">
					<Icon icon="lucide:sparkles" class="w-3 h-3" />
					<span>Powered by Cyberglobes AI</span>
				</div>
				<div>Advanced geospatial intelligence</div>
			</div>
		</div>
	</div>

	<!-- Right Sidebar - Visualization Steps -->
	<div class={`
		${isMobile ? 'fixed' : 'relative'}
		${rightSidebarVisible ? 'translate-x-0' : 'translate-x-full'}
		${isMobile ? 'z-50' : 'z-10'}
		transition-all duration-300 ease-in-out
		${rightSidebarVisible ? 'w-80' : 'w-0'}
		h-full bg-muted/30 border-l overflow-hidden
	`}>
		{#if rightSidebarVisible}
			<InstagramStepsSidebar
				bind:this={visualizationSidebarRef}
				selectedStep={selectedStep}
				onStepSelect={handleStepSelect}
				onScripterResults={handleScripterResults}
				{conversationResults}
				{hasSavedVisualizationsCount}
			/>
		{/if}
	</div>
</div>