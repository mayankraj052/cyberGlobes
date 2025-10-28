<script type="ts">
	import DifferenceCard from '../about-us/DifferenceCard.svelte';
	import AiComparison from './AIComparison.svelte';

	const models = [
		{
			name: 'Cyberglobes',
			trainingCutoff: 'Live, real-time',
			dataFreshness: 'Continuously updated',
			sourceDiversity: 'Thousands of live data sources: websites, APIs, datasets, social media',
			realTimeCapability: 'Yes',
			isCyberglobes: true
		},
		{
			name: 'ChatGPT (GPT-4)',
			trainingCutoff: 'April 2023 (est.)',
			dataFreshness: 'Static (periodically updated)',
			sourceDiversity: 'Internet, books, code',
			realTimeCapability: 'Limited (via plugins)',
			isCyberglobes: false
		},
		{
			name: 'Claude (Anthropic)',
			trainingCutoff: 'Early 2023 (Claude 2)',
			dataFreshness: 'Static',
			sourceDiversity: 'Curated internet + documents',
			realTimeCapability: 'No',
			isCyberglobes: false
		},
		{
			name: 'DeepSeek',
			trainingCutoff: '2023',
			dataFreshness: 'Static',
			sourceDiversity: 'Web + code datasets',
			realTimeCapability: 'No',
			isCyberglobes: false
		},
		{
			name: 'Gemini (Google)',
			trainingCutoff: 'December 2023',
			dataFreshness: 'Partially updated',
			sourceDiversity: 'Google-indexed web + internal datasets',
			realTimeCapability: 'Partial (search-augmented)',
			isCyberglobes: false
		}
	];

	const features = [
		{
			number: '01',
			title: 'Pretrained Doesn’t Mean Prepared',
			description:
				'What these comparisons show is that even the most advanced AI models are only as current as the last time they were trained. This limits their relevance in fields like finance, politics, e-commerce, or geolocation, where data changes hourly, not annually. It’s like navigating with a printed map in a world that moves at digital speed. <br> <br> Real-time systems fundamentally shift this paradigm. By connecting directly to thousands of active data sources—websites, APIs, public datasets, social feeds—they can respond to new information as it unfolds, not yesterday’s news.'
		},
		{
			number: '02',
			title: 'The Future Belongs to Live Intelligence',
			description:
				"True intelligence isn’t just about size or training—it’s about timing. In a world where decisions depend on fast-moving data, systems that learn once and stop are quickly left behind. Real-time AI offers a model that listens, updates, and adapts continuously. It doesn’t need to guess based on stale patterns—it can see what’s happening now. This shift from static to streaming intelligence will define the next generation of AI—and it's already happening in systems built for real-time insight from the ground up."
		}
	];
</script>

<AiComparison />
<section class="pb-10">
	<div class="container mx-auto">

		<div
			class="grid grid-cols-1 text-center sm:grid-cols-2 sm:gap-x-12 gap-y-12 md:grid-cols-2 md:gap-10"
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
