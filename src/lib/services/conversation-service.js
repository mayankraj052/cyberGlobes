import { ApiService } from './api-service.js';

export class ConversationService extends ApiService {
	/**
	 * Fetch conversations from the API
	 * @param {number} page - Page number for pagination (default: 1)
	 * @param {number} limit - Number of conversations per page (default: 10)
	 * @returns {Promise<Object>} API response with conversations data
	 */
	async getConversations(page = 1, limit = 10) {
		try {
			const response = await this.makeApiCall(
				`conversations?page=${page}&limit=${limit}`,
				{},
				'GET'
			);
			return response;
		} catch (error) {
			console.error('Error fetching conversations:', error);
			throw error;
		}
	}

	/**
	 * Create a new conversation
	 * @param {Object} conversationData - Data for the new conversation
	 * @returns {Promise<Object>} API response with created conversation
	 */
	async createConversation(conversationData) {
		try {
			const response = await this.makeApiCall(
				'conversations',
				conversationData,
				'POST'
			);
			return response;
		} catch (error) {
			console.error('Error creating conversation:', error);
			throw error;
		}
	}

	/**
	 * Get a specific conversation by ID
	 * @param {string} conversationId - The conversation ID
	 * @returns {Promise<Object>} API response with conversation details
	 */
	async getConversation(conversationId) {
		try {
			const response = await this.makeApiCall(
				`conversations/${conversationId}`,
				{},
				'GET'
			);
			return response;
		} catch (error) {
			console.error('Error fetching conversation:', error);
			throw error;
		}
	}

	/**
	 * Delete a conversation
	 * @param {string} conversationId - The conversation ID to delete
	 * @returns {Promise<Object>} API response
	 */
	async deleteConversation(conversationId) {
		try {
			const response = await this.makeApiCall(
				`conversations/${conversationId}`,
				{},
				'DELETE'
			);
			return response;
		} catch (error) {
			console.error('Error deleting conversation:', error);
			throw error;
		}
	}

	/**
	 * Retrieve a conversation with its messages
	 * @param {string} conversationId - The conversation ID to retrieve
	 * @returns {Promise<Object>} API response with conversation details and messages
	 */
	async retrieveConversation(conversationId) {
		try {
			const response = await this.makeApiCall(
				`insights/retrieve/${conversationId}`,
				{},
				'GET'
			);
			return response;
		} catch (error) {
			console.error('Error retrieving conversation:', error);
			throw error;
		}
	}
}