<script type="ts">
	import Polygon from '$lib/assets/elements/polygon-bg-element.svg';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	
	let videoContainer;
	let video;
	let isFullscreen = false;
	
	// Function to toggle fullscreen
	function toggleFullscreen() {
		if (!document.fullscreenElement) {
			// Enter fullscreen
			if (videoContainer.requestFullscreen) {
				videoContainer.requestFullscreen();
			} else if (videoContainer.webkitRequestFullscreen) { // Safari
				videoContainer.webkitRequestFullscreen();
			} else if (videoContainer.msRequestFullscreen) { // IE11
				videoContainer.msRequestFullscreen();
			}
			isFullscreen = true;
		} else {
			// Exit fullscreen
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.webkitExitFullscreen) { // Safari
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) { // IE11
				document.msExitFullscreen();
			}
			isFullscreen = false;
		}
	}
	
	// Monitor fullscreen changes
	onMount(() => {
		const handleFullscreenChange = () => {
			isFullscreen = !!document.fullscreenElement;
		};
		
		document.addEventListener('fullscreenchange', handleFullscreenChange);
		document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
		document.addEventListener('mozfullscreenchange', handleFullscreenChange);
		document.addEventListener('MSFullscreenChange', handleFullscreenChange);
		
		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
			document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
			document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
			document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
		};
	});
</script>

<section class="text-black md:py-20 py-10">
	<div class="container mx-auto flex flex-col-reverse lg:flex-row items-center gap-10">
		<!-- Text Content -->
		<div class="lg:w-1/2">
			<h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-900 leading-tight mb-6">
				Query the internet at scale
			</h1>
			<p class="text-lg text-gray-600 mb-4">
				<span class="text-black font-semibold">Welcome to Cyberglobes</span> – Your Ultimate Geo-Location
				AI-Agent
			</p>
			<p class="text-gray-800 text-[18px] mb-6">
				Cyberglobes bridges the gap in AI-driven search, delivering real-time, location-based data,
				designed for your needs. Search on your own or let our intelligent chatbot do the work. Stay
				ahead with the latest updates while others rely on outdated information.
			</p>
			<p class="text-gray-800 text-[18px] mb-8">
				Are you visiting a new city and looking for cool upcoming events? Looking for the best
				restaurants around you? Or just wanna know the price for Nike-Air in your block? Ask
				anything, and let him search for you
			</p>

		</div>

		<!-- Video / Animation Placeholder -->
		<div class="lg:w-1/2 w-full flex justify-center">
			<div>
				<div
					bind:this={videoContainer}
					id="intro-video"
					class="w-full aspect-video bg-gray-800 border-2 border-gray-700 rounded-lg flex items-center justify-center text-gray-500 text-lg relative group"
				>
					<video 
						bind:this={video} 
						class="w-full h-auto object-cover rounded-xl"
						autoplay 
						loop 
						muted
					>
						<source
							src="https://framerusercontent.com/assets/9jRcdX07q3bSLXhHxRqzX8QS0.mp4"
							type="video/mp4"
						/>
					</video>
					
					<!-- Custom Fullscreen Button -->
					<button 
						on:click={toggleFullscreen}
						class="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
						aria-label="Toggle fullscreen"
					>
						{#if isFullscreen}
							<Icon icon="mdi:fullscreen-exit" width="24" height="24" />
						{:else}
							<Icon icon="mdi:fullscreen" width="24" height="24" />
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
</section>
