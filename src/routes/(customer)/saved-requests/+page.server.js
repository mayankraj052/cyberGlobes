import { ApiService } from '$lib/services/api-service';

export async function load({ fetch, cookies, url }) {
	let apiService = new ApiService();
	const queryParams = Object.fromEntries(url.searchParams);
	try {
		const accessToken = cookies.get('serviceapp-token');

		if (!accessToken) {
			throw new Error('No authentication token found. Please log in.');
		}
		let pageNumber = '';
		if (queryParams.page != undefined && queryParams.page) {
			pageNumber = '?page=' + queryParams.page;
		}

		const res = await apiService.makeApiCall(
			`saved-requests${pageNumber}`,
			{},
			'GET',
			'json',
			accessToken
		);

		if (!res.success) {
			throw new Error(res.message || 'API request failed.');
		}

		if (res.saved_requests.data.length && res.saved_requests.data.length > 0) {
			return { savedRequests: res.saved_requests };
		}

		return { savedRequests: [] };
	} catch (error) {
		console.error('Error in load function:', error.message);
		return {
			error: error.message || 'Something went wrong while fetching search requests.'
		};
	}
}
