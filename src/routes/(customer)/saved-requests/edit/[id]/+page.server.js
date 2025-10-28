import { ApiService } from '$lib/services/api-service';

export async function load({ fetch, cookies, params }) {
	let apiService = new ApiService();
	try {
		const accessToken = cookies.get('serviceapp-token');

		if (!accessToken) {
			throw new Error('No authentication token found. Please log in.');
		}

		const res = await apiService.makeApiCall(
			`saved-requests/${params.id}`,
			{},
			'GET',
			'json',
			accessToken
		);

		if (!res.success) {
			throw new Error(res.message || 'API request failed.');
		}

		if (Object.keys(res.saved_request).length > 0) {
			return { savedRequest: res.saved_request };
		}

		return { savedRequest: [] };
	} catch (error) {
		console.error('Error in load function:', error.message);
		return {
			error: error.message || 'Something went wrong while fetching search requests.'
		};
	}
}
