import { writable } from 'svelte/store';
export const TOAST_TYPE = {
	SUCCESS: 'success',
	ERROR: 'error'
	// WARNING: 'warning',
	// INFO: 'info'
};

export const TOAST_POSITION = {
	TOP_LEFT: 'topleft',
	TOP_CENTER: 'topcenter',
	TOP_RIGHT: 'topright',
	BOTTOM_LEFT: 'bottomleft',
	BOTTOM_CENTER: 'bottomcenter',
	BOTTOM_RIGHT: 'bottomright'
};

Object.freeze(TOAST_TYPE);
Object.freeze(TOAST_POSITION);

export const toastMessage = writable('');
export const toastType = writable('');
export const toastPosition = writable('');

export const showToast = ({
	message = '',
	type = TOAST_TYPE.SUCCESS,
	timeout = 3000,
	position = TOAST_POSITION.TOP_RIGHT
}) => {
	toastMessage.set(message);
	toastType.set(type);
	toastPosition.set(position);
	if (timeout > 0) {
		setTimeout(() => {
			hideToast();
		}, timeout);
	}
};

export const hideToast = () => {
	toastMessage.set('');
};

/**
 * Trigger a success toast message.
 *
 * @param {string} message The message to display.
 */
export const triggerSuccessToast = (message) => {
	showToast({ message, type: TOAST_TYPE.SUCCESS });
};

/**
 * Trigger an error toast message.
 *
 * @param {string} message The message to display.
 */
export const triggerErrorToast = (message) => {
	showToast({ message, type: TOAST_TYPE.ERROR });
};
