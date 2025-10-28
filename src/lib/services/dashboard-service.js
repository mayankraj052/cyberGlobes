import { ApiService } from './api-service';

export class DashboardService {
	constructor() {
		this.apiService = new ApiService();
	}

	/**
	 * Get dashboard content.
	 *
	 * @returns {Promise<any>}
	 */
	async dashboardContent() {
		return this.apiService.makeApiCall('dashboard-content', {});
	}
}
