<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.ts';
	import * as Card from '$lib/components/ui/card/index.ts';
	import { onMount, onDestroy } from 'svelte';
	import { intersection } from '$lib/utils/intersection';

	let activeTab = 'panoramas';
	const tabs = ['panoramas', 'revserse-lookup', 'social-media'];
	let progress = 0;
	let interval;
	let animationFrame = null;
	const DURATION = 20000; // 20 seconds

	function startProgress() {
		progress = 0;
		let startTime = performance.now();

		function animateProgress(time) {
			let elapsed = time - startTime;
			progress = Math.min((elapsed / DURATION) * 100, 100);

			if (progress < 100) {
				animationFrame = requestAnimationFrame(animateProgress);
			}
		}

		// Cancel previous animation before starting a new one
		if (animationFrame) cancelAnimationFrame(animationFrame);
		animationFrame = requestAnimationFrame(animateProgress);
	}

	function switchTab() {
		let index = tabs.indexOf(activeTab);
		index = (index + 1) % tabs.length;
		activeTab = tabs[index];
		startProgress();
	}

	function handleTabClick(value) {
		clearInterval(interval);
		interval = setInterval(switchTab, DURATION);
		startProgress();
	}

	onMount(() => {
		// startProgress();
		// interval = setInterval(switchTab, DURATION);
	});

	onDestroy(() => {
		clearInterval(interval);
		if (animationFrame) cancelAnimationFrame(animationFrame);
	});

	function handleEnter() {
		startProgress();
		interval = setInterval(switchTab, DURATION);
	}

	function handleLeave() {
		clearInterval(interval);
		if (animationFrame) cancelAnimationFrame(animationFrame);
	}
</script>

