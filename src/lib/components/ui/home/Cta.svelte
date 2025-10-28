<script>
	import CTABanner from '$lib/assets/general/cta-layer.png';
	import { isLoggedIn } from '$lib/stores/authStore';
</script>

{#if !$isLoggedIn}
<section class="container relative mb-16 md:mb-[120px] mt-24 md:mt-[100px] px-4">
	<div
		class="bg-[#f2f4fb] py-12 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between rounded-lg shadow-xlg relative z-10"
	>
		<div class="text-center md:text-left">
			<h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
				Join Us
			</h2>
			<p class="text-gray-600 my-4 lg:my-6 text-lg sm:text-xl md:text-2xl max-w-2xl">
				We’re building the future of geo-intelligence — and we’re just getting started.
				Explore what Cyberglobes can do. Or get in touch to work, partner, or build with us.
			</p>
			<div class="mt-4 flex flex-col sm:flex-row gap-3">
				<a
					href="/contact-us"
					class="bg-primary text-white px-5 py-2 rounded-md shadow-md hover:bg-primary-700 text-sm sm:text-base font-medium"
				>
					Contact Us
				</a>
				<a
					href="/try-demo"
					class="border border-gray-400 text-gray-700 px-5 py-2 rounded-md shadow-sm hover:bg-gray-200 text-sm sm:text-base font-medium"
				>
					Try the Agent
				</a>
			</div>
		</div>
	</div>

	<!-- Responsive Image -->
	<div
		class="absolute right-0 bottom-0 w-[50vw] max-w-[250px] sm:max-w-[300px] md:max-w-[400px] z-10 hidden lg:block"
	>
		<img src={CTABanner} alt="Placer.ai Illustration" class="w-full h-auto" />
	</div>
</section>
{/if}
