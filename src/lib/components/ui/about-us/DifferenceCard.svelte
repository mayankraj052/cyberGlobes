<script>
  // Component props
  export let number = "01";
  export let title = "Feature Title";
  export let description = "Feature description goes here";
</script>

<div class="flex flex-col items-start text-left bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 group hover:border-primary-300 h-full relative overflow-hidden transform hover:-translate-y-1">
  <!-- Background gradient that appears on hover -->
  <div class="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
  
  <!-- Top corner decorative accent -->
  <div class="absolute top-0 right-0 w-24 h-24 bg-primary-100 opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-bl-full -z-5"></div>
  
  <!-- Number indicator -->
  <div class="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold mb-6 shadow-lg group-hover:shadow-primary-200/50 transition duration-500 relative">
    <span class="text-2xl">{number}</span>
    <!-- Subtle pulse animation -->
    <div class="absolute inset-0 rounded-2xl border border-primary-400 animate-ping opacity-30 duration-1000"></div>
  </div>
  
  <!-- Content -->
  <h3 class="font-bold text-gray-900 mb-4 text-xl group-hover:text-primary-700 transition-colors duration-300">{title}</h3>
  <p class="text-gray-700 leading-relaxed text-md group-hover:text-gray-800 transition-colors duration-300 text-md lg:text-[16px]">
    {@html description}
  </p>
  
  <!-- Bottom visual indicator -->
  <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
</div>
