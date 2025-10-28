import { ApiService } from './api-service';

export class SubscriptionService {
	constructor() {
		this.apiService = new ApiService();
	}

	/**
	 * Get Plans.
	 *
	 * @returns {Promise<any>}
	 */
	async getPricingPlans() {
		return this.apiService.makeApiCall('pricing-plans');
	}

	/**
	 * Get Setup Intent.
	 *
	 * @returns {Promise<any>}
	 */
	async getSetupIntent() {
		return this.apiService.makeApiCall('setup-intent', {}, 'post');
	}

	/**
	 * Create Subscription.
	 *
	 * @param {object} payload
	 * @returns {Promise<any>}
	 */
	async createSubscription(payload) {
		return this.apiService.makeApiCall('create-subscription', payload, 'post');
	}

	/**
	 * Get Plan Details.
	 *
	 * @param {string} planId
	 * @returns {Promise<any>}
	 */
	async getPlanDetails(planId) {
		return this.apiService.makeApiCall(`pricing-plans/${planId}`);
	}
}
