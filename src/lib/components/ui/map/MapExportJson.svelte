<script>
	import { Button } from '$lib/components/ui/button/index.ts';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { socialMediaJson } from '$lib/stores/mapStore.ts';
	import { groupSocialMediaData } from '$lib/utils/socialMediaUtils.js';

	let buttonIcon = 'line-md:downloading';
	let buttonDisabled = false;

	const ICON_DOWNLOADING = 'line-md:downloading-loop';
	const ICON_DOWNLOAD_DONE = 'ic:round-download-done';
	const ICON_RESET = 'line-md:downloading';
	const DOWNLOAD_DELAY = 3000;
	const RESET_DELAY = 5000;
	const DOWNLOAD_FILENAME = 'social-media-data.json';

	/**
	 * Exports social media data in JSON format. The method groups social media data by type
	 * and downloads it as a JSON file. It updates the button icon to indicate downloading status,
	 * provides user feedback on completion, and resets the button icon after a delay.
	 *
	 * @return {void} Does not return any value. Initiates a download for the grouped JSON data.
	 */
	function exportJson() {
		// set button icon as downloading...
		updateButtonIcon(ICON_DOWNLOADING);
		buttonDisabled = true;

		// Group social media data by type (e.g., x-twitter, facebook)
		const groupedSocialMediaData = groupSocialMediaData($socialMediaJson.socialData);

		// download done
		setTimeout(() => {
			buttonDisabled = false;
			// Create and download the JSON file
			downloadJsonFile(groupedSocialMediaData, DOWNLOAD_FILENAME);
			updateButtonIcon(ICON_DOWNLOAD_DONE);

			toast.success('Data Exported!', { position: 'bottom-center' });
		}, DOWNLOAD_DELAY);

		// reset the button icon to its original state...
		setTimeout(() => {
			updateButtonIcon(ICON_RESET);
		}, RESET_DELAY);
	}

	/**
	 * Updates the icon of a button with the given icon.
	 *
	 * @param {string} icon - The new icon to be set on the button.
	 * @return {void} This function does not return a value.
	 */
	function updateButtonIcon(icon) {
		buttonIcon = icon;
	}

	/**
	 * Downloads a JSON file with the provided data and filename.
	 *
	 * @param {Object} data - The JSON data to be included in the file.
	 * @param {string} filename - The name of the file to be downloaded, including the extension.
	 * @return {void}
	 */
	function downloadJsonFile(data, filename) {
		const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		link.click();
		URL.revokeObjectURL(url);
	}
</script>

<!-- Floating Export JSON Button -->
<Button
	disabled={buttonDisabled}
	on:click={exportJson}
	aria-label="Export JSON"
	class="fixed bottom-4 right-4 z-50 w-12 h-12 p-0 rounded-full bg-primary text-white shadow-md hover:shadow-lg transition-transform duration-200 transform hover:scale-110"
	variant="primary"
	title="Export JSON"
>
	<Icon aria-hidden="true" class="w-6 h-6 text-white" icon={buttonIcon} />
	<span class="sr-only">Export JSON</span>
</Button>
