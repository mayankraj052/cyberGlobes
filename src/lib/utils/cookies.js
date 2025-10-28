/**
 * Set a cookie with a given name, value, and expiration days.
 *
 * @param {string} cname - The name of the cookie.
 * @param {string} cvalue - The value of the cookie.
 * @param {number} [exdays=7] - Expiration time in days (default is 7 days).
 */
export function setCookie(cname, cvalue, exdays = 7) {
	let secureFlag = false;
	if (location.protocol === 'https:') {
		secureFlag = true;
	}

	const d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	const expires = `expires=${d.toUTCString()}`;
	document.cookie = `${cname}=${encodeURIComponent(cvalue)}; ${expires}; path=/; SameSite=Strict; ${secureFlag ? 'Secure' : ''}`;
}

/**
 * Get a cookie value by name.
 *
 * @param {string} cname - The name of the cookie.
 * @returns {string|null} - The value of the cookie or `null` if not found.
 */
export function getCookie(cname) {
	const name = cname + '=';
	const decodedCookie = decodeURIComponent(document.cookie);
	const cookies = decodedCookie.split(';');

	for (let cookie of cookies) {
		cookie = cookie.trim();
		if (cookie.startsWith(name)) {
			return cookie.substring(name.length);
		}
	}
	return null;
}

/**
 * Delete a cookie by setting its expiration to the past.
 *
 * @param {string} cname - The name of the cookie to delete.
 */
export function deleteCookie(cname) {
	document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
