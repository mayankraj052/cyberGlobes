import { goto } from '$app/navigation';
import { AUTH_TOKEN, USER_KEY } from '$lib/constants/constants';
import { UserService } from '$lib/services/user-service';
import { writable } from 'svelte/store';
import { resetMode } from 'mode-watcher';
import { setCookie, deleteCookie } from '$lib/utils/cookies';

export const isLoggedIn = writable(false);
export const user = writable(null);

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 */

export function checkAuth() {
	const token = localStorage.getItem(AUTH_TOKEN);
	const userData = localStorage.getItem(USER_KEY);
	if (token && user) {
		isLoggedIn.set(true);
		user.set(JSON.parse(userData));
	} else {
		localStorage.removeItem(AUTH_TOKEN);
		localStorage.removeItem(USER_KEY);
		isLoggedIn.set(false);
		user.set(null);
	}
}

/**
 * Login the user.
 *
 * @param {Object} data The login data.
 *
 * @returns {Promise<void>}
 */
export async function login(data) {
	localStorage.setItem(AUTH_TOKEN, data.access_token);
	localStorage.setItem(USER_KEY, JSON.stringify(data.member));
	setCookie(AUTH_TOKEN, data.access_token, 60);
	isLoggedIn.set(true);
}

export async function getUserData() {
	const userService = new UserService();
	const user = await userService.getProfile();
	if (user.success) {
		localStorage.setItem(USER_KEY, JSON.stringify(user.member));
		getUserDetails();
	} else {
		logout();
	}
}

export function logout() {
	localStorage.removeItem(AUTH_TOKEN);
	localStorage.removeItem(USER_KEY);
	deleteCookie(AUTH_TOKEN);
	resetMode();
	isLoggedIn.set(false);
	user.set(null);
	goto('/login');
}

/**
 * Get the logged-in user's details from local storage
 * @returns {object | null} The user details or null if not available
 */
export function getUserDetails() {
	const userData = localStorage.getItem(USER_KEY);
	user.set(userData ? JSON.parse(userData) : null);
	return userData ? JSON.parse(userData) : null;
}