<section class="container" use:intersection on:enter={handleEnter} on:leave={handleLeave}>
	<!-- Smooth Progress Bar -->
	<div class="mx-auto bg-gray-200 h-1 dark:bg-gray-700 overflow-hidden">
		<div class="bg-blue-600 h-1" style="width: {progress}%"></div>
	</div>

	<Card.Root class="mx-auto p-4 rounded-t-none rounded-b-lg">
		<h2
			class="text-xl sm:text-2xl md:text-3xl font-bold max-w-3xl leading-tight mx-auto my-6 md:my-10 text-center"
		>
			Uncover Thriving Businesses & Industry Trends & essential intelligence by point of
			intelligence
		</h2>
		<Tabs.Root bind:value={activeTab} class="w-full">
			<Tabs.List
				class="grid grid-cols-1 sm:grid-cols-3 border-b h-auto sm:h-11 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg gap-2 sm:gap-0"
			>
				<Tabs.Trigger
					on:click={() => handleTabClick('panoramas')}
					class="text-white font-semibold rounded-md transition-all duration-300 ease-in-out px-4 py-2 text-center data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md"
					value="panoramas"
				>
					Panoramic Street
				</Tabs.Trigger>

				<Tabs.Trigger
					on:click={() => handleTabClick('revserse-lookup')}
					class="text-white font-semibold rounded-md transition-all duration-300 ease-in-out px-4 py-2 text-center data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md"
					value="revserse-lookup"
				>
					Reverse Lookup Services
				</Tabs.Trigger>

				<Tabs.Trigger
					on:click={() => handleTabClick('social-media')}
					class="text-white font-semibold rounded-md transition-all duration-300 ease-in-out px-4 py-2 text-center data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md"
					value="social-media"
				>
					Social Media Live Updates
				</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="panoramas">
				<Card.Content class="flex space-y-4 p-1 py-6">
					<div>
						<div class="grid grid-cols-1 md:grid-cols-5 gap-6">
							<div class="md:col-span-3 rounded-lg overflow-hidden shadow-lg">
								<video class="w-full h-auto sm:h-80 md:h-96 object-cover" autoplay loop muted>
									<source
										src="https://framerusercontent.com/assets/9jRcdX07q3bSLXhHxRqzX8QS0.mp4"
										type="video/mp4"
									/>
								</video>
							</div>
							<div class="md:col-span-2 space-y-4 text-center md:text-left">
								<h3 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
									High-Resolution Panoramic Street Data – Unlock a 360° View of the World
								</h3>
								<p class="text-sm sm:text-lg text-gray-700 mt-2">
									Access panoramic street-level imagery to power AI models, simulations, and
									geospatial analytics.
								</p>
								<p class="text-sm sm:text-lg text-gray-700 mt-2">
									CyberGlobes.ai provides high-quality panoramic street images that enable
									businesses, researchers, and AI developers to train autonomous systems, enhance
									simulations, and analyze real-world environments with unmatched precision.
								</p>
							</div>
						</div>
						<div class="text-center my-6 md:my-12 md:mt-12 mt-14">
							<h3 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">What You Get</h3>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div class="bg-white p-6 rounded-2xl shadow-md">
								<h2 class="text-lg font-semibold">📸 Panoramic Street-Level Imagery</h2>
								<ul class="mt-2 space-y-2">
									<li class="flex items-center">
										<span class="text-green-500 mr-2">✔</span> Full 360° panoramic views of streets
										worldwide.
									</li>
									<li class="flex items-center">
										<span class="text-green-500 mr-2">✔</span> Accurate visual data for urban environments,
										roads, and buildings.
									</li>
								</ul>
							</div>

							<div class="bg-white p-6 rounded-2xl shadow-md">
								<h2 class="text-lg font-semibold">🗺 Geo-Tagged Visual Intelligence</h2>
								<ul class="mt-2 space-y-2">
									<li class="flex items-center">
										<span class="text-green-500 mr-2">✔</span> Precise location metadata for mapping
										and analysis.
									</li>
									<li class="flex items-center">
										<span class="text-green-500 mr-2">✔</span> Seamless integration with GIS, AI models,
										and simulations.
									</li>
								</ul>
							</div>

							<div class="bg-white p-6 rounded-2xl shadow-md">
								<h2 class="text-lg font-semibold">🤖 AI Training & Autonomous Navigation</h2>
								<ul class="mt-2 space-y-2">
									<li class="flex items-center">
										<span class="text-green-500 mr-2">✔</span> Train AI models to understand real-world
										streets.
									</li>
									<li class="flex items-center">
										<span class="text-green-500 mr-2">✔</span> Use data for robotics and autonomous
										vehicle development.
									</li>
								</ul>
							</div>

							<div class="bg-white p-6 rounded-2xl shadow-md">
								<h2 class="text-lg font-semibold">📊 Customizable Data Delivery</h2>
								<ul class="mt-2 space-y-2">
									<li class="flex items-center">
										<span class="text-green-500 mr-2">✔</span> Request specific regions and tailor datasets.
									</li>
									<li class="flex items-center">
										<span class="text-green-500 mr-2">✔</span> Supports bulk retrieval for large-scale
										AI projects.
									</li>
								</ul>
							</div>
						</div>
						<div class="text-center my-6 md:my-12 md:mt-12 mt-14">
							<h3 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
								Who Uses Panoramic Street Data?
							</h3>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div class="bg-white p-6 rounded-2xl shadow-md flex items-center">
								<span class="text-blue-500 text-2xl mr-4">🔹</span>
								<p>
									<strong>Autonomous Vehicle & Robotics Development –</strong> Train AI models to recognize
									roads, obstacles, and street layouts for real-world navigation.
								</p>
							</div>
							<div class="bg-white p-6 rounded-2xl shadow-md flex items-center">
								<span class="text-blue-500 text-2xl mr-4">🔹</span>
								<p>
									<strong>Smart City & Urban Planning –</strong> Enhance traffic analysis, infrastructure
									monitoring, and city development projects.
								</p>
							</div>
							<div class="bg-white p-6 rounded-2xl shadow-md flex items-center">
								<span class="text-blue-500 text-2xl mr-4">🔹</span>
								<p>
									<strong>GIS & Mapping Applications –</strong> Improve location intelligence and geospatial
									visualization.
								</p>
							</div>
							<div class="bg-white p-6 rounded-2xl shadow-md flex items-center">
								<span class="text-blue-500 text-2xl mr-4">🔹</span>
								<p>
									<strong>Augmented Reality (AR) & Gaming –</strong> Use panoramic street data to create
									immersive 3D environments.
								</p>
							</div>
							<div class="bg-white p-6 rounded-2xl shadow-md flex items-center">
								<span class="text-blue-500 text-2xl mr-4">🔹</span>
								<p>
									<strong>AI & Machine Learning Research –</strong> Develop advanced perception models
									for AI-powered mobility solutions.
								</p>
							</div>
						</div>
					</div>
				</Card.Content>
			</Tabs.Content>

			<Tabs.Content value="social-media">
				<Card.Content class="flex space-y-4 p-1 py-6">
					<div>
						<div class="grid grid-cols-1 md:grid-cols-5 gap-6">
							<div class="md:col-span-3 rounded-lg overflow-hidden shadow-lg">
								<video class="w-full h-auto sm:h-80 md:h-96 object-cover" autoplay loop muted>
									<source
										src="https://framerusercontent.com/assets/9jRcdX07q3bSLXhHxRqzX8QS0.mp4"
										type="video/mp4"
									/>
								</video>
							</div>
							<div class="md:col-span-2 space-y-4 text-center md:text-left">
								<h3 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
									Real-Time Social Media Intelligence – Live Data Analytics
								</h3>
								<p class="text-sm sm:text-lg text-gray-700 mt-2">
									Unlock real-time insights from social media activity with CyberGlobes.ai’s Live
									Data Monitoring. Our platform harnesses AI-driven analytics to track, analyze, and
									map social media posts, providing unparalleled intelligence for security,
									business, and investigative applications.
								</p>
							</div>
						</div>
						<div class="text-center my-6 md:my-12 md:mt-12 mt-14">
							<h3 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Key Features</h3>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div class="bg-white p-6 rounded-2xl shadow-md">
								<h2 class="text-lg font-semibold">📡 Live Data Feeds</h2>
								<ul class="mt-2 space-y-2">
									<li class="flex items-center">
										<span class="text-green-500 mr-2">✔</span> Instantly access geo-tagged social media
										activity in high-risk areas.
									</li>
								</ul>
							</div>
							<div class="bg-white p-6 rounded-2xl shadow-md">
								<h2 class="text-lg font-semibold">🚀 AI & NLP-Powered Analysis</h2>
								<ul class="mt-2 space-y-2">
									<li class="flex items-center">
										<span class="text-green-500 mr-2">✔</span> Extract keywords, hashtags, and conversations
										for rapid insights.
									</li>
								</ul>
							</div>
							<div class="bg-white p-6 rounded-2xl shadow-md">
								<h2 class="text-lg font-semibold">🔎 Image & Video Verification</h2>
								<ul class="mt-2 space-y-2">
									<li class="flex items-center">
										<span class="text-green-500 mr-2">✔</span> Use OSINT-driven reverse image analysis
										to validate sources.
									</li>
								</ul>
							</div>
							<div class="bg-white p-6 rounded-2xl shadow-md">
								<h2 class="text-lg font-semibold">📊 Customizable Dashboards</h2>
								<ul class="mt-2 space-y-2">
									<li class="flex items-center">
										<span class="text-green-500 mr-2">✔</span> Visualize real-time data on maps, heatmaps,
										and live analytics panels.
									</li>
								</ul>
							</div>
						</div>
					</div>
				</Card.Content>
			</Tabs.Content>

			<Tabs.Content value="revserse-lookup">
				<Card.Content class="flex space-y-4 p-1 py-6">
					<div>
						<div class="grid grid-cols-1 md:grid-cols-5 gap-6">
							<div class="md:col-span-3 rounded-lg overflow-hidden shadow-lg">
								<video class="w-full h-auto sm:h-80 md:h-96 object-cover" autoplay loop muted>
									<source
										src="https://framerusercontent.com/assets/9jRcdX07q3bSLXhHxRqzX8QS0.mp4"
										type="video/mp4"
									/>
								</video>
							</div>
							<div class="md:col-span-2 space-y-4 text-center md:text-left">
								<h3 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
									Transform Images into Insights
								</h3>
								<p class="text-sm sm:text-lg text-gray-700 mt-2">
									Our Reverse Photo Geolocation Tool leverages advanced AI algorithms to analyze the
									visual elements within a photograph, accurately determining its geographical
									origin. This capability is essential for professionals in various fields who
									require precise location data from imagery.
								</p>
							</div>
						</div>
						<div class="text-center my-6 md:my-12 md:mt-12 mt-14">
							<h3 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Key Features</h3>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div class="bg-white p-6 rounded-2xl shadow-md">
								<h2 class="text-lg font-semibold">🤖 AI-Driven Location Detection</h2>
								<ul class="mt-2 space-y-2">
									<li class="flex items-center">
										<span class="text-green-500 mr-2">✔</span> Utilizing cutting-edge machine learning
										techniques, our tool examines pixel data to infer geographic coordinates with high
										precision.
									</li>
								</ul>
							</div>
							<div class="bg-white p-6 rounded-2xl shadow-md">
								<h2 class="text-lg font-semibold">🗺 Comprehensive Data Integration</h2>
								<ul class="mt-2 space-y-2">
									<li class="flex items-center">
										<span class="text-green-500 mr-2">✔</span> By cross-referencing visual information
										with extensive geospatial databases, we ensure reliable and up-to-date location insights.
									</li>
								</ul>
							</div>
							<div class="bg-white p-6 rounded-2xl shadow-md">
								<h2 class="text-lg font-semibold">💡 User-Friendly Interface</h2>
								<ul class="mt-2 space-y-2">
									<li class="flex items-center">
										<span class="text-green-500 mr-2">✔</span> Designed for efficiency, our platform
										allows users to upload images and receive detailed location analyses swiftly.
									</li>
								</ul>
							</div>
							<div class="bg-white p-6 rounded-2xl shadow-md">
								<h2 class="text-lg font-semibold">🔒 Privacy and Security</h2>
								<ul class="mt-2 space-y-2">
									<li class="flex items-center">
										<span class="text-green-500 mr-2">✔</span> We prioritize data protection, ensuring
										that all analyses are conducted with strict confidentiality and compliance with privacy
										standards.
									</li>
								</ul>
							</div>
						</div>
					</div>
				</Card.Content>
			</Tabs.Content>
		</Tabs.Root>
	</Card.Root>
</section>
