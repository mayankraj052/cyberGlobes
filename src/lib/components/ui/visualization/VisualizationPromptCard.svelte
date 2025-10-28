<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import Icon from '@iconify/svelte';

	export let card: {
		id: string;
		title: string;
		type: string;
		prompt: string;
		status: string;
		sessionId: string | null;
		results: any;
		error: string | null;
		createdAt: number;
	};

	export let onRemove: (id: string) => void;
	export let onUpdate: (id: string, updates: any) => void;
	export let onSubmit: (id: string) => void;
	export let onView: (id: string) => void;
	export let onCancel: (id: string) => void;
	export let onRetry: (id: string) => void;
	export let onRefresh: (id: string) => void;

	// Visualization type options
	const vizTypes = [
		{ value: 'datatable', label: 'Table', icon: 'lucide:table' },
		{ value: 'map', label: 'Map', icon: 'lucide:map-pin' },
		{ value: 'pie', label: 'Pie', icon: 'lucide:pie-chart' },
		{ value: 'bar', label: 'Bar', icon: 'lucide:bar-chart-3' },
		{ value: 'line', label: 'Line', icon: 'lucide:line-chart' }
	];

	// Update card type
	function handleTypeChange(type: string) {
		onUpdate(card.id, { type });
	}

	// Update card prompt
	function handlePromptChange(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		onUpdate(card.id, { prompt: target.value });
	}

	// Update card title
	function handleTitleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		onUpdate(card.id, { title: target.value });
	}

	// Get status icon and color
	function getStatusDisplay() {
		switch (card.status) {
			case 'processing':
				return { icon: 'lucide:loader-2', color: 'text-blue-500', text: 'Processing...', spinning: true };
			case 'completed':
				return { icon: 'lucide:check-circle', color: 'text-green-500', text: 'Ready', spinning: false };
			case 'failed':
				return { icon: 'lucide:x-circle', color: 'text-red-500', text: 'Failed', spinning: false };
			default:
				return { icon: 'lucide:circle', color: 'text-gray-400', text: 'Pending', spinning: false };
		}
	}

	$: statusDisplay = getStatusDisplay();
</script>

<Card class="p-4 mb-3 border border-border hover:border-primary/50 transition-colors">
	<!-- Header -->
	<div class="flex items-center justify-between mb-3">
		<input
			type="text"
			value={card.title}
			on:input={handleTitleChange}
			class="flex-1 text-sm font-semibold bg-transparent border-none outline-none focus:outline-none px-0"
			placeholder="Visualization Title"
		/>
		<Button
			variant="ghost"
			size="sm"
			class="p-1 h-auto hover:bg-destructive/10 hover:text-destructive"
			on:click={() => onRemove(card.visualizationId ?? card.id)}
			title="Remove visualization"
		>
			<Icon icon="lucide:x" class="w-4 h-4" />
		</Button>
	</div>

	<!-- Visualization Type Selector -->
	<div class="mb-3">
		<p class="text-xs text-muted-foreground mb-2">Visualization Type:</p>
		<div class="flex flex-wrap gap-2">
			{#each vizTypes as vizType}
				<label class="relative cursor-pointer">
					<input
						type="radio"
						name={`viz-type-${card.id}`}
						value={vizType.value}
						checked={card.type === vizType.value}
						on:change={() => handleTypeChange(vizType.value)}
						class="sr-only"
						disabled={card.status === 'processing'}
					/>
					<div
						class={`
							px-2 py-1 rounded-md text-xs font-medium border transition-all
							${card.type === vizType.value
								? 'bg-primary text-primary-foreground border-primary'
								: 'bg-background text-muted-foreground border-border hover:bg-muted'}
							${card.status === 'processing' ? 'opacity-50 cursor-not-allowed' : ''}
						`}
					>
						<Icon icon={vizType.icon} class="w-3 h-3 inline mr-1" />
						{vizType.label}
					</div>
				</label>
			{/each}
		</div>
	</div>

	<!-- Prompt Textarea -->
	<div class="mb-3">
		<p class="text-xs text-muted-foreground mb-2">Prompt:</p>
		<textarea
			value={card.prompt}
			on:input={handlePromptChange}
			placeholder="Enter your visualization prompt..."
			class="w-full min-h-[80px] max-h-[150px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
			disabled={card.status === 'processing'}
			rows="3"
		></textarea>
	</div>

	<!-- Status & Actions -->
	<div class="flex items-center justify-between">
		<!-- Status Indicator -->
		<div class="flex items-center gap-2">
			<Icon
				icon={statusDisplay.icon}
				class={`w-4 h-4 ${statusDisplay.color} ${statusDisplay.spinning ? 'animate-spin' : ''}`}
			/>
			<span class="text-xs font-medium {statusDisplay.color}">
				{statusDisplay.text}
			</span>
		</div>

		<!-- Action Buttons -->
		<div class="flex items-center gap-1">
			{#if card.status === 'pending'}
				<Button
					variant="default"
					size="sm"
					class="h-7 text-xs"
					on:click={() => onSubmit(card.id)}
					disabled={!card.prompt.trim()}
				>
					<Icon icon="lucide:play" class="w-3 h-3 mr-1" />
					Submit
				</Button>
			{:else if card.status === 'processing'}
				<Button
					variant="outline"
					size="sm"
					class="h-7 text-xs"
					on:click={() => onCancel(card.id)}
				>
					<Icon icon="lucide:x" class="w-3 h-3 mr-1" />
					Cancel
				</Button>
			{:else if card.status === 'completed'}
				<Button
					variant="default"
					size="sm"
					class="h-7 text-xs"
					on:click={() => onView(card.id)}
				>
					<Icon icon="lucide:eye" class="w-3 h-3 mr-1" />
					View
				</Button>
				<Button
					variant="ghost"
					size="sm"
					class="h-7 text-xs"
					on:click={() => onRefresh(card.id)}
					title="Refresh visualization"
				>
					<Icon icon="lucide:refresh-cw" class="w-3 h-3" />
				</Button>
			{:else if card.status === 'failed'}
				<Button
					variant="destructive"
					size="sm"
					class="h-7 text-xs"
					on:click={() => onRetry(card.id)}
				>
					<Icon icon="lucide:refresh-cw" class="w-3 h-3 mr-1" />
					Retry
				</Button>
			{/if}
		</div>
	</div>

	<!-- Error Message -->
	{#if card.status === 'failed' && card.error}
		<div class="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
			<p class="text-xs text-destructive">
				<Icon icon="lucide:alert-triangle" class="w-3 h-3 inline mr-1" />
				{card.error}
			</p>
		</div>
	{/if}
</Card>
