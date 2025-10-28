import { ApiService } from './api-service';
import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';

export class MapService {
	constructor() {
		this.apiService = new ApiService();
	}

	/**
	 * Save results.
	 *
	 * @param {Object} payload
	 * @returns {Promise<any>}
	 */
	async saveResults(payload) {
		return this.apiService.makeApiCall('save-request', payload, 'POST');
	}

	/**
	 * Load map results.
	 *
	 * @param {Object} payload
	 * @returns {Promise<any>}
	 */
	async getMapResults(payload) {
		return this.apiService.makeApiCall('map/search', payload, 'POST');
	}

	/**
	 * Validate filters.
	 *
	 * @param {Object} payload
	 * @returns {Promise<any>}
	 */
	async validateFilters(payload) {
		return this.apiService.makeApiCall('map/validate-search', payload, 'POST');
	}

	/**
	 * Perform reverse geocoding using Mapbox Geocoding API.
	 * @returns The place name or null if not available
	 * @param {number} lng
	 * @param {number} lat
	 */
	async reverseGeocode(lng, lat) {
		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${PUBLIC_MAPBOX_ACCESS_TOKEN}`;

		try {
			const response = await fetch(url);
			if (!response.ok) {
				console.error('Reverse geocoding API call failed:', response.statusText);
				return null;
			}
			const data = await response.json();
			if (data.features && data.features.length > 0) {
				return data;
			}
			return null;
		} catch (err) {
			console.error('Error during reverse geocoding:', err);
			return null;
		}
	}

	/**
	 * Get Insights.
	 *
	 * @param {Object} payload
	 * @returns {Promise<any>}
	 */
	async getInsights(payload) {
		return this.apiService.makeApiCall('insights/initiate', payload, 'POST');
	}

	/**
	 * Get Prompt Insights.
	 */
	async getPromptInsights(payload, collectionID) {
		return this.apiService.makeApiCall(`insights/generate/${collectionID}`, payload, 'POST');
	}

	/**
	 * Get past insights.
	 */
	async getInsightsHistory(collectionID) {
		return this.apiService.makeApiCall(`insights/retrieve/${collectionID}`);
	}

	async downloadPanoid(requestID, panoid) {
		return this.apiService.makeApiCall(
			`search-requests/${requestID}/${panoid}/download`,
			{},
			'GET',
			'blob'
		);
	}

	async getSearchFilters(payload) {
		return this.apiService.makeApiCall('map/search-filters', payload, 'POST');
	}

	/**
	 * Retrieves the version history by making an API call to the specified endpoint.
	 *
	 * @param {Object} payload - The payload containing the data required for the API request.
	 * @return {Promise<Object>} A promise that resolves to the response from the version history API.
	 */
	async getVersionHistory(payload) {
		return this.apiService.makeApiCall('version-history', payload, 'POST');
	}
}
