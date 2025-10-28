<script>
    // AI Models comparison data
    const models = [
        {
            name: "Cyberglobes",
            trainingCutoff: "Live, real-time",
            dataFreshness: "Continuously updated",
            sourceDiversity: "Thousands of live data sources: websites, APIs, datasets, social media",
            realTimeCapability: "Yes",
            isCyberglobes: true
        },
        {
            name: "ChatGPT (GPT-4)",
            trainingCutoff: "April 2023 (est.)",
            dataFreshness: "Static (periodically updated)",
            sourceDiversity: "Internet, books, code",
            realTimeCapability: "Limited (via plugins)",
            isCyberglobes: false
        },
        {
            name: "Claude (Anthropic)",
            trainingCutoff: "Early 2023 (Claude 2)",
            dataFreshness: "Static",
            sourceDiversity: "Curated internet + documents",
            realTimeCapability: "No",
            isCyberglobes: false
        },
        {
            name: "DeepSeek",
            trainingCutoff: "2023",
            dataFreshness: "Static",
            sourceDiversity: "Web + code datasets",
            realTimeCapability: "No",
            isCyberglobes: false
        },
        {
            name: "Gemini (Google)",
            trainingCutoff: "December 2023",
            dataFreshness: "Partially updated",
            sourceDiversity: "Google-indexed web + internal datasets",
            realTimeCapability: "Partial (search-augmented)",
            isCyberglobes: false
        }
    ];

    // Function to determine badge class based on real-time capability
    function getBadgeClass(capability) {
        if (capability === "Yes") return "bg-green-100 text-green-800";
        if (capability === "No") return "bg-red-100 text-red-800";
        return "bg-yellow-100 text-yellow-800";
    }
</script>

<section class="py-16 bg-gray-50 dark:bg-gray-900">
  <div class="container mx-auto px-4 sm:px-6">
    <h2 class="text-3xl sm:text-4xl text-center md:text-5xl font-bold text-primary-900 leading-tight mb-12">
      Training Dates of Popular AI Models
    </h2>

    <!-- Table for desktop and tablet -->
    <div class="hidden md:block overflow-hidden rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div class="overflow-x-auto">
        <table class="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-primary-900 dark:bg-primary-700 text-white">
            <tr>
              <th class="py-4 px-6 text-left text-sm font-semibold tracking-wider">Model</th>
              <th class="py-4 px-6 text-left text-sm font-semibold tracking-wider">Training Cutoff</th>
              <th class="py-4 px-6 text-left text-sm font-semibold tracking-wider">Data Freshness</th>
              <th class="py-4 px-6 text-left text-sm font-semibold tracking-wider">Source Diversity</th>
              <th class="py-4 px-6 text-left text-sm font-semibold tracking-wider">Real-Time Capability</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {#each models as model, i}
              <tr
                class:bg-blue-50={model.isCyberglobes}
                class:bg-white={!model.isCyberglobes && i % 2 === 0}
                class:bg-gray-50={!model.isCyberglobes && i % 2 === 1}
              >
                <td class="py-4 px-6 font-medium {model.isCyberglobes ? 'text-blue-700' : 'text-gray-900 dark:text-gray-200'}">
                  {model.name}
                </td>
                <td class="py-4 px-6 {model.isCyberglobes ? 'text-blue-700 font-semibold' : 'text-gray-700 dark:text-gray-300'}">
                  {#if model.isCyberglobes}
                    <div class="flex items-center">
                      <span class="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                      {model.trainingCutoff}
                    </div>
                  {:else}
                    {model.trainingCutoff}
                  {/if}
                </td>
                <td class="py-4 px-6 {model.isCyberglobes ? 'text-blue-700 font-semibold' : 'text-gray-700 dark:text-gray-300'}">
                  {model.dataFreshness}
                </td>
                <td class="py-4 px-6 {model.isCyberglobes ? 'text-blue-700 font-semibold' : 'text-gray-700 dark:text-gray-300'}">
                  {model.sourceDiversity}
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold {getBadgeClass(model.realTimeCapability)}">
                    {model.realTimeCapability}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Cards for mobile view -->
    <div class="md:hidden space-y-6 mt-8">
      {#each models as model}
        <div
          class="rounded-2xl shadow-lg overflow-hidden border transition-transform hover:scale-[1.01] duration-200"
          class:bg-blue-50={model.isCyberglobes}
          class:border-blue-300={model.isCyberglobes}
          class:bg-white={!model.isCyberglobes}
          class:border-gray-200={!model.isCyberglobes}
        >
          <div class="p-4 {model.isCyberglobes ? 'bg-blue-100 border-b border-blue-200' : 'bg-gray-100 border-b border-gray-200'}">
            <h3 class="font-bold text-lg {model.isCyberglobes ? 'text-blue-700' : 'text-gray-900'}">
              {model.name}
            </h3>
          </div>
          <div class="p-4 space-y-4">
            <div>
              <p class="text-sm text-gray-500 font-medium">Training Cutoff</p>
              <p class="text-gray-800 flex items-center space-x-2">
                {#if model.isCyberglobes}
                  <span class="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {/if}
                <span>{model.trainingCutoff}</span>
              </p>
            </div>

            <div>
              <p class="text-sm text-gray-500 font-medium">Data Freshness</p>
              <p class="text-gray-800 {model.isCyberglobes ? 'font-semibold' : ''}">{model.dataFreshness}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500 font-medium">Source Diversity</p>
              <p class="text-gray-800 {model.isCyberglobes ? 'font-semibold' : ''}">{model.sourceDiversity}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500 font-medium">Real-Time Capability</p>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold {getBadgeClass(model.realTimeCapability)}">
                {model.realTimeCapability}
              </span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
