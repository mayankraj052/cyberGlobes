<script lang="ts">
	export let isLoading: boolean;
	export let loadingText: string = 'Loading';
</script>

{#if isLoading}
	<div class="overlay">
		<div class="loading-icon">{loadingText} <span class="dots">.</span></div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}
	.loading-icon {
		color: white;
		font-size: 1.5rem;
	}

	.dots {
		display: inline-block;
		animation: dots 1s steps(5, end) infinite;
	}

	@keyframes dots {
		0%,
		20% {
			color: rgba(0, 0, 0, 0);
			text-shadow:
				0.25em 0 0 rgba(0, 0, 0, 0),
				0.5em 0 0 rgba(0, 0, 0, 0);
		}
		40% {
			color: white;
			text-shadow:
				0.25em 0 0 rgba(0, 0, 0, 0),
				0.5em 0 0 rgba(0, 0, 0, 0);
		}
		60% {
			text-shadow:
				0.25em 0 0 white,
				0.5em 0 0 rgba(0, 0, 0, 0);
		}
		80%,
		100% {
			text-shadow:
				0.25em 0 0 white,
				0.5em 0 0 white;
		}
	}
</style>
