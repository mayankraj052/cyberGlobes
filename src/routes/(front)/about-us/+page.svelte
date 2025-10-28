<script>
	import Icon from '@iconify/svelte';
	import WhoWeAre from '$lib/components/ui/about-us/WhoWeAre.svelte';
	import DifferenceCard from '$lib/components/ui/about-us/DifferenceCard.svelte';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Cta from '$lib/components/ui/home/Cta.svelte';
	
	// Animation control variables
	let mounted = false;
	let heroVisible = false;
	let missionVisible = false;
	let featuresVisible = false;
	let industriesVisible = false;
	
	onMount(() => {
		mounted = true;
		
		// Trigger animations based on scroll position
		const observerOptions = {
			rootMargin: '-100px',
			threshold: 0.1
		};
		
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					switch (entry.target.id) {
						case 'hero-section':
							heroVisible = true;
							break;
						case 'mission-section':
							missionVisible = true;
							break;
						case 'features-section':
							featuresVisible = true;
							break;
						case 'industries-section':
							industriesVisible = true;
							break;
					}
				}
			});
		}, observerOptions);
		
		// Observe sections for animation triggers
		const sections = document.querySelectorAll('section[id]');
		sections.forEach(section => observer.observe(section));
		
		return () => {
			sections.forEach(section => observer.unobserve(section));
		};
	});
	
	
	const industries = [
		{ icon: 'mdi:cart-outline', title: 'Retail & Consumer Insights' },
		{ icon: 'mdi:office-building', title: 'Commercial Real Estate & Urban Planning' },
		{ icon: 'mdi:airplane', title: 'Tourism, Travel & Events' },
		{ icon: 'mdi:bullseye-arrow', title: 'Marketing, Advertising & Consumer Brands' },
		{ icon: 'mdi:shield-lock-outline', title: 'Security, OSINT & Intelligence Agencies' },
		{ icon: 'mdi:earth', title: 'Law Enforcement & Public Safety' },
		{ icon: 'mdi:city-variant-outline', title: 'Smart Cities & Government' },
		{ icon: 'mdi:robot', title: 'Tech, AI & Platform Builders' },
		{ icon: 'mdi:bus', title: 'Mobility & Transportation' },
		{ icon: 'mdi:chart-line', title: 'Emergency Services & Crisis Response' },
		{ icon: 'mdi:truck-delivery-outline', title: 'Delivery, Logistics & Operations' },
		{ icon: 'mdi:newspaper-variant-outline', title: 'Media & Journalism' },
		{ icon: 'mdi:school-outline', title: 'Research, Academia & Urban Studies' }
	];
	
	const features = [
		{
			number: "01",
			title: "Live Data, Not Static Models",
			description: "AI models are trained on old data. We use <strong class=\"text-primary-700\">real-time, geo-tagged inputs</strong> that reflect what's happening now — not weeks or months ago."
		},
		{
			number: "02",
			title: "Intelligent Location Agent",
			description: "Search on your own or let our chatbot handle it. Either way, you'll get location-aware results that are <strong class=\"text-primary-700\">visual, actionable, and current.</strong>"
		},
		{
			number: "03",
			title: "Built for All Use Cases",
			description: "From finding nearby events to comparing competitor foot traffic, Cyberglobes supports <strong class=\"text-primary-700\">10+ categories of use</strong> — for individuals, businesses, cities, and global agencies."
		},
		{
			number: "04",
			title: "Beyond Boundaries",
			description: "Traditional AI hits limits based on training. We don't. Cyberglobes <strong class=\"text-primary-700\">continuously pulls from the real world</strong> to deliver insights that static models simply can't."
		}
	];

</script>

