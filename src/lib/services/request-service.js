import { ApiService } from './api-service';

export class RequestService {
	constructor() {
		this.apiService = new ApiService();
	}

	async getRequests(pageNumber, accessToken) {
		return this.apiService.makeApiCall(
			`search-requests/${pageNumber}`,
			{},
			'GET',
			'json',
			accessToken
		);
	}
}
