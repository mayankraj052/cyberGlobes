<script>
	import { fade } from 'svelte/transition';
	import {
		toastMessage,
		toastType,
		hideToast,
		TOAST_POSITION,
		toastPosition
	} from '$lib/stores/toastStore';
	let type = 'success';
	const toastConfig = {
		success: {
			icon: `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>`
		},
		error: {
			icon: `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                </svg>`
		}
	};

	$: positionClass = () => {
		if ($toastPosition === TOAST_POSITION.TOP_LEFT) return 'top-5 left-5';
		if ($toastPosition === TOAST_POSITION.TOP_RIGHT) return 'top-5 right-5';
		if ($toastPosition === TOAST_POSITION.TOP_CENTER)
			return 'top-5 left-1/2 transform -translate-x-1/2';
		if ($toastPosition === TOAST_POSITION.BOTTOM_LEFT) return 'bottom-5 left-5';
		if ($toastPosition === TOAST_POSITION.BOTTOM_RIGHT) return 'bottom-5 right-5';
		if ($toastPosition === TOAST_POSITION.BOTTOM_CENTER)
			return 'bottom-5 left-1/2 transform -translate-x-1/2';
		return '';
	};
</script>

{#if $toastMessage}
	<div transition:fade class="z-100">
		<div
			id="toast-{type}"
			class={`z-100 fixed flex items-center w-full max-w-xs p-4 mb-4 dark:text-gray-500 dark:bg-white rounded-lg shadow text-gray-400 bg-gray-800 ${positionClass()}`}
			role="alert"
		>
			<div
				class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 dark:text-green-500 dark:bg-green-100 rounded-lg bg-green-800 text-green-200"
			>
				{@html toastConfig[$toastType].icon}
			</div>
			<div class="ms-3 text-sm font-normal">{$toastMessage}</div>
			<button
				on:click={() => hideToast()}
				type="button"
				class="ms-auto -mx-1.5 -my-1.5 dark:bg-white dark:text-gray-400 dark:hover:text-gray-900 rounded-lg focus:ring-2 dark:focus:ring-gray-300 p-1.5 dark:hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700"
				aria-label="Close"
			>
				<span class="sr-only">Close</span>
				<svg
					class="w-3 h-3"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 14 14"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
					/>
				</svg>
			</button>
		</div>
	</div>
{/if}
