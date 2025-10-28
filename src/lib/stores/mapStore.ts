// src/lib/stores/mapStore.ts
import { writable } from 'svelte/store';

// Store to notify map refresh
export const refreshMapTrigger = writable(false);

// search request id to share in components
export const searchRequestID = writable(0);

// handle the mouseover on map marker
export const hoveredPostId = writable(null);

export const dataLoadingState = writable();

export const socialMediaJson = writable([]);

export const visibility = writable([]);

export const activeSocialMedia = writable(null);

export const mapDataLoaded = writable(false);

// Store for handling location updates from chatbot
export const locationUpdate = writable(null);

// Store for received points from PointReceived event
export const receivedPoints = writable([]);

// Function to clear received points
export function clearReceivedPoints() {
	receivedPoints.set([]);
}
