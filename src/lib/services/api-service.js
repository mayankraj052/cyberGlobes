import { API_BASE_URL, AUTH_TOKEN } from '$lib/constants/constants';

export class ApiService {
	/**
	 * @param {string} endpoint
	 * @param {Object} payload
	 * @param {string} method
	 * @param {string} requestType
	 *
	 * @returns {Promise<any>}
	 */
	async makeApiCall(
		endpoint,
		payload = {},
		method = 'GET',
		requestType = 'json',
		access_token = false
	) {
		let headers;
		let fetchOptions;
		let userToken = access_token || localStorage.getItem(AUTH_TOKEN) || false;

		if (requestType !== 'formdata') {
			headers = {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userToken}`
			};

			fetchOptions = {
				method,
				headers
			};
		} else {
			headers = {};
			fetchOptions = {
				method,
				headers
			};
		}

		if (userToken) {
			headers.Authorization = `Bearer ${userToken}`;
		}

		if (method !== 'GET') {
			fetchOptions.body = requestType === 'formdata' ? payload : JSON.stringify(payload);
		}

		const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

		if (requestType === 'blob') {
			return await response.blob();
		}

		return response.json();
	}

	/**
	 * Execute scripter request
	 * @param {string} message - The user's message/query
	 * @param {string} result_id - The result ID from selected step
	 * @param {string} conversation_id - The conversation ID
	 * @param {string} sync - Sync parameter (default "0")
	 * @returns {Promise<any>}
	 */
	async executeScripter(message, result_id, conversation_id, sync = "0") {
		const formData = new FormData();
		formData.append('message', message);
		formData.append('result_id', result_id);
		formData.append('conversation_id', conversation_id);
		formData.append('sync', sync);

		return this.makeApiCall('scripter/execute', formData, 'POST', 'formdata');
	}

	/**
	 * Check scripter status
	 * @param {string} session_id - The session ID from execute response
	 * @returns {Promise<any>}
	 */
	async getScripterStatus(session_id) {
		return this.makeApiCall(`scripter/status/${session_id}`, {}, 'GET');
	}

	/**
	 * Get scripter results (after completion)
	 * @param {string} session_id - The session ID from execute response
	 * @returns {Promise<any>}
	 */
	async getScripterResults(session_id) {
		return this.makeApiCall(`scripter/results/${session_id}`, {}, 'GET');
	}

	/**
	 * Analyze step data for visualization recommendations
	 * @param {string} conversation_id - The conversation ID
	 * @param {string} result_id - The result ID to analyze
	 * @returns {Promise<any>}
	 */
	async analyzeStepForVisualizations(conversation_id, result_id) {
		const formData = new FormData();
		formData.append('conversation_id', conversation_id);
		formData.append('result_id', result_id);

		return this.makeApiCall('scripter/analyze-step', formData, 'POST', 'formdata');
	}

	/**
	 * Update visualization status and link scripter job
	 * @param {number} visualizationId - The visualization ID from database
	 * @param {string} scripterJobId - The scripter job ID to link
	 * @param {string} status - Status to set (processing, completed, failed)
	 * @returns {Promise<any>}
	 */
	async updateVisualizationStatus(visualizationId, scripterJobId, status = 'processing') {
		return this.makeApiCall(
			`insights/visualization/${visualizationId}/status`,
			{
				scripter_job_id: scripterJobId,
				status: status
			},
			'PATCH',
			'json'
		);
	}
}
