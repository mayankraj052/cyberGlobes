<script>
	import PARTNERS from '$lib/constants/partners';
	import Autoplay from 'embla-carousel-autoplay';
	import * as Carousel from '$lib/components/ui/carousel/index.ts';

	// Auto-scroll plugin with continuous loop
	const plugin = Autoplay({ delay: 1000, stopOnInteraction: false });
</script>

<section class="py-20">
	<div class="lg:container md:container">
		<div>
			<h2 class="md:text-start text-center text-gray-500 text-xl">
				Loved and Trusted by 100+ Customers
			</h2>
		</div>
		<div class="py-6 mx-auto max-w-screen-xl px-0 md:px-4">
			<!-- Logos Grid (for larger screens) & Carousel (for mobile) -->
			<Carousel.Root
				plugins={[plugin]}
				class="w-full"
				on:mouseenter={plugin.stop}
				on:mouseleave={plugin.reset}
				options={{ loop: true, align: 'start', dragFree: true }}
			>
				<Carousel.Content class="flex flex-nowrap md:grid md:grid-cols-4 lg:grid-cols-8 gap-6">
					{#each Object.values(PARTNERS) as partner}
						<Carousel.Item class="basis-auto md:basis-1/4 lg:basis-1/8 flex justify-center">
							<div
								class="flex justify-center items-center hover:text-gray-900 dark:hover:text-white"
							>
								<img
									src={partner.logo}
									alt={partner.title}
									class="h-14 max-h-14 w-auto object-contain p-2 rounded-lg"
								/>
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
			</Carousel.Root>
		</div>
	</div>
</section>
