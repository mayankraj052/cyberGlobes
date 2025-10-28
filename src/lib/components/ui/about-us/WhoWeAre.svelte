<script>
	import Icon from '@iconify/svelte';
	
	// Component props
	export let icon = "mdi:cart-outline"; 
	export let title = "Retail & Consumer Insights"; 
	export let bgHoverColor = "hover:bg-primary-100"; 
	export let textHoverColor = "hover:text-primary-900"; 
	export let iconColor = "text-primary-600";
	export let onClick = () => {}; 
</script>

<div 
  class="bg-white border rounded-xl p-5 shadow-sm flex items-center gap-4 transition-all duration-300 {bgHoverColor} {textHoverColor} cursor-pointer h-full group relative overflow-hidden"
  on:click={onClick}
  on:keydown={(e) => e.key === 'Enter' && onClick()}
  tabindex="0"
  role="button"
>
  <!-- Background elements -->
  <div class="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-primary-300 to-transparent"></div>
  
  <div class="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg border border-primary-100 bg-primary-50 group-hover:bg-primary-100 transition-colors duration-300">
    <Icon {icon} class="text-2xl {iconColor} group-hover:scale-110 transition-transform duration-300"></Icon>
  </div>
  
  <div class="text-left">
    <h3 class="font-semibold text-lg text-gray-900 group-hover:text-primary-700 transition-colors duration-300">{title}</h3>
    <slot>
      <!-- Optional description content can go here -->
    </slot>
  </div>

</div>