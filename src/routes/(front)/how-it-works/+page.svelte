<script>
	import DifferenceCard from '$lib/components/ui/about-us/DifferenceCard.svelte';
	import Icon from '@iconify/svelte';
	import AISearch from '$lib/assets/elements/ai-search.png';
	import SearchByAddress from '$lib/assets/elements/search-by-address.png';
	import SearchByImage from '$lib/assets/elements/search-by-image.jpg';
	import AdditionalSearch from '$lib/assets/elements/additional-search.jpg';
	import Cta from '$lib/components/ui/home/Cta.svelte';

	const features = [
		{
			number: '01',
			title: ' It All Starts With Your Request',
			description:
				"When you type a question or make a request to our agent, our system immediately starts to work. It doesn't rely on outdated data or pre-written responses, instead, it searches the entire web for the most relevant, real-time information that matches what you're asking. Whether it's finding a nearby event, checking if a business is open, or discovering trending spots, we pull fresh data that matters right now."
		},
		{
			number: '02',
			title: 'Real-Time Data Collection',
			description:
				"Once we know what you’re looking for, our engine scans thousands of sources, social media, news, location feeds, public databases, updated datasets, and much more, to gather accurate, up-to-now information. Based on the type of query, we focus on the data that makes the biggest difference. For example, if you’re asking about an event, we look at who’s talking about it, where it's happening, and whether it's still active."
		},
		{
			number: '03',
			title: 'Training Our AI-Model to Understand your Location',
			description:
				'After processing, the refined data is passed into our advanced AI models including our large language model (referred as LLM) and our visual map AI. These systems work together to understand both text and geography, allowing us to give you not just a written answer, but a smart visual just like a map, list, or live view.'
		},
		{
			number: '04',
			title: 'Smart Data Processing',
			description:
				'We don’t just collect data - we refine it. Cyberglobes uses advanced AI techniques like fake content detection, photo-to-text recognition, and behavior analysis to ensure the data is trustworthy and useful. This step helps remove spam, fake news, or misleading info, so what you see is not only accurate but, 100% relevant.'
		},
		{
			number: '05',
			title: 'Staying Updated in Real-Time',
			description:
				"What makes Cyberglobes different is that it doesn't stop after the first answer. You can even use this system to create your own AI assistant trained to answer any question about any place in the world, using real-time data. <br> Our platform allows you to connect your AI or chatbot via webhooks, which means it can send real-time updates or alerts when something changes. If there's traffic near a venue, a price drop, or threatening event your own AI can notify you the moment it happens."
		}
	];
</script>

