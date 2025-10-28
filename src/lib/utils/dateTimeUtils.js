export function formatToSocialMediaDate(dateStr, unixTimestamp = false) {
	if (unixTimestamp) {
		dateStr = new Date(dateStr * 1000).toISOString();
	}

	const date = new Date(dateStr); // Parse the date string into a Date object
	const now = new Date();
	const diffInSeconds = Math.floor((date - now) / 1000);

	if (Math.abs(diffInSeconds) < 60) {
		// Seconds: Less than a minute
		return `${Math.abs(diffInSeconds)}s`;
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (Math.abs(diffInMinutes) < 60) {
		// Minutes: Less than an hour
		return `${Math.abs(diffInMinutes)}m`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (Math.abs(diffInHours) < 24) {
		// Hours: Less than a day
		return `${Math.abs(diffInHours)}h`;
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (Math.abs(diffInDays) <= 7) {
		// Days: Less than or equal to a week
		return `${Math.abs(diffInDays)}d`;
	}

	// Beyond a week: Format as "DDmmm" (e.g., 15feb)
	const formattedDate = date
		.toLocaleDateString('en', {
			day: '2-digit',
			month: 'short'
		})
		.toLowerCase()
		.replace(' ', '');

	return formattedDate;
}

export function formatDateToYYYYMMDD(dateStr) {
	const year = dateStr.getFullYear();
	const month = String(dateStr.getMonth() + 1).padStart(2, '0'); // Ensure two-digit format
	const day = String(dateStr.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}
