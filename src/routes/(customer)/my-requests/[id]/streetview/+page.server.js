// import { ApiService } from '$lib/services/api-service';

// export async function load({ cookies, params, url }) {
//     const queryParams = Object.fromEntries(url.searchParams);

//     try {
//         let apiService = new ApiService();

//         const accessToken = cookies.get('serviceapp-token');
//         if (!accessToken) {
//             throw new Error('No authentication token found. Please log in.');
//         }

//         let pageNumber = '';
//         if(queryParams.page != undefined && queryParams.page) {
//             pageNumber = '?page='+queryParams.page;
//         }

//         const res = await apiService.makeApiCall(`search-requests/${params.id}/streetview${pageNumber}`, {}, 'GET', 'json', accessToken);

//         if (!res.success) {
//             throw new Error(res.message || 'API request failed.');
//         }

//         return { streetview: res.response || [] };

//     } catch (error) {
//         console.error('Error in load function:', error.message);
//         return {
//             error: error.message || 'Something went wrong while fetching search requests.'
//         };
//     }
// }
