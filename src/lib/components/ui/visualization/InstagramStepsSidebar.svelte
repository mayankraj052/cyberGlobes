<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Icon from '@iconify/svelte';
	import { ApiService } from '$lib/services/api-service';
	import { getDataFromURL } from '$lib/utils/generalUtils';
	import VisualizationPromptCard from './VisualizationPromptCard.svelte';
	import { tick, onDestroy } from 'svelte';
	import Echo from 'laravel-echo';
	import Pusher from 'pusher-js';
	import { AUTH_TOKEN } from '$lib/constants/constants.js';
	import { PUBLIC_VITE_PUSHER_APP_KEY, PUBLIC_VITE_PUSHER_APP_CLUSTER, PUBLIC_ECHO_BROADCASTER, PUBLIC_ECHO_PUSHER_HOST, PUBLIC_ECHO_PUSHER_PORT, PUBLIC_ECHO_PUSHER_SCHEME, PUBLIC_ECHO_PUSHER_ENCRYPTED, PUBLIC_API_URL } from '$env/static/public';
	import { browser } from '$app/environment';
	import { triggerSuccessToast, triggerErrorToast } from '$lib/stores/toastStore';

	export let selectedStep = '';
	export let onStepSelect: (step: string) => void;
	export let onScripterResults: (results: any[], viewType: string, cardId: string) => void;
	export let conversationResults: Array<any> = [];
	export let hasSavedVisualizationsCount = 0; // Number of saved visualizations from DB

	// API service instance
	const apiService = new ApiService();

	// Pusher/Echo instance for scripter events
	let echoInstance: Echo | null = null;
	let activeScripterSessions: Map<string, string> = new Map(); // Map cardId -> session_id

	// Mode state (auto or manual)
	let visualizationMode: 'auto' | 'manual' = 'auto';
	let isAnalyzing = false;
	let analyzeSessionId: string | null = null;
	let lastAnalyzedStep: string | null = null; // Track which step was last analyzed
	let hasSavedVisualizations = false; // Flag to prevent auto-analysis when loading saved visualizations

	// Prompt cards state
	let promptCards: Array<{
		id: string;
		title: string;
		type: string;
		prompt: string;
		status: string;
		sessionId: string | null;
		results: any;
		error: string | null;
		createdAt: number;
		isAuto?: boolean; // Flag for auto-generated cards
		priority?: number; // For sorting auto-generated cards
		visualizationId?: number; // Database visualization ID for linking to scripter job
	}> = [];

	let cardIdCounter = 0;

	$: if (conversationResults.length === 0 && promptCards.length > 0) {
    
        console.log('conversationResults is empty, clearing internal promptCards.');
        promptCards = [];
        isAnalyzing = false;
        lastAnalyzedStep = null;
        hasSavedVisualizations = false;
    }

	// Generate steps only from conversation results
	$: dynamicSteps = conversationResults.map((result, index) => ({
		id: result.id || `step-${index}`,
		title: getStepTitle(result, index),
		description: getResultDescription(result),
		icon: getResultIcon(result),
		color: getResultColor(index),
		data: result,
		type: result.step_type || 'data',
		stepName: result.step_name,
		status: result.status
	}));

	// Set first conversation step as default selected when available
	// BUT ONLY if we don't have saved visualizations (to avoid triggering auto-analysis prematurely)
	$: if (conversationResults.length > 0 && dynamicSteps.length > 0 && !selectedStep && !hasSavedVisualizations && hasSavedVisualizationsCount === 0) {
		selectedStep = dynamicSteps[0].id;
	}

	// Reset selected step if no conversation results
	$: if (conversationResults.length === 0 && selectedStep) {
		selectedStep = '';
	}

	// Clear prompt cards when step changes
	$: if (selectedStep) {
		// Optional: clear cards when changing steps
		// promptCards = [];
	}

	function getStepTitle(result: any, index: number): string {
		if (result.step_type && result.step_name) {
			switch (result.step_type.toLowerCase()) {
				case 'service': return `Service`;
				case 'scripter': return `Scripter`;
				case 'ai': return `AI Analysis`;
				case 'ai-image': return `AI Image Analysis`;
				case 'profiler': return `Profiler`;
				default: return `Step ${result.step_name}`;
			}
		}

		if (result.step_name) {
			return result.step_name.length > 50
				? result.step_name.substring(0, 50) + '...'
				: result.step_name;
		}

		return `Step ${index + 1}`;
	}

	function getResultDescription(result: any): string {
		if (result.step_name === 'finalizing') {
			return 'Final conversation results and processed data ready for visualization';
		}

		if (result.step_title) {
			return result.step_title.length > 100
				? result.step_title.substring(0, 100) + '...'
				: result.step_title;
		}

		if (result.step_type) {
			switch (result.step_type.toLowerCase()) {
				case 'service': return 'External service call for data collection and processing';
				case 'scripter': return 'Data transformation and formatting operations';
				case 'analyzer': return 'Data analysis and insights generation';
				case 'ai': return 'AI-powered analysis and intelligent data processing';
				case 'ai-image': return 'AI image analysis and visual content processing';
				case 'profiler': return 'Data profiling and statistical analysis operations';
				default: return `${result.step_type} processing step`;
			}
		}

		return `Step ${result.step_name || 'N/A'} - Click to analyze and visualize data`;
	}

	function getResultIcon(result: any): string {
		if (result.step_name === 'finalizing') {
			return 'lucide:check-circle';
		}

		if (result.step_type) {
			switch (result.step_type.toLowerCase()) {
				case 'service': return 'lucide:globe';
				case 'scripter': return 'lucide:code';
				case 'analyzer': return 'lucide:bar-chart-3';
				case 'ai': return 'lucide:brain';
				case 'ai-image': return 'lucide:image';
				case 'profiler': return 'lucide:user-search';
				default: return 'lucide:settings';
			}
		}

		return 'lucide:circle-dot';
	}

	function getResultColor(index: number): string {
		const colors = [
			'from-purple-500 to-pink-500',
			'from-blue-500 to-purple-500',
			'from-green-500 to-blue-500',
			'from-yellow-500 to-orange-500',
			'from-red-500 to-pink-500'
		];
		return colors[index % colors.length];
	}

	// Setup Echo instance for Pusher
	function setupEchoInstance() {
		if (!browser || echoInstance) return;

		let authToken = localStorage.getItem(AUTH_TOKEN) || false;
		if (!authToken) {
			console.warn('No auth token available for Pusher connection');
			return;
		}

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
			authEndpoint: PUBLIC_API_URL + '/broadcasting/auth',
			encrypted: PUBLIC_ECHO_PUSHER_ENCRYPTED === 'true',
			disableStats: true,
			wsHost: PUBLIC_ECHO_PUSHER_HOST,
			wsPort: PUBLIC_ECHO_PUSHER_PORT,
			wssPort: PUBLIC_ECHO_PUSHER_PORT,
			forceTLS: PUBLIC_ECHO_PUSHER_SCHEME === 'https',
			enabledTransports: ['ws', 'wss']
		});

		console.log('Echo instance initialized for scripter events');
	}

	// Subscribe to scripter session channel
	function subscribeToScripterSession(sessionId: string, cardId: string) {
		if (!browser) return;

		setupEchoInstance();

		if (!echoInstance) {
			console.error('Echo instance not available');
			return;
		}

		console.log(`Subscribing to scripter session: ${sessionId} for card: ${cardId}`);

		echoInstance.private(`scripter-session.${sessionId}`)
			.listen('.scripter.job.status.changed', (event: any) => {
				console.log('Scripter status changed:', event);
				// Pass the sessionId from the subscription, not the event
				handleScripterStatusChange(event, cardId, sessionId);
			});

		// Store active session
		activeScripterSessions.set(cardId, sessionId);
	}

	// Handle scripter status change events
	async function handleScripterStatusChange(event: any, cardId: string, sessionId: string) {
		const { status, success, job_id, message, progress_percentage } = event;

		console.log(`Card ${cardId} - Job: ${job_id}, Status: ${status}, Success: ${success}`);

		// Update card with status and progress
		updatePromptCard(cardId, {
			status: status === 'completed' ? 'completed' : status === 'failed' ? 'failed' : 'processing',
			error: status === 'failed' ? message : null
		});

		// If completed successfully, fetch results using session_id
		if (status === 'completed' && success) {
			try {
				console.log(`Fetching results for session: ${sessionId}`);
				const resultsResponse = await apiService.getScripterResults(sessionId);

				if (resultsResponse.success) {
					// Navigate the nested structure to find processed_data
					let results = [];

					// Try multiple paths based on different response formats

					// Format 1: data.response.processed_data (primary format from scripter/results endpoint)
					if (resultsResponse.data?.response?.processed_data) {
						results = resultsResponse.data.response.processed_data;
						console.log('Extracted from data.response.processed_data');
					}
					// Format 2: data.response.result.result.steps[].processed_data (format with steps)
					else if (resultsResponse.data?.response?.result?.result?.steps) {
						const steps = resultsResponse.data.response.result.result.steps;
						// Get processed_data from the first step (or merge all steps if needed)
						if (Array.isArray(steps) && steps.length > 0 && steps[0].processed_data) {
							results = steps[0].processed_data;
							console.log('Extracted from steps[0].processed_data');
						}
					}
					// Format 3: data.response.result.result.results (previous format)
					else if (resultsResponse.data?.response?.result?.result?.results) {
						results = resultsResponse.data.response.result.result.results;
						console.log('Extracted from result.result.results');
					}
					// Format 4: data.response.result.results
					else if (resultsResponse.data?.response?.result?.results) {
						results = resultsResponse.data.response.result.results;
						console.log('Extracted from result.results');
					}
					// Format 5: data.response.results
					else if (resultsResponse.data?.response?.results) {
						results = resultsResponse.data.response.results;
						console.log('Extracted from response.results');
					}
					// Format 6: data.results
					else if (resultsResponse.data?.results) {
						results = resultsResponse.data.results;
						console.log('Extracted from data.results');
					}

					console.log('Extracted results:', results);

					// Ensure results is an array
					const resultsArray = Array.isArray(results) ? results : (results ? [results] : []);

					if (resultsArray.length === 0) {
						console.warn('No results found in response. Full response:', resultsResponse);
					}

					updatePromptCard(cardId, {
						status: 'completed',
						results: resultsArray
					});

					// Automatically view the visualization
					autoViewVisualization(cardId);

					// Cleanup: unsubscribe from channel
					unsubscribeFromScripterSession(sessionId);
				} else {
					throw new Error(resultsResponse.message || 'Failed to fetch results');
				}
			} catch (error: any) {
				console.error('Error fetching scripter results:', error);
				updatePromptCard(cardId, {
					status: 'failed',
					error: error.message || 'Failed to fetch results'
				});
			}
		} else if (status === 'failed') {
			// Cleanup on failure
			unsubscribeFromScripterSession(sessionId);
		}
	}

	// Unsubscribe from scripter session
	function unsubscribeFromScripterSession(sessionId: string) {
		if (echoInstance) {
			echoInstance.leave(`scripter-session.${sessionId}`);
			console.log(`Unsubscribed from scripter session: ${sessionId}`);
		}

		// Remove from active sessions
		for (const [cardId, sid] of activeScripterSessions.entries()) {
			if (sid === sessionId) {
				activeScripterSessions.delete(cardId);
				break;
			}
		}
	}

	// Cleanup all subscriptions
	function cleanupAllSubscriptions() {
		if (echoInstance) {
			for (const sessionId of activeScripterSessions.values()) {
				echoInstance.leave(`scripter-session.${sessionId}`);
			}
			activeScripterSessions.clear();
			console.log('Cleaned up all scripter subscriptions');
		}
	}

	// Cleanup on component destroy
	onDestroy(() => {
		cleanupAllSubscriptions();
	});

	function selectStep(stepId: string) {
		onStepSelect(stepId);
	}

	function getSelectedStepTitle(): string {
		if (conversationResults.length === 0) return 'No Conversation Data';
		const step = dynamicSteps.find((s) => s.id === selectedStep);
		return step ? step.title : 'Select a Conversation Step';
	}

	function getSelectedStepData(): any {
		const step = dynamicSteps.find((s) => s.id === selectedStep);
		return step ? step.data : null;
	}

	// Prompt card management
	function addPromptCard() {
		const newCard = {
			id: `card-${Date.now()}-${cardIdCounter++}`,
			title: `Visualization ${promptCards.length + 1}`,
			type: 'datatable',
			prompt: '',
			status: 'pending',
			sessionId: null,
			results: null,
			error: null,
			createdAt: Date.now()
		};

		promptCards = [...promptCards, newCard];
	}

    async function removePromptCard(cardId: string) {
        const confirmDelete = confirm('Are you sure you want to delete this visualization?');
        if (!confirmDelete) return;

        try {
            const response = await apiService.deleteVisualization(cardId);
			
            if (response.success) {
                triggerSuccessToast('Visualization deleted successfully!');
				promptCards = promptCards.filter((card) => card.visualizationId !== cardId);
            }else {
                triggerErrorToast('Failed to delete visualization on server.');
            } 
        } catch (error) {
            triggerErrorToast('Error deleting visualization.');
        }
    }

	function updatePromptCard(cardId: string, updates: any) {
		promptCards = promptCards.map((card) => (card.id === cardId ? { ...card, ...updates } : card));
		// Force reactivity by reassigning the array
		promptCards = promptCards;
	}

	async function submitPrompt(cardId: string) {
		const card = promptCards.find((c) => c.id === cardId);
		if (!card || !card.prompt.trim()) return;

		if (!selectedStep) {
			updatePromptCard(cardId, {
				status: 'failed',
				error: 'Please select a conversation step first'
			});
			return;
		}

		try {
			updatePromptCard(cardId, { status: 'processing', error: null });

			const conversationId = getDataFromURL('conversation_id');
			if (!conversationId) {
				throw new Error('No conversation ID found');
			}

			const stepData = getSelectedStepData();
			if (!stepData) {
				throw new Error('No step data found for selected step');
			}

			const executeResponse = await apiService.executeScripter(
				card.prompt,
				stepData.id.toString(),
				conversationId,
				'0'
			);

			if (!executeResponse.success) {
				throw new Error(executeResponse.message || 'Failed to execute scripter');
			}

			const sessionId = executeResponse.data?.session_id;
			if (!sessionId) {
				throw new Error('No session ID returned from scripter execute');
			}

			updatePromptCard(cardId, { sessionId });

		// If this card has a visualizationId (from DB), link it to scripter job
		if (card.visualizationId) {
			try {
				console.log(`Attempting to link visualization ${card.visualizationId} with session ${sessionId}`);
				await apiService.updateVisualizationStatus(
					card.visualizationId,
					sessionId,
					'processing'
				);
				console.log(`Successfully linked visualization ${card.visualizationId} to scripter session ${sessionId}`);
			} catch (error) {
				console.error('Failed to link visualization to scripter job:', error);
				// Don't fail the whole operation if linking fails
			}
		}

			// Subscribe to Pusher events for this session
			subscribeToScripterSession(sessionId, cardId);

			console.log(`Scripter job submitted. Session ID: ${sessionId}. Listening for status updates...`);
		} catch (error: any) {
			console.error('Error executing prompt:', error);
			updatePromptCard(cardId, {
				status: 'failed',
				error: error.message || 'Failed to process visualization'
			});
		}
	}

	async function submitAllPrompts() {
		const pending = promptCards.filter((card) => card.status === 'pending');

		if (pending.length === 0) {
			return;
		}

		// Execute all pending cards in parallel
		await Promise.allSettled(pending.map((card) => submitPrompt(card.id)));
	}

	function cancelPrompt(cardId: string) {
		// TODO: Implement cancellation if backend supports it
		updatePromptCard(cardId, {
			status: 'pending',
			sessionId: null,
			error: 'Cancelled by user'
		});
	}

	function retryPrompt(cardId: string) {
		updatePromptCard(cardId, {
			status: 'pending',
			error: null,
			sessionId: null,
			results: null
		});
		submitPrompt(cardId);
	}

	function refreshPrompt(cardId: string) {
		const card = promptCards.find((c) => c.id === cardId);
		if (!card) return;

		updatePromptCard(cardId, {
			status: 'pending',
			error: null,
			sessionId: null,
			results: null
		});
		submitPrompt(cardId);
	}

	function viewVisualization(cardId: string) {
		const card = promptCards.find((c) => c.id === cardId);
		if (!card || !card.results) return;

		// Pass results to visualization panel
		onScripterResults(card.results, card.type, cardId);
	}

	// Automatically view visualization when card completes
	async function autoViewVisualization(cardId: string) {
		// Small delay to ensure the card state is updated
		await tick();

		const card = promptCards.find((c) => c.id === cardId);
		if (!card || !card.results || card.results.length === 0) return;

		// Automatically pass results to visualization panel
		console.log('Auto-viewing visualization for card:', cardId, 'type:', card.type, 'results count:', card.results.length);
		onScripterResults(card.results, card.type, cardId);
	}

	async function clearAllCards(){
		const confirmDelete = confirm('Are you sure you want to delete all visualizations?');
		if(!confirmDelete) return;

		const cardsToDelete = [...promptCards];
		try{
			await Promise.all(
				cardsToDelete.map((card)=>{
					if(card.visualizationId){
						return apiService.deleteVisualization(card.visualizationId);
					}
				})
			);
			promptCards = [];
			triggerSuccessToast('All visualizations are deleted successfully!');

		}catch(error){
			console.error('Error clearing all visualizations:',error);
			triggerErrorToast('Error clearing all visualizations.');
		}
	}
			

	// Toggle between auto and manual mode
	function toggleMode(mode: 'auto' | 'manual') {
		visualizationMode = mode;

		// If switching to auto mode and we have a selected step, trigger analysis
		if (mode === 'auto' && selectedStep) {
			// Only trigger analysis if we don't have saved visualizations
			// or if user explicitly wants to re-analyze
			if (!hasSavedVisualizations) {
				lastAnalyzedStep = null;
				triggerAutoAnalysis();
			}
		}

		// If switching to manual mode, clear auto-generated cards
		if (mode === 'manual') {
			promptCards = promptCards.filter(card => !card.isAuto);
			isAnalyzing = false;
			lastAnalyzedStep = null;
		}
	}

	// Trigger auto-analysis for selected step
	async function triggerAutoAnalysis() {
		if (!selectedStep) {
			return;
		}

		// Don't re-analyze if we've already analyzed this step
		if (lastAnalyzedStep === selectedStep) {
			return;
		}

		const stepData = getSelectedStepData();
		if (!stepData) {
			return;
		}

		const conversationId = getDataFromURL('conversation_id');
		if (!conversationId) {
			return;
		}

		try {
			isAnalyzing = true;
			lastAnalyzedStep = selectedStep; // Mark this step as analyzed

			const response = await apiService.analyzeStepForVisualizations(
				conversationId,
				stepData.id.toString()
			);

			if (response.success && response.data?.session_id) {
				analyzeSessionId = response.data.session_id;
				// Results will come via pusher event VisualizationsDetected
			} else {
				throw new Error(response.message || 'Failed to initiate auto-analysis');
			}
		} catch (error: any) {
			console.error('Error triggering auto-analysis:', error);
			isAnalyzing = false;
			lastAnalyzedStep = null; // Reset on error so user can retry
		}
	}

	// Public function to set the flag BEFORE any reactive statements trigger
	export function setSavedVisualizationsFlag(value: boolean) {
		console.log('🔐 Setting hasSavedVisualizations flag to:', value);
		hasSavedVisualizations = value;
	}

	// Public function called from parent when VisualizationsDetected event is received
	// For saved visualizations (sessionId='saved-from-db'), visualizations array should contain full DB records with results
	export async function handleAutoVisualizations(visualizations: any[], sessionId: string, visualizationIds?: number[]) {
		// Verify this is for our current analysis session (or allow 'saved-from-db' for loaded visualizations)
		if (sessionId !== analyzeSessionId && sessionId !== 'saved-from-db') {
			console.warn('Session ID mismatch - ignoring visualizations');
			return;
		}

		const isLoadingFromDb = sessionId === 'saved-from-db';

		// Set flag to prevent reactive auto-analysis from triggering
		if (isLoadingFromDb && visualizations.length > 0) {
			hasSavedVisualizations = true;
			// Mark the current step as already analyzed to prevent re-analysis
			lastAnalyzedStep = selectedStep;
			console.log('🔒 hasSavedVisualizations flag set to TRUE', {
				selectedStep,
				lastAnalyzedStep,
				visualizationsCount: visualizations.length
			});
		}

		console.log('handleAutoVisualizations called:', {
			isLoadingFromDb,
			visualizationsCount: visualizations.length,
			visualizations: visualizations.map(v => ({
				id: v.id,
				type: v.type,
				name: v.name,
				status: v.status,
				scripterJobStatus: v.scripter_job?.status,
				hasResults: !!(v.results && v.results.processed_data)
			}))
		});

		// Clear existing auto-generated cards
		promptCards = promptCards.filter(card => !card.isAuto);

		// Create prompt cards from AI-generated visualizations
		const autoCards = visualizations
			.filter(viz => viz.applicable === true || isLoadingFromDb) // Include all when loading from DB
			.sort((a, b) => (b.priority || 0) - (a.priority || 0)) // Sort by priority descending
			.map((viz, index) => {
				// Check if this visualization has completed results
				// A visualization is considered completed if it has results AND the scripter job is completed
				const hasScripterJobCompleted = viz.scripter_job?.status === 'completed';
				const hasResults = viz.results && viz.results.processed_data;
				const isCompleted = isLoadingFromDb && hasScripterJobCompleted && hasResults;

				return {
					id: `auto-${viz.type}-${Date.now()}-${cardIdCounter++}`,
					title: viz.name,
					type: viz.type,
					prompt: viz.prompt,
					status: isCompleted ? 'completed' : 'pending',
					sessionId: isCompleted ? viz.session_id : null,
					results: hasResults ? (Array.isArray(viz.results.processed_data) ? viz.results.processed_data : [viz.results.processed_data]) : null,
					error: viz.status === 'failed' ? viz.error_message : null,
					createdAt: viz.created_at ? new Date(viz.created_at).getTime() : Date.now(),
					isAuto: true,
					priority: viz.priority,
					// Try multiple sources for visualization ID: viz.id (from event or DB), visualizationIds array, or null
					visualizationId: viz.id || visualizationIds?.[index] || null
				};
			});

		// Add auto-generated cards to promptCards
		promptCards = [...autoCards, ...promptCards];

		console.log('Created auto cards:', {
			totalCards: autoCards.length,
			cards: autoCards.map(c => ({
				id: c.id,
				title: c.title,
				type: c.type,
				status: c.status,
				hasResults: !!(c.results && c.results.length > 0),
				resultsCount: c.results?.length || 0,
				visualizationId: c.visualizationId
			}))
		});

		// Wait for next tick before setting isAnalyzing to false
		// This prevents the reactive statement from re-triggering
		await tick();
		isAnalyzing = false;

		// Only auto-submit if these are NEW visualizations (not from DB)
		// For DB visualizations, only submit pending ones
		if (autoCards.length > 0 && !isLoadingFromDb) {
			setTimeout(() => {
				submitAllPrompts();
			}, 500);
		} else if (isLoadingFromDb) {
			// For loaded visualizations, only submit pending ones (not completed)
			const pendingCards = autoCards.filter(card => card.status === 'pending');
			if (pendingCards.length > 0) {
				setTimeout(() => {
					submitAllPrompts();
				}, 500);
			}

			// Auto-view the first completed visualization
			const completedWithResults = autoCards.find(card => card.status === 'completed' && card.results && card.results.length > 0);
			if (completedWithResults) {
				setTimeout(() => {
					autoViewVisualization(completedWithResults.id);
				}, 100);
			}
		}
	}

	// Reactive: Trigger auto-analysis when step changes in auto mode
	$: {
		// Only react to these specific dependencies
		const mode = visualizationMode;
		const step = selectedStep;
		const analyzing = isAnalyzing;
		const lastStep = lastAnalyzedStep;
		const hasSaved = hasSavedVisualizations;
		const savedCount = hasSavedVisualizationsCount;

		console.log('🔄 Reactive statement triggered:', {
			mode,
			step,
			analyzing,
			lastStep,
			hasSaved,
			savedCount,
			willTriggerAnalysis: mode === 'auto' && step && !analyzing && lastStep !== step && !hasSaved && savedCount === 0
		});

		// Don't trigger auto-analysis if:
		// - We have saved visualizations loaded from DB (either flag or count > 0)
		// - Already analyzing
		// - Same step as last analyzed
		if (mode === 'auto' && step && !analyzing && lastStep !== step && !hasSaved && savedCount === 0) {
			console.log('🚀 Triggering auto-analysis for step:', step);
			// Clear existing cards when step changes
			promptCards = [];
			// Trigger new analysis
			triggerAutoAnalysis();
		}
	}

