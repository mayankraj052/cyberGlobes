<script>
	import Cta from '$lib/components/ui/home/Cta.svelte';
	import Icon from '@iconify/svelte';
</script>
<section class="bg-white dark:bg-gray-900 py-14 lg:py-18">
  <div class="max-w-screen-xl mx-auto px-4 lg:px-6">
    <div class="max-w-screen-md mx-auto text-center mb-12">
      <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-900 leading-tight mb-6">Plan and Pricing</h2>
      <p class="text-lg text-gray-700 dark:text-gray-400">
        Choose the way you want to use Cyberglobes — flexible pay-as-you-go access or unlimited insights with a monthly plan.
      </p>
    </div>

    <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Card 1 -->
      <div class="flex flex-col p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow text-center">
        <h3 class="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-500">Full Access Subscription</h3>
        <p class="text-gray-500 dark:text-gray-400 text-md font-semibold mb-1">Best for professionals, teams, and power users</p>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">Unlock unlimited insights — anytime, anywhere</p>
        <div class="flex justify-center items-end mb-6">
          <span class="text-5xl font-extrabold text-gray-800">$49</span>
          <span class="ml-1 text-gray-500 dark:text-gray-400 text-lg">/month</span>
        </div>
        <ul class="text-left space-y-3 text-sm text-gray-800 dark:text-gray-300 mb-6">
          <li class="flex items-center space-x-2"><Icon icon="lucide:check" class="text-green-500 w-5 h-5" /> <span>Unlimited searches</span></li>
          <li class="flex items-center space-x-2"><Icon icon="lucide:check" class="text-green-500 w-5 h-5" /> <span>Priority access to agent support</span></li>
          <li class="flex items-center space-x-2"><Icon icon="lucide:check" class="text-green-500 w-5 h-5" /> <span>Advanced analytics & custom filters</span></li>
          <li class="flex items-center space-x-2"><Icon icon="lucide:check" class="text-green-500 w-5 h-5" /> <span>Export reports, routes, and dashboards</span></li>
          <li class="flex items-center space-x-2"><Icon icon="lucide:check" class="text-green-500 w-5 h-5" /> <span>Early access to new features</span></li>
        </ul>
        <a href="#" class="mt-auto bg-primary text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-6 py-3 dark:focus:ring-primary-900">
          Start Free Trial
        </a>
      </div>

      <!-- Card 2 -->
      <div class="flex flex-col p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow text-center">
        <h3 class="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-500">Pay-Per-Search</h3>
        <p class="text-gray-500 dark:text-gray-400 text-md font-semibold mb-1">Best for light users or occasional access</p>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">Only pay when you use it. No commitment.</p>
        <div class="flex justify-center items-end mb-6">
          <span class="text-5xl font-extrabold text-gray-800">$0.20</span>
          <span class="ml-1 text-gray-500 dark:text-gray-400 text-lg">/per search</span>
        </div>
        <ul class="text-left space-y-3 text-sm text-gray-800 dark:text-gray-300 mb-6">
          <li class="flex items-center space-x-2"><Icon icon="lucide:check" class="text-green-500 w-5 h-5" /> <span>Access to all use cases</span></li>
          <li class="flex items-center space-x-2"><Icon icon="lucide:check" class="text-green-500 w-5 h-5" /> <span>Real-time geo-location data</span></li>
          <li class="flex items-center space-x-2"><Icon icon="lucide:check" class="text-green-500 w-5 h-5" /> <span>Visual and map-based results</span></li>
          <li class="flex items-center space-x-2"><Icon icon="lucide:check" class="text-green-500 w-5 h-5" /> <span>No subscription required</span></li>
        </ul>
        <a href="#" class="mt-auto bg-primary text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-6 py-3 dark:focus:ring-primary-900">
          Get Started
        </a>
      </div>

      <!-- Card 3 -->
      <div class="flex flex-col p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow text-center">
        <h3 class="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-500">Need high-volume or enterprise access?</h3>
        <p class="text-gray-500 dark:text-gray-400 text-md font-semibold mb-1">Contact us for custom plans, API access, or team features.</p>

        <div class="flex justify-center items-end mb-6">
          <span class="text-5xl font-extrabold text-gray-800">$499</span>
          <span class="ml-1 text-gray-500 dark:text-gray-400 text-lg">/month</span>
        </div>
        <div class="flex justify-center mb-6">
            <Icon icon="streamline:customer-support-1-solid" class="w-20 h-20"></Icon>
        </div>
        <a href="#" class="mt-auto bg-primary text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-6 py-3 dark:focus:ring-primary-900">
          Talk to Sales
        </a>
      </div>
    </div>
  </div>
</section>
<Cta />
