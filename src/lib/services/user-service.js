import { ApiService } from './api-service';

export class UserService {
	constructor() {
		this.apiService = new ApiService();
	}

	/**
	 * Get user Profile.
	 *
	 * @returns {Promise<any>}
	 */
	async getProfile() {
		return this.apiService.makeApiCall('user', {});
	}

	/**
	 * Update user Profile.
	 *
	 * @param {Object} payload
	 * @param {String} requestType
	 * @returns {Promise<any>}
	 */
	async updateProfile(payload, requestType) {
		return this.apiService.makeApiCall('profile', payload, 'POST', requestType);
	}

	/**
	 * Update user Password.
	 *
	 * @param {Object} payload
	 * @returns {Promise<any>}
	 */
	async updatePassword(payload) {
		return this.apiService.makeApiCall('change-password', payload, 'POST');
	}
}
