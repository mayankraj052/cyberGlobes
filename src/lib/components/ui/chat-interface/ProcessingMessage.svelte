<script lang="ts">
import { onMount } from 'svelte';
import { fade } from 'svelte/transition';
import Icon from '@iconify/svelte';
 
export let content: string = '';
export let isComplete: boolean = false;
export let steps: Array<any> = [];
 
let showMessage = false;
 
$: displayText = content;
 
onMount(() => {
    showMessage = true;
});
 
function getStepClasses(step: any) {
    let titleClass = 'font-semibold mb-1 flex items-start gap-2';
    let borderClass = 'border-l-2';
    let iconClass = 'w-full max-w-[16px] mt-1';
    let statusIcon = step.icon || 'lucide:circle';
   
    switch (step.status) {
        case 'completed':
            titleClass += ' text-primary';
            borderClass += ' border-primary/20';
            iconClass += ' text-primary';
            if (!step.icon) statusIcon = 'lucide:check';
            break;
        case 'inprogress':
            titleClass += ' text-primary animate-pulse';
            borderClass += ' border-primary/20';
            iconClass += ' text-primary animate-spin';
            if (!step.icon) statusIcon = 'lucide:loader-2';
            break;
        case 'error':
        case 'failed':
            titleClass += ' text-red-600 dark:text-red-400';
            borderClass += ' border-red-200 dark:border-red-800';
            iconClass += ' text-red-600 dark:text-red-400';
            if (!step.icon) statusIcon = 'lucide:x';
            break;
        case 'todo':
        default:
            titleClass += ' text-gray-500 dark:text-gray-400';
            borderClass += ' border-gray-200 dark:border-gray-700';
            iconClass += ' text-gray-500 dark:text-gray-400 opacity-70';
            if (!step.icon) statusIcon = 'lucide:circle';
            break;
    }
 
    return { titleClass, borderClass, iconClass, statusIcon };
}
 
function formatContent(text: string): string {
    const textSteps = text.split('\n\n');
    return textSteps.map((step, index) => {
        const lines = step.split('\n');
        const title = lines[0];
        const description = lines.slice(1).join(' ');
 
        const isCurrentStep = index === textSteps.length - 1;
        const shimmerClass = (isCurrentStep && !isComplete) ? 'shimmer-text' : '';
 
        const formattedTitle = title.replace(/\*\*(.*?)\*\*/g, `<div class="font-semibold text-primary mb-1 ${shimmerClass}">$1</div>`);  
        const formattedDescription = description ? `<div class="text-muted-foreground text-xs leading-relaxed pl-2 border-l-2 border-primary/20">${description}</div>` : '';
 
        return `<div class="mb-4">${formattedTitle}${formattedDescription}</div>`;
    }).join('');
}
</script>
 
{#if showMessage}
<div class="flex justify-start mb-6" in:fade={{ duration: 400 }}>
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-6 max-w-2xl border border-blue-200/50 dark:border-blue-800/30 shadow-sm">
        <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Icon icon="lucide:zap" class="w-4 h-4 text-primary {isComplete ? '' : 'animate-pulse'}" />
            </div>
            <div class="flex-1 text-sm leading-relaxed space-y-4">
                {#if steps && steps.length > 0}
                    {#each steps as step, index (step.title + index)}
                        {@const classes = getStepClasses(step)}
                        <div class="mb-4">
                            <div class={classes.titleClass}>
                                <Icon icon={classes.statusIcon} class={classes.iconClass} width={16} height={16} />
                                <span>{step.title}</span>
                            </div>
                            {#if step.description}
                                <div class="text-muted-foreground text-xs leading-relaxed pl-2 {classes.borderClass}">
                                    {step.description}
                                </div>
                            {/if}
                           <!-- STATUS & ACTION SECTION -->
	{#if step.status}
	<div class="pl-6 mt-2 text-xs leading-relaxed space-y-1">
		
		{#if step.status === 'todo'}
		<p class="text-yellow-600 dark:text-yellow-400">
			🟡 Status: Waiting to start...
		</p>

		{:else if step.status === 'inprogress' || step.status === 'processing'}
		<p class="text-blue-600 dark:text-blue-400 animate-pulse">
			🔵 Status: Processing...
		</p>

		{:else if step.status === 'completed'}
	<!-- ✅ Side-by-side layout -->
	<div class="pl-2 mt-1 text-xs leading-relaxed">
		<div class="flex items-center gap-3 flex-wrap">
		<!-- Status -->
		<p class="text-green-600 dark:text-green-400 m-0">
			🟢 Status: Completed
		</p>

		<!-- ✅ Show download link for all completed steps AFTER step 1 -->
		{#if index > 1} <!-- index 0,1 = system steps; index 2 = Step 1 -->
			<a
			href={step.json_data || 'https://backend.cyberglobes.ai/api/v1/scripter/analyze-step-status'}
			target="_blank"
			rel="noopener noreferrer"
			class="text-blue-500 underline hover:text-blue-600 transition-colors inline-flex items-center gap-1"
			>
			🔽 download
			</a>
		{/if}
		</div>
	</div>


		{:else if step.status === 'failed' || step.status === 'error'}
		<p class="text-red-600 dark:text-red-400">
			🔴 Status: Failed
		</p>
		{#if step.error_details}
			<div class="text-red-400 dark:text-red-300 pl-1">
			❌ {step.error_details}
			</div>
		{/if}
		{/if}
	</div>
	{/if}

                        </div>
                    {/each}
                {:else}
                    {@html formatContent(displayText)}
                {/if}
            </div>
        </div>
    </div>
</div>
{/if}
 
<style>
:global(.shimmer-text) {
background: linear-gradient(
90deg,
hsl(var(--primary)) 0%,
hsl(var(--muted-foreground)) 25%,
hsl(var(--primary)) 50%,
hsl(var(--muted-foreground)) 75%,
hsl(var(--primary)) 100%
);
background-size: 200% 100%;
background-clip: text;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
animation: shimmer 2s infinite ease-in-out;
font-weight: 600;
}
 
@keyframes shimmer {
0% {
background-position: -200% 0;
}
100% {
background-position: 200% 0;
}
}
</style>
 