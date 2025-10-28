import { API_BASE_URL, AUTH_TOKEN } from '$lib/constants/constants';

export class EventSourcingService {
	/**
	 * Initialize the SSE.
	 *
	 * @param searchID The search ID.
	 */
	async initializeSSE(searchID) {
		let dataToReturn = {};
		const source = new EventSource(`${API_BASE_URL}map/search-sse/${searchID}`);

		// streeview.
		source.addEventListener('streetview', function (e) {
			const data = JSON.parse(e.data);

			// Add data to show on map.
			dataToReturn['streetview'] = data;
		});

		// twitter.
		source.addEventListener('x-twitter', function (e) {
			const data = JSON.parse(e.data);

			// Add data to show on map.
			dataToReturn['x-twitter'] = data;
		});

		// streetview error.
		source.addEventListener('streetview_error', function (e) {
			const data = JSON.parse(e.data);
			// Add data to show on map.
			dataToReturn['streetview_error'] = data;
		});

		// Twitter error.
		source.addEventListener('x-twitter_error', function (e) {
			const data = JSON.parse(e.data);
			// Add data to show on map.
			dataToReturn['x-twitter_error'] = data;
		});

		// Error.
		source.addEventListener('error', function (e) {
			const data = JSON.parse(e.data);
			// Add data to show on map.
			dataToReturn['error'] = data;
			source.close();

			return dataToReturn;
		});

		// Done.
		source.addEventListener('done', function (e) {
			const data = JSON.parse(e.data);
			// Add data to show on map.
			dataToReturn['done'] = data;
			source.close();

			console.log('done', dataToReturn);

			return dataToReturn;
		});
	}

	/**
	 * Add data to show on map.
	 */
	async addDataToShowOnMap(data) {}
}