<section class="py-8 bg-white sm:py-10 lg:py-16">
	<div class="px-4 mx-auto container sm:px-6 lg:px-8">
		<div class="text-center max-w-5xl mx-auto">
			<h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-900 leading-tight mb-6">
				How It Works: AI-Powered,<br class="hidden md:block" /> Location-Based Search
			</h1>
			<p class="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto sm:mt-8">
				Cyberglobes gives you access to live, <strong class="text-primary-700"
					>real-world intelligence</strong
				> through multiple search modes — whether you're asking a question, exploring a location, or
				uploading a photo. Each search connects to real-time data from the ground and brings back results
				that are visual, dynamic, and geo-aware.
			</p>
		</div>
		<div
			class="grid grid-cols-1 mt-10 text-center sm:mt-16 sm:grid-cols-2 sm:gap-x-12 gap-y-12 md:grid-cols-3 md:gap-10 xl:mt-24"
		>
			{#each features as feature}
				<DifferenceCard
					number={feature.number}
					title={feature.title}
					description={feature.description}
				/>
			{/each}
		</div>
	</div>
</section>

<section class="bg-gray-50 dark:bg-black pt-24 pb-5">
	<div class="container mx-auto">
		<!-- Header -->
		<div class="text-center mb-20">
			<h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-900 leading-tight mb-6">
				Discover the World Differently
			</h2>
			<p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
				Cyberglobes uses real-time intelligence to answer location-based questions, giving you
				interactive answers powered by live data and visual analysis.
			</p>
		</div>

		<!-- Steps Section -->
		<div>
			<!-- Step 1 -->
			<div class="md:bg-white bg-transparent md:p-8 p-6 rounded-xl flex flex-col md:flex-row items-center gap-10 text-[16px] shadow-xl">
				<div class="md:w-1/2">
					<h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
						Agent Search – Ask Anything
					</h3>
					<p class="text-gray-600 dark:text-gray-300 mb-4">
						Start by asking a question in plain language — no filters, no categories, no formatting
						needed.<br /> <strong>Examples:</strong>
					</p>
					<ul class="pl-5 text-gray-900 dark:text-gray-400 space-y-1 font-bold mb-4">
						<li>“Where’s the best vegan ramen near me right now?”</li>
						<li>“What’s happening in Lisbon this weekend?”</li>
						<li>“Quiet running routes in Berlin with lake views?”</li>
					</ul>
					<p class="text-gray-600 dark:text-gray-300 mb-4">
						The Cyberglobes agent interprets your intent, activates real-time data sources, and
						pulls signals from live movement, behavior, reviews, posts, and public activity. Instead
						of showing static results, it delivers
						<strong class="text-primary-700">interactive, location-aware answers</strong> that
						reflect what’s happening <strong class="text-primary-700">right now</strong>.
					</p>
					<p class="text-gray-600 dark:text-gray-300 mb-4">
						You can chat with the agent to refine or redirect your search, then:
					</p>
					<ul class="list-disc ml-4 pl-5 text-gray-900 dark:text-gray-400 space-y-1 font-bold mb-4">
						<li>Explore results on a live, interactive map</li>
						<li>Save your searches for later</li>
						<li>Export results as a report for sharing or planning</li>
					</ul>
				</div>
				<div class="md:w-1/2">
					<img src={AISearch} alt="Search" style="mix-blend-mode: multiply;"  />
				</div>
			</div>

			<!-- Step 2 -->
			<div class="md:bg-white bg-transparent md:p-8 p-6 rounded-xl flex flex-col-reverse md:flex-row items-center gap-10 mt-16 text-[16px] shadow-xl">
				<div class="md:w-1/2">
					<img src={SearchByAddress} alt="Search" style="mix-blend-mode: multiply;"  />
				</div>
				<div class="md:w-1/2">
					<h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
						Search by Address or Coordinates
					</h3>
					<p class="text-gray-600 dark:text-gray-300 mb-4">
						Want insights about a specific location — even if you’re not there?
						<br />
						Just enter an address, city, or exact coordinates. Cyberglobes instantly analyzes what’s
						currently happening there by collecting:
					</p>
					<ul class="list-disc pl-5 ml-4 text-gray-900 font-bold dark:text-gray-400 space-y-1 mb-4">
						<li>Local activity data</li>
						<li>Foot traffic heatmaps</li>
						<li>Nearby businesses, events, and sentiment</li>
						<li>Safety and infrastructure patterns</li>
					</ul>

					<p class="text-gray-600 dark:text-gray-300 mb-4">
						You can explore the results through the map interface, add notes or filters, and then:
					</p>

					<ul class="list-disc pl-5 ml-4 text-gray-900 font-bold dark:text-gray-400 space-y-1 mb-4">
						<li>Save the area as a watchlist or recurring scan</li>
						<li>Export a location report with maps, charts, and trends</li>
					</ul>

					<p class="text-gray-600 dark:text-gray-300 mb-4">
						Ideal for planners, researchers, businesses, and remote decision-makers.
					</p>
				</div>
			</div>

			<!-- Step 3 -->
			<div class="md:bg-white bg-transparent md:p-8 p-6 rounded-xl flex flex-col md:flex-row items-center gap-10 mt-16 text-[16px] shadow-xl">
				<div class="md:w-1/2">
					<h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Search by Image</h3>
					<p class="text-gray-600 dark:text-gray-300 mb-4">
						Upload an image — a photo of a market street, a beach, a building, or a meal.
						Cyberglobes uses visual intelligence to:
					</p>
					<ul class="list-disc pl-5 ml-4 font-bold text-gray-900 dark:text-gray-400 space-y-1 mb-4">
						<li>Identify objects, text, landmarks, or places</li>
						<li>Match visual features to geo-tagged data</li>
						<li>Pinpoint a location or offer similar real-time spots nearby</li>
					</ul>
					<p class="text-gray-600 dark:text-gray-300 mb-4">
						Once matched, the system overlays live data from that area, so you can:
					</p>
					<ul class="list-disc pl-5 ml-4 font-bold text-gray-900 dark:text-gray-400 space-y-1 mb-4">
						<li>
							Explore live results on map with overlays for activity, crowd density, and trending
							points of interest
						</li>
						<li>MSave searches to revisit or track areas over time</li>
						<li>Export detailed reports with visuals, insights, and location trends</li>
					</ul>
					<p class="text-gray-600 dark:text-gray-300 mb-4">
						Great for content creators, tourists, investigators, or visual-first explorers.
					</p>
				</div>
				<div class="md:w-1/2">
					<img src={SearchByImage} alt="Search" style="mix-blend-mode: multiply;"  />
				</div>
			</div>

			<!-- Step 4 -->
			<div class="md:bg-white bg-transparent md:p-8 p-6 rounded-xl flex flex-col-reverse md:flex-row items-center gap-10 mt-16 mb-20 text-[16px] shadow-xl">
				<div class="md:w-1/2">
					<img src={AdditionalSearch} alt="Search" style="mix-blend-mode: multiply;"  />
				</div>
				<div class="md:w-1/2">
					<h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
						Additional Capabilities for All Searches
					</h3>
					<ul class="list-disc pl-5 ml-4 text-gray-900 font-bold dark:text-gray-400 space-y-1 mb-4">
						<li>Explore live results on map with overlays for activity, crowd density, and trending points of
interest</li>
						<li>Save searches to revisit or track areas over time</li>
						<li>Export detailed reports with visuals, insights, and location trends</li>
					</ul>
					<p class="text-gray-600 dark:text-gray-300 mb-4">
						Behind every search, Cyberglobes brings together AI understanding, spatial data, and real-time signals
to give you what traditional tools can’t:   
                        <strong class="text-primary-700">A live pulse of the world — visual, dynamic, and built for action</strong>.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
<Cta />