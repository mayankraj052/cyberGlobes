<script lang="ts">
	import { page } from '$app/stores';
	const status = $page.status;
</script>

<div class="error-container flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
	<div class="text-center">
		<div class="mb-8">
			<div class="text-8xl font-bold text-primary dark:text-blue-400 mb-2">
				{status === 404 ? '404' : 'Oops!'}
			</div>
			<h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
				{status === 404 ? 'Page Not Found' : 'Something went wrong'}
			</h1>
			<p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
				{status === 404 
					? "The page you're looking for doesn't exist or has been moved."
					: "We're working on fixing this issue. Please try again later."}
			</p>
		</div>
		
		<div class="mt-8">
			<a 
				href="/"
				class="px-6 py-3 bg-primary text-white rounded-full hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
			>
				Return to Home
			</a>
		</div>
	</div>
</div>