</script>

<div class="h-full flex flex-col p-4 bg-muted/20">
	<!-- Header -->
	<div class="mb-4">
		<h2 class="text-lg font-semibold mb-2">
			{conversationResults.length > 0 ? 'Conversation Steps' : 'Data Analytics'}
		</h2>
		<p class="text-sm text-muted-foreground">
			{conversationResults.length > 0
				? `Select from ${conversationResults.length} conversation step${conversationResults.length > 1 ? 's' : ''} to analyze`
				: 'Select a data category to analyze'}
		</p>
		{#if selectedStep}
			<div class="mt-2 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full inline-block">
				✓ {getSelectedStepTitle()} Selected
			</div>
		{/if}
	</div>

	<!-- Dropdown Menu -->
	<div class="mb-4">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="outline" class="w-full justify-between" builders={[builder]}>
					{getSelectedStepTitle()}
					<Icon icon="lucide:chevron-down" class="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-[300px]">
				{#if dynamicSteps.length > 0}
					{#each dynamicSteps as step}
						<DropdownMenu.Item class="cursor-pointer p-3" on:click={() => selectStep(step.id)}>
							<div class="flex items-center gap-3 w-full">
								<div
									class={`
									w-6 h-6 rounded-lg bg-gradient-to-r ${step.color}
									flex items-center justify-center text-white flex-shrink-0
								`}
								>
									<Icon icon={step.icon} class="w-3 h-3" />
								</div>
								<div class="flex-1 min-w-0">
									<div class="font-medium text-sm">{step.title}</div>
									<div class="text-xs text-muted-foreground line-clamp-2">{step.description}</div>
								</div>
							</div>
						</DropdownMenu.Item>
					{/each}
				{:else}
					<DropdownMenu.Item class="p-3 text-center text-muted-foreground">
						<div class="flex flex-col items-center gap-2">
							<Icon icon="lucide:database-x" class="w-6 h-6" />
							<div class="text-sm">No conversation steps available</div>
							<div class="text-xs">Please start a conversation first</div>
						</div>
					</DropdownMenu.Item>
				{/if}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<!-- Mode Toggle -->
	<div class="mb-4">
		<div class="flex items-center gap-2 p-1 bg-muted rounded-lg">
			<button
				on:click={() => toggleMode('auto')}
				class={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
					visualizationMode === 'auto'
						? 'bg-primary text-primary-foreground shadow-sm'
						: 'text-muted-foreground hover:text-foreground'
				}`}
			>
				<Icon icon="lucide:sparkles" class="w-3 h-3 inline mr-1" />
				Auto
			</button>
			<button
				on:click={() => toggleMode('manual')}
				class={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
					visualizationMode === 'manual'
						? 'bg-primary text-primary-foreground shadow-sm'
						: 'text-muted-foreground hover:text-foreground'
				}`}
			>
				<Icon icon="lucide:hand" class="w-3 h-3 inline mr-1" />
				Manual
			</button>
		</div>
		{#if isAnalyzing}
			<div class="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
				<Icon icon="lucide:loader-2" class="w-3 h-3 animate-spin" />
				<span>Analyzing step data...</span>
			</div>
		{/if}
	</div>

	<!-- Custom Visualizations Section -->
	<div class="flex-1 flex flex-col min-h-0">
		<!-- Header with Add Button -->
		<div class="flex items-center justify-between mb-3">
			<h3 class="text-sm font-semibold">
				{visualizationMode === 'auto' ? 'Auto-Generated Visualizations' : 'Custom Visualizations'}
				{#if promptCards.length > 0}
					<span class="text-muted-foreground">({promptCards.length})</span>
				{/if}
			</h3>
			{#if visualizationMode === 'manual'}
				<Button
					variant="default"
					size="sm"
					class="h-7 text-xs"
					on:click={addPromptCard}
					disabled={!selectedStep}
				>
					<Icon icon="lucide:plus" class="w-3 h-3 mr-1" />
					Add
				</Button>
			{/if}
		</div>

		<!-- Prompt Cards List -->
		<div class="flex-1 overflow-y-auto space-y-0 mb-3">
			{#if promptCards.length === 0 && !isAnalyzing}
				<div class="text-center text-muted-foreground py-8">
					<Icon icon={visualizationMode === 'auto' ? 'lucide:sparkles' : 'lucide:layers'} class="w-12 h-12 mx-auto mb-2 opacity-50" />
					<p class="text-sm font-medium">
						{visualizationMode === 'auto' ? 'No auto-generated visualizations' : 'No visualizations yet'}
					</p>
					<p class="text-xs mt-1">
						{visualizationMode === 'auto'
							? 'Select a step to auto-generate visualizations'
							: 'Click "Add" to create a new visualization'}
					</p>
				</div>
			{:else if isAnalyzing}
				<div class="text-center text-muted-foreground py-8">
					<Icon icon="lucide:loader-2" class="w-12 h-12 mx-auto mb-2 opacity-50 animate-spin" />
					<p class="text-sm font-medium">Analyzing step data</p>
					<p class="text-xs mt-1">AI is analyzing the data to recommend visualizations...</p>
				</div>
			{:else}
				{#each promptCards as card (card.id)}
					<VisualizationPromptCard
						{card}
						onRemove={removePromptCard}
						onUpdate={updatePromptCard}
						onSubmit={submitPrompt}
						onView={viewVisualization}
						onCancel={cancelPrompt}
						onRetry={retryPrompt}
						onRefresh={refreshPrompt}
					/>
				{/each}
			{/if}
		</div>

		<!-- Batch Actions -->
		{#if promptCards.length > 0}
			<div class="flex gap-2">
				<Button
					variant="default"
					size="sm"
					class="flex-1 text-xs"
					on:click={submitAllPrompts}
					disabled={!promptCards.some((c) => c.status === 'pending')}
				>
					<Icon icon="lucide:play-circle" class="w-3 h-3 mr-1" />
					Generate All
				</Button>
				<Button variant="outline" size="sm" class="flex-1 text-xs" on:click={clearAllCards}>
					<Icon icon="lucide:trash-2" class="w-3 h-3 mr-1" />
					Clear All
				</Button>
			</div>
		{/if}
	</div>
</div>
