<script type="ts">
	import CompareAi from '$lib/assets/elements/compare-ai.png';
	import RealTime from '$lib/assets/elements/real-time.jpg';
	import RealTimeWeb from '$lib/assets/elements/real-time-web.jpg';
</script>

<section class="py-24 relative xl:mr-0 lg:mr-5 mr-0">
	<div class="w-full container mx-auto">
		<h2
			class="text-3xl sm:text-4xl text-center md:text-5xl font-bold text-primary-900 leading-tight mb-20 md:mb-36"
		>
			“We’re Breaking The Limit”
		</h2>

		<div class="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
			<div class="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
				<div class="w-full flex-col justify-center items-start gap-8 flex">
					<div class="flex-col justify-start lg:items-start items-center gap-4 flex">
						<div class="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
							<h2
								class="text-2xl sm:text-4xl md:text-3xl font-bold text-gray-900 leading-tight lg:text-start text-center"
							>
								One of the biggest challenges with all AI models is their limited access to
								real-time information.
							</h2>
							<p
								class="text-gray-600 text-lg font-normal leading-relaxed lg:text-start text-center"
							>
								Most large language models rely heavily on pretrained datasets—huge collections of
								text from books, websites, and forums. While this gives them strong language skills,
								it also means they are frozen in time. Their understanding of the world is limited
								to the data available at the moment of training. After that, they’re often cut off,
								unable to learn from anything new unless explicitly updated. While some models offer
								web search plugins or APIs to patch this gap, their knowledge still leans heavily on
								a static, limited worldview. This introduces blind spots, especially for dynamic or
								fast-evolving domains.
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="w-full lg:justify-start justify-center items-start flex">
				<div class="h-full sm:bg-gray-100 rounded-3xl sm:border border-gray-200 p-4">
					<img class="rounded-3xl object-cover" src={RealTime} alt="about Us image" style="mix-blend-mode: multiply;" />
				</div>
			</div>
		</div>

		<div
			class="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1 py-36"
		>
			<div class="w-full lg:justify-start justify-center items-start flex order-2 md:order-1">
				<div class="sm:bg-gray-100 rounded-3xl sm:border border-gray-200 p-4">
					<img class="rounded-3xl object-cover" src={RealTimeWeb} alt="about Us image" />
				</div>
			</div>
			<div class="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex order-1 md:order-2">
				<div class="w-full flex-col justify-center items-start gap-8 flex">
					<div class="flex-col justify-start lg:items-start items-center gap-4 flex">
						<div class="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
							<h2
								class="text-2xl sm:text-4xl md:text-3xl font-bold text-gray-900 leading-tight lg:text-start text-center"
							>
								Language Models Aren’t Built for the Real-Time Web
							</h2>
							<p
								class="text-gray-600 text-lg font-normal leading-relaxed lg:text-start text-center"
							>
								Natural language is fluid, context-rich, and always changing. Pretrained models can
								only guess the next word based on patterns from their past training, without direct
								awareness of breaking news, updated information, or shifting online sentiment. Even
								with web search plugins, their reach is limited, querying a few links is not the
								same as being fully integrated with the live web. Real-time systems, in contrast,
								can ingest and reason over data as it happens, combining structured sources, live
								feeds, APIs, and even social media to create a living intelligence layer that
								evolves constantly.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
			<div class="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
				<div class="w-full flex-col justify-center items-start gap-8 flex">
					<div class="flex-col justify-start lg:items-start items-center gap-4 flex">
						<div class="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
							<h2
								class="text-2xl sm:text-4xl md:text-3xl font-bold text-gray-900 leading-tight lg:text-start text-center"
							>
								The Efficient Compute Frontier
							</h2>
							<p
								class="text-gray-600 text-lg font-normal leading-relaxed lg:text-start text-center"
							>
								As AI models grow larger and are trained on more data, they usually become more
								accurate, but only up to a certain point. This point is known as ‘the efficient
								compute frontier’. Beyond it, any amount of data or even massive increases in
								computing power won’t lead to significant improvements.
							</p>
							<p
								class="text-gray-600 text-lg font-normal leading-relaxed lg:text-start text-center"
							>
								Researchers have found that this pattern repeats across different models and tasks,
								no matter which architecture or training method is used. It’s part of a broader set
								of patterns called neural scaling laws, which show how closely performance is tied
								to data, model size, and computation.
							</p>
							<p
								class="text-gray-600 text-lg font-normal leading-relaxed lg:text-start text-center"
							>
								What’s still unclear is whether this performance limit is a hard rule of nature, or
								just a result of how current AI models were built and trained.
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="w-full lg:justify-start justify-center items-start flex">
				<div class="h-full sm:bg-gray-100 rounded-3xl sm:border border-gray-200 p-4">
					<img class="rounded-3xl object-cover" src={CompareAi} alt="about Us image" />
				</div>
			</div>
		</div>
	</div>
</section>
