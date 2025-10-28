/**
 * Truncate a string to a certain length.
 *
 * @param {string} string - The string to truncate.
 * @param {number} number - The number of characters to truncate the string to.
 * @returns {string} The truncated string.
 */
export function truncateString(string, number = 50) {
	// empty string?
	if (typeof string !== 'string') {
		return string;
	}

	if (string.length > number) {
		return string.slice(0, number) + '...';
	}

	return string;
}

/**
 * Toggle full screen mode.
 *
 * @param {string} elementId - The ID of the element to toggle full screen mode on.
 * @returns {void} Nothing.
 */
export function toggleFullScreen(elementId) {
	const elem = document.getElementById(elementId);

	if (!document.fullscreenElement) {
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			// Firefox
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			// Chrome, Safari, Edge, Opera
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) {
			// IE/Edge
			elem.msRequestFullscreen();
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			// Firefox
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			// Chrome, Safari, Edge, Opera
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) {
			// IE/Edge
			document.msExitFullscreen();
		}
	}
}

/**
 * Get data from the URL.
 *
 * @param {string} queryString - The query string to get data from.
 * @returns {string | string[]} The data from the URL.
 */
export function getDataFromURL(queryString) {
	if (typeof window === 'undefined' || typeof URL === 'undefined') {
		return '';
	}

	const url = new URL(window.location.href);
	const values = url.searchParams.getAll(queryString);

	if (queryString.includes('[]')) {
		return values;
	}

	return values.length === 1 ? values[0] : '';
}

/**
 * Put data in the URL.
 *
 * @param {string} queryString - The query string to put data in.
 * @param {string} data - The data to put in the URL.
 *
 * @returns {void} Nothing.
 */
export function putDataInURL(queryString, data) {
	const url = new URL(window.location.href);
	url.searchParams.set(queryString, data);
	window.history.replaceState({}, '', url);
}

/**
 * Removes a specific query parameter from the URL without reloading the page.
 *
 * @param {string} queryString - The key of the query parameter to remove.
 */
export function removeDataFromURL(queryString) {
	// Create a URL object from the current window location
	const url = new URL(window.location.href);

	// Delete the specified query parameter
	url.searchParams.delete(queryString);

	// Update the URL in the browser without refreshing the page
	window.history.replaceState({}, '', url);
}

export function formatDate(isoString) {
	const date = new Date(isoString);
	return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Processes error data and extracts error messages into an array.
 *
 * @param {Object} data - The error data structure which may contain error details.
 * @return {string[]} An array of error messages extracted from the input data.
 */
export function handleErrors(data) {
	let errorMessages = [];

	if (data.errors) {
		Object.keys(data.errors).forEach((key) => {
			errorMessages.push(...data.errors[key]);
		});
	} else {
		errorMessages.push(data.message || 'An error occurred');
	}

	return errorMessages;
}

/**
 * Sanitizes the given identifier by replacing invalid characters with a hyphen.
 *
 * @param {string|number} id - The identifier to be sanitized. It can be a string or a number.
 * @return {string} A sanitized version of the identifier containing only alphanumeric characters, dashes, or underscores.
 */
export function sanitizeId(id) {
	// Ensure that id is a string, or fallback to an empty string
	return String(id).replace(/[^a-zA-Z0-9-_]/g, '-');
}

/**
 * Checks if the user is on a mobile device.
 *
 * This function determines if the user is using a mobile device based on:
 * 1. The `navigator.userAgent` string, which detects mobile devices like iPhones, Androids, and iPads.
 * 2. The `window.matchMedia` method, which checks if the screen width is `767px` or less.
 *
 * @returns {boolean} - Returns `true` if the user is on a mobile device, otherwise `false`.
 */
export function isMobile() {
	if (typeof window === 'undefined' || typeof navigator === 'undefined') {
		return false; // Ensure this runs only in the browser
	}

	return (
		/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
		window.matchMedia('(max-width: 767px)').matches
	);
}

/**
 * Generates a URL for a map request based on the provided parameters.
 *
 * @param {Object} request - The request object containing the necessary parameters.
 * @return {string} The generated URL as a string with the concatenated query parameters.
 */
export function generateMapURL(request) {
	const BASE_URL = '/try-demo/';
	const { id, request_params, address } = request;
	const { latitude, longitude, radius, resolution, features, from, to, timeframe, filters } =
		request_params;

	const queryParams = new URLSearchParams({
		request_id: id,
		search: address,
		lat: latitude,
		long: longitude,
		timeframe,
		radius,
		resolution
	});

	appendCustomTimeframe(queryParams, timeframe, from, to);
	appendFeatures(queryParams, features);
	appendFilters(queryParams, filters);

	return `${BASE_URL}?${queryParams.toString()}`;
}

// handle custom timeframe query parameters
function appendCustomTimeframe(queryParams, timeframe, from, to) {
	if (timeframe === 'custom') {
		queryParams.append('from', from);
		queryParams.append('to', to);
	}
}

// handle features array
function appendFeatures(queryParams, features) {
	if (features?.length) {
		features.forEach((feature) => queryParams.append('features[]', feature));
	}
}

// handle filters
function appendFilters(queryParams, filters) {
	if (filters && Object.keys(filters).length > 0) {
		Object.entries(filters).forEach(([_, section]) => {
			Object.entries(section).forEach(([sectionKey, value]) => {
				if (Array.isArray(value)) {
					value.forEach((item) => queryParams.append(`${sectionKey}[]`, item));
				} else {
					queryParams.append(sectionKey, value !== null ? value : '');
				}
			});
		});
	}
}
