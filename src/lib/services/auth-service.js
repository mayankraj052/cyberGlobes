import { ApiService } from './api-service';

export class AuthService {
	constructor() {
		this.apiService = new ApiService();
	}

	/**
	 * Login user.
	 *
	 * @param {Object} payload
	 * @returns {Promise<any>}
	 */
	async login(payload) {
		return this.apiService.makeApiCall('login', payload, 'POST');
	}

	/**
	 * Register user.
	 *
	 * @param {Object} payload
	 * @returns {Promise<any>}
	 */
	async register(payload) {
		return this.apiService.makeApiCall('register', payload, 'POST');
	}

	/**
	 * Forgot password.
	 *
	 * @param {Object} payload
	 * @returns {Promise<any>}
	 */
	async forgotPassword(payload) {
		return this.apiService.makeApiCall('forgot-password', payload, 'POST');
	}

	/**
	 * Reset password.
	 *
	 * @param {Object} payload
	 * @returns {Promise<any>}
	 */
	async resetPassword(payload) {
		return this.apiService.makeApiCall('reset-password', payload, 'POST');
	}

	/**
	 * Verify email.
	 *
	 * @param {Object} payload
	 * @returns {Promise<any>}
	 */
	async verifyEmail(payload) {
		return this.apiService.makeApiCall('email/verify', payload, 'POST');
	}

	/**
	 * Resend Verification email.
	 *
	 * @param {Object} payload
	 * @returns {Promise<any>}
	 */
	async resendVerificationEmail(payload) {
		return this.apiService.makeApiCall('resend-verification-email', payload, 'POST');
	}
}
