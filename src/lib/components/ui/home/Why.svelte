<script type="ts">
	import Autoplay from 'embla-carousel-autoplay';

	import * as Carousel from '$lib/components/ui/carousel/index.ts';

	import AiModals from './AIModals.svelte';
	import OtherAI from '$lib/assets/elements/other-ai.jpg';
	import CyberGlobs from '$lib/assets/elements/cyberglobs.jpg';

	let api;
	let current = 0;
	let count = 0;

	const plugin = Autoplay({ delay: 3000, stopOnInteraction: true });

	// When component mounts, initialize carousel tracking
	$: if (api) {
		count = api.scrollSnapList().length;
		current = api.selectedScrollSnap();

		// Update active dot when carousel slides
		api.on('select', () => {
			current = api.selectedScrollSnap();
		});
	}

	const features = [
		{
			gradient: true,
			icon: '🌍',
			title: 'Real-Time Geospatial Intelligence',
			text: 'Gain instant access to real-world movement and activity trends.'
		},
		{
			gradient: false,
			icon: '🔍',
			title: 'OSINT-Driven Insights',
			text: 'Harness public data sources, social media analytics, and AI-driven pattern recognition.'
		},
		{
			gradient: true,
			icon: '🚨',
			title: 'Threat Detection & Counter-Terrorism',
			text: 'Identify potential threats before they escalate.'
		},
		{
			gradient: false,
			icon: '🚶‍♂️',
			title: 'Foot Traffic & Behavioral Analytics',
			text: 'Understand crowd movements in high-risk zones.'
		},
		{
			gradient: true,
			icon: '📊',
			title: 'Predictive Intelligence & Risk Assessment',
			text: 'Forecast security risks, plan response strategies, and prevent incidents.'
		},
		{
			gradient: false,
			icon: '🔗',
			title: 'Seamless Integration',
			text: 'Connect to existing surveillance, security, and monitoring platforms.'
		}
	];
</script>

<AiModals />

<section class="px-6 py-20">
	<div class="container mx-auto ">
	<h2 class="text-3xl sm:text-4xl text-center md:text-5xl font-bold text-primary-900 leading-tight">
		Why CyberGlobes.ai?
	</h2>
	<p
		class="mt-4 text-lg text-gray-600 text-center dark:text-gray-300 max-w-4xl mx-auto sm:mt-8 mb-10 md:mb-8"
	>
		Unlike platforms that rely on static maps or stale information, Cyberglobes connects you to the
		living, breathing reality of any location.
	</p>

	<div class="md:grid grid-cols-2 gap-8 mb-10 max-w-3xl mx-auto hidden md:block">
		<div class="flex flex-col items-center">
			<p class="text-lg text-primary-900 font-bold text-center dark:text-gray-300 my-4">
				Other AI.
			</p>
			<img src={OtherAI} alt="Other AI" class="w-full h-auto" />
		</div>
		<div class="flex flex-col items-center">
			<p class="text-lg text-primary-900 font-bold text-center dark:text-gray-300 my-4">
				CyberGlobes AI.
			</p>
			<img src={CyberGlobs} alt="CyberGlobes" class="w-full h-auto" />
		</div>
	</div>

	<Carousel.Root
		bind:api
		class="block md:hidden w-full"
		plugins={[plugin]}
		options={{ loop: true, align: 'start', dragFree: true }}
	>
		<Carousel.Content class="flex gap-6 mb-10">
			<Carousel.Item class="min-w-full flex justify-center">
				<div class="flex flex-col items-center">
					<p class="text-lg text-primary-900 font-bold text-center dark:text-gray-300 my-4">
						Other AI.
					</p>
					<img src={OtherAI} alt="Other AI" class="w-full h-auto" />
				</div>
				<div class="flex flex-col items-center">
					<p class="text-lg text-primary-900 font-bold text-center dark:text-gray-300 my-4">
						CyberGlobes AI.
					</p>
					<img src={CyberGlobs} alt="CyberGlobes" class="w-full h-auto" />
				</div>
			</Carousel.Item>
		</Carousel.Content>
	</Carousel.Root>

	<p class="text-lg text-gray-600 text-center dark:text-gray-300 max-w-4xl mx-auto mb-10">
		We don’t just show you where something is, we reveal what’s actually happening there in real
		time. By analyzing live movement patterns, user behavior, environmental signals, and digital
		activity, Cyberglobes delivers fresh, context-rich insights that reflect the true state of any
		place, moment by moment. Whether you're tracking a trend, planning a visit, or investigating an
		area, you get dynamic, reliable data—not yesterday’s headlines.
	</p>

	<!-- Mobile Carousel -->
	<Carousel.Root
		bind:api
		class="block md:hidden w-full"
		plugins={[plugin]}
		options={{ loop: true, align: 'start', dragFree: true }}
	>
		<Carousel.Content class="flex gap-6">
			{#each features as card}
				<Carousel.Item class="min-w-full flex justify-center">
					<div
						class="p-8 rounded-2xl shadow-lg flex flex-col items-center text-center gap-4 w-full"
						class:bg-gradient-to-r={card.gradient}
						class:from-blue-500={card.gradient}
						class:to-blue-400={card.gradient}
						class:bg-blue-100={!card.gradient}
						class:text-white={card.gradient}
						class:text-gray-900={!card.gradient}
					>
						<span class="text-6xl">{card.icon}</span>
						<div>
							<h3 class="text-2xl font-semibold mb-2">{card.title}</h3>
							<p class="text-lg opacity-90">{card.text}</p>
						</div>
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
	</Carousel.Root>

	<!-- Custom Navigation Dots -->
	<div class="flex justify-center mt-6 md:hidden">
		{#each features as _, index}
			<button
				class="h-2 w-2 mx-1 rounded-full transition-all duration-300"
				class:bg-gray-400={current !== index}
				class:bg-blue-500={current === index}
			>
			</button>
		{/each}
	</div>

	<!-- Desktop Grid Layout -->
	<div class="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
		{#each features as card}
			<div
				class="p-8 rounded-2xl shadow-lg flex items-start gap-6"
				class:bg-gradient-to-r={card.gradient}
				class:from-blue-500={card.gradient}
				class:to-blue-400={card.gradient}
				class:bg-blue-100={!card.gradient}
				class:text-white={card.gradient}
				class:text-gray-900={!card.gradient}
			>
				<span class="text-5xl">{card.icon}</span>
				<div>
					<h3 class="text-2xl font-semibold mb-2">{card.title}</h3>
					<p class="text-lg opacity-90">{card.text}</p>
				</div>
			</div>
		{/each}
	</div>
	</div>
</section>