<section class="relative overflow-hidden to-white pt-16 pb-8">
    <!-- Background decorative elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div class="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-primary-100 blur-3xl opacity-60"></div>
        <div class="absolute bottom-20 right-[15%] w-80 h-80 rounded-full bg-primary-200 blur-3xl opacity-40"></div>
        <div class="absolute top-40 right-[20%] w-40 h-40 rounded-full bg-secondary-100 blur-3xl opacity-30"></div>
    </div>

    <div class="container mx-auto px-6">
        <!-- Hero content -->
        <div class="text-center mb-12">
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-900 leading-tight mb-6">
                About Cyberglobes
            </h1>
            <p class="text-xl text-gray-700 font-medium mt-6 max-w-2xl mx-auto">
               Live. Local. Real-Time Intelligence
            </p>
        </div>
        
        <!-- Main content with globe visualization and company details -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            <!-- Left side: Interactive Globe -->
            <div class="lg:col-span-5 relative order-2 lg:order-1">
                <div class="relative aspect-square w-full max-w-md mx-auto">
                    <!-- Main Globe -->
                    <div class="absolute inset-0 rounded-full border-8 border-primary-100 p-2">
                        <div class="w-full h-full rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center overflow-hidden relative">
                            <Icon icon="emojione-monotone:globe-showing-europe-africa" class="w-2/3 h-2/3 text-white opacity-80 animate-pulse" style="animation-duration: 5s;" />
                            
                            <!-- Data points animation -->
                            <div class="absolute inset-0">
                                <div class="animate-ping absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-white opacity-75" style="animation-duration: 3s;"></div>
                                <div class="animate-ping absolute top-3/4 right-1/3 w-2 h-2 rounded-full bg-white opacity-75" style="animation-duration: 2.5s; animation-delay: 1s;"></div>
                                <div class="animate-ping absolute bottom-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-white opacity-75" style="animation-duration: 4s; animation-delay: 0.5s;"></div>
                                <div class="animate-ping absolute bottom-1/4 left-2/3 w-2 h-2 rounded-full bg-white opacity-75" style="animation-duration: 3.5s; animation-delay: 1.5s;"></div>
                            </div>
                            
                            <!-- Orbital rings -->
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="w-[120%] h-[120%] border border-white/30 rounded-full animate-[spin_25s_linear_infinite]"></div>
                                <div class="absolute w-[140%] h-[140%] border border-white/20 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
                                <div class="absolute w-[160%] h-[160%] border border-white/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Decorative elements -->
                    <div class="absolute -bottom-4 -right-4 p-3 bg-white rounded-full shadow-lg">
                        <Icon icon="mdi:map-marker-radius" class="text-primary-500 w-10 h-10" />
                    </div>
                    <div class="absolute -top-6 -left-6 p-3 bg-white rounded-full shadow-lg">
                        <Icon icon="mdi:chart-line" class="text-primary-300 w-10 h-10" />
                    </div>
                    <div class="absolute top-1/2 -right-2 p-2 bg-white rounded-full shadow-lg transform -translate-y-1/2">
                        <Icon icon="mdi:signal" class="text-primary-400 w-8 h-8" />
                    </div>
                </div>
            </div>
            
            <!-- Right side: About Content -->
            <div class="lg:col-span-7 order-1 lg:order-2">
                <div class="space-y-6">
                    <!-- Company description cards with hover effects -->
                    <div class="bg-white p-6 rounded-xl border-l-4 border-primary-500 shadow-md hover:shadow-lg transition-all hover:translate-x-1">
                        <p class="text-gray-700 leading-relaxed text-base md:text-[18px]">
                            At Cyberglobes, we believe that <strong class="text-primary-700">the world doesn't stand still — and neither should your data.</strong> While
                            most AI systems are trained on static, outdated information, we're building something different:<strong class="text-primary-700"> an
                            AI-powered geo-intelligence engine that taps into the real world as it happens.</strong>
                        </p>
                    </div>
                    
                    <div class="bg-white p-6 rounded-xl border-l-4 border-primary-400 shadow-md hover:shadow-lg transition-all hover:translate-x-1">
                        <p class="text-gray-700 leading-relaxed text-base md:text-[18px]">
                            Cyberglobes bridges the gap between location and live intelligence. We analyze movement, behavior,
                            and signals from the ground up — combining <strong class="text-primary-700">real-time sensor data, social media, location activity,
                            and crowd patterns</strong> to help you see what's really happening, anywhere in the world.
                        </p>
                    </div>
                    
                    <div class="bg-white p-6 rounded-xl border-l-4 border-primary-300 shadow-md hover:shadow-lg transition-all hover:translate-x-1">
                        <p class="text-gray-700 leading-relaxed text-base md:text-[18px]">
                            Whether you're exploring your city, launching a business, or securing critical infrastructure —
                            Cyberglobes gives you a <strong class="text-primary-700">live pulse of any location</strong>, with insights designed for decision-making, planning,
                            and action.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="container mx-auto px-6 md:py-16 py-8">
    <!-- Mission Statement with enhanced visual design -->
    <div class="relative rounded-3xl overflow-hidden mb-20">
        <!-- Background gradient with pattern overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-primary-100 to-primary-50 -z-10"></div>
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0,transparent_70%)]"></div>
        
        <div class="relative py-16 px-8 text-center">
            <!-- Decorative elements -->
            <div class="absolute top-0 right-0 p-4 opacity-20">
                <Icon icon="mdi:map-marker-multiple" class="w-24 h-24 text-primary-500" />
            </div>
            <div class="absolute bottom-0 left-0 p-4 opacity-20">
                <Icon icon="mdi:chart-bubble" class="w-20 h-20 text-primary-700" />
            </div>
            
            <h2 class="text-4xl sm:text-5xl font-bold text-primary-900 leading-tight mb-6">
                Our Mission
            </h2>
            
            <div class="max-w-3xl mx-auto relative">
                <p class="text-xl text-gray-800 leading-relaxed font-medium px-4 py-6 bg-white bg-opacity-70 backdrop-blur-sm rounded-xl shadow-sm">
                    To make <strong>live location intelligence</strong> as accessible as weather forecasts or search results — helping
                    people and organizations make smarter decisions, instantly and locally.
                </p>
                
                <!-- Quote marks -->
                <Icon icon="mdi:format-quote-open" class="absolute -top-4 -left-2 text-primary-300 w-10 h-10 opacity-50" />
                <Icon icon="mdi:format-quote-close" class="absolute -bottom-4 -right-2 text-primary-300 w-10 h-10 opacity-50" />
            </div>
        </div>
    </div>

    <!-- What Makes Cyberglobes Different Section -->
    <div class="mb-24">
        <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold leading-tight mb-6">
                What Makes <span class="text-primary-600">Cyberglobes</span> Different?
            </h2>
            <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                Our platform stands apart through cutting-edge technology that delivers real-world insights in real-time.
            </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

<section class="relative py-20 overflow-hidden">
    <!-- Background pattern -->
    <div class="absolute inset-0 -z-10 bg-white">
        <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(125,211,252,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(125,211,252,0.1)_1px,transparent_1px)] bg-[size:14px_14px]"></div>
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent"></div>
    </div>
    
    <div class="container mx-auto px-6">
        <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-900 leading-tight mb-6">
                Who We Serve
            </h2>
            
            <p class="text-gray-700 text-lg my-8 max-w-3xl mx-auto">
                Cyberglobes powers <strong class="text-primary-700">real-time decision-making</strong> for people, businesses, and institutions that depend on
                location-sensitive intelligence. Our platform supports a broad range of use cases across public, private,
                and civic sectors:
            </p>
        </div>

        <!-- Industry Cards in a modern grid layout -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4 md:gap-6">
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

    </div>
</section>
<Cta />