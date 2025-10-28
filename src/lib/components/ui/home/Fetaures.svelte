<script>
	import WhoWeAre from "../about-us/WhoWeAre.svelte";
	const industries = [
		{ icon: 'basil:location-outline', title: 'Find Trending Events Near You' },
		{ icon: 'gravity-ui:tag', title: 'Compare Prices Across Locations' },
		{ icon: 'mdi:map-marker-star-outline', title: 'Discover Local Hidden Gems' },
		{ icon: 'mdi:walk', title: 'Analyze Foot Traffic in Real Time' },
		{ icon: 'mdi:map-marker-path', title: 'Create Smart Routes & Reports' },
		{ icon: 'mdi:shield-check', title: 'Plan Safe, Efficient Travel' },
		{ icon: 'mdi:map-marker-radius', title: 'Monitor Neighborhood Activity' },
		{ icon: 'mdi:account-group-outline', title: 'Track Tourist vs. Local Behavior' }
	];
</script>
<section class="container mx-auto py-0 md:py-20 text-center">
	<h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-900 leading-tight">
		Market Intelligence<br />for Your Industry
	</h2>
	<p class="text-gray-500 text-lg my-8 max-w-xl mx-auto">
		Leverage Placer's location analytics to unlock deep insights into locations, brands, and
		enterprises. Select your industry to learn more.
	</p>

	<!-- Grid Container -->
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8 max-w-5xl mx-auto">
		<!-- Industry Cards -->

		 {#each industries as industry, i}
                <div class="group transform transition-all duration-300 hover:-translate-y-2" style="animation-delay: {i * 100}ms">
                    <WhoWeAre 
                        icon={industry.icon}
                        title={industry.title}
                        bgHoverColor="hover:bg-primary-50 hover:border-primary-300"
                        textHoverColor="hover:text-primary-900"
                        iconColor="text-primary-600"
                        onClick={() => console.log(`Navigating to ${industry.title}`)}
                    />
                </div>
            {/each}

	</div>
</section>
