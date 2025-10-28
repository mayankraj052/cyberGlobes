<script>
	export let content;
	export let media;
</script>

<p class="text-gray-800 mt-1">{content}</p>
<div class="mt-3 relative">
	<img src={media} alt="Video Thumbnail" class="rounded-lg w-full" />
	<button class="absolute inset-0 flex items-center justify-center">
		<div class="bg-black bg-opacity-50 p-3 rounded-full">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-10 w-10 text-white transition transform hover:scale-110"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path d="M8 5v14l11-7z" />
			</svg>
		</div>
	</button>
</div>
