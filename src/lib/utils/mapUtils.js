import { MARKER_DEFAULT_COLOR, MARKER_HIGHLIGHT_COLOR } from '$lib/constants/constants.js';
import { MapService } from '$lib/services/map-service.js';
import { hoveredPostId, socialMediaJson, visibility } from '$lib/stores/mapStore.ts';

/**
 * Regular expression to match and extract latitude and longitude coordinates from a string.
 *
 * - The pattern allows optional "Lat: " and "Lng: " prefixes before the latitude and longitude values.
 * - It accepts both positive and negative decimal numbers for latitude and longitude.
 * - Coordinates can be separated by a comma, space, or both.
 * - Leading and trailing spaces around the input string are ignored.
 * - The match is case-insensitive.
 *
 * Groups:
 * 1. Latitude (as a signed decimal number)
 * 2. Longitude (as a signed decimal number)
 */
export const COORDINATES_REGEXP =
	/^\s*(?:Lat: )?(-?\d+(\.\d+)?)[,\s]+(?:Lng: )?(-?\d+(\.\d+)?)\s*$/i;

/**
 * Highlights a map marker by modifying its visual appearance. Optionally animates the map view
 * to center on the marker's location.
 *
 * @param {Object} marker The marker object to be highlighted. Must have methods like `getElement` and `getLngLat`.
 * @param {Object} mapInstance The map instance on which the marker resides. Must support `flyTo` method.
 * @param {boolean} [highlightMarker=false] Determines whether the marker should highlight.
 * @return {void}
 */
export function highlightMarker(marker, mapInstance, highlightMarker = false) {
	if (!marker || !mapInstance) return;

	const element = marker.getElement();

	// Find the SVG element inside the marker
	const svgElement = element.querySelector('svg');
	if (!svgElement) return;

	// Highlight the marker visually
	if (highlightMarker) {
		highlightSvgElement(svgElement);
	} else {
		resetSvgElement(svgElement);
	}
}

/**
 * Animates the map's view to center and zoom in on the specified marker location.
 *
 * @param {Object} marker - The marker object to fly to. Must have a `getElement` method and `getLngLat` method to retrieve its position.
 * @param {Object} mapInstance - The map instance on which the action is to be performed. Must support the `flyTo` method.
 * @return {void} This function does not return a value.
 */
export function flyToMarker(marker, mapInstance) {
	if (!marker || !mapInstance) return;

	const element = marker.getElement();

	// Find the SVG element inside the marker
	const svgElement = element.querySelector('svg');
	if (!svgElement) return;

	// Fly to marker's location
	const [lng, lat] = marker.getLngLat().toArray();
	mapInstance.flyTo({
		center: [lng, lat],
		zoom: 18.5,
		speed: 1.2, // Adjust speed if necessary
		curve: 1.5,
		essential: true
	});
}

/**
 * Highlights an SVG element by applying a scaling transformation and changing its fill color.
 *
 * @param {SVGElement} svgElement - The SVG element to be highlighted.
 * @return {void} This function does not return a value.
 */
function highlightSvgElement(svgElement) {
	svgElement.style.transition = 'transform 0.5s ease-out';
	svgElement.style.transform = 'scale(1.5)';
	svgElement.style.fill = MARKER_HIGHLIGHT_COLOR;
}

/**
 * Resets the transformation and fill color of an SVG element to its default state.
 *
 * @param {SVGElement} svgElement - The SVG element to be reset.
 * @return {void} No return value.
 */
function resetSvgElement(svgElement) {
	svgElement.style.transform = 'scale(1)';
	svgElement.style.fill = MARKER_DEFAULT_COLOR;
}

/**
 * Parses a query string to extract latitude and longitude coordinates, and performs reverse geocoding
 * to fetch associated geolocation features.
 *
 * @param {string} query - The input query containing coordinate data as a string.
 * @return {Array<Object>} An array of geocode features resulting from reverse geocoding. Returns an empty array if parsing fails.
 */
export function parseCoordinates(query) {
	const matches = query.match(COORDINATES_REGEXP);
	if (!matches) {
		return [];
	}

	const longitude = Number(matches[1]);
	const latitude = Number(matches[3]);
	const geocodes = [];

	const mapService = new MapService();
	mapService
		.reverseGeocode(longitude, latitude)
		.then((features) => {
			features.features.forEach((feature) => geocodes.push(feature));
		})
		.catch((error) => {
			console.error('Reverse geocoding failed:', error);
		});

	return geocodes;
}

/**
 * Handles the event when a marker is hovered over by setting the hovered post ID.
 *
 * @param {string|number} postId - The identifier of the post associated with the hovered marker.
 * @return {void} This function does not return a value.
 */
export function handleMarkerHover(postId) {
	hoveredPostId.set(postId);
}

/**
 * Resets the given map by removing specific layers, sources, and markers if they exist.
 *
 * @param {Object} map The map object to be reset.
 * @param {Object} [mapMarker] An optional marker object to be removed from the map.
 * @return {void} Does not return a value.
 */
export function resetMap(map, mapMarker) {
	if (mapMarker) mapMarker.remove();
	if (map.getLayer('layer-with-pulsing-dot')) {
		map.removeLayer('layer-with-pulsing-dot');
	}

	if (map.getSource('dot-point')) {
		map.removeSource('dot-point');
	}

	if (map.hasImage('pulsing-dot')) {
		map.removeImage('pulsing-dot');
	}

	// Reset the state...
	socialMediaJson.set([]);
	visibility.set([]);
}

/**
 * Adds a pulsing dot animation to the specified map at the given coordinates.
 *
 * @param {Object} map - The map object where the pulsing dot animation will be added.
 * @param {Array<number>} coordinates - The `[longitude, latitude]` coordinates where the pulsing dot will be rendered.
 * @return {void} This method does not return a value.
 */
export function addPulsingDotAnimation(map, coordinates) {
	map.addImage('pulsing-dot', pulsingDotAnimation(map), { pixelRatio: 2 });
	map.addSource('dot-point', {
		type: 'geojson',
		data: {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: coordinates
					}
				}
			]
		}
	});
	map.addLayer({
		id: 'layer-with-pulsing-dot',
		type: 'symbol',
		source: 'dot-point',
		layout: {
			'icon-image': 'pulsing-dot'
		}
	});
}

/**
 * Adds a circle with a specified radius to the given map using Turf.js.
 *
 * @param {Object} map - The map object where the circle will be added.
 * @param {Array<number>} coordinates - The coordinates [longitude, latitude] for the center of the circle.
 * @param {Object} turf - The Turf.js library object used to create the circle.
 * @param {number} [radiusInMeters=1000] - The radius of the circle in meters. Default is 1000 meters.
 * @return {Object} - A GeoJSON feature representing the created circle.
 */
export function addCircleRadius(map, coordinates, turf, radiusInMeters = 1000) {
	// Create a GeoJSON feature for the circle
	const circle = turf.circle(coordinates, radiusInMeters / 1000, {
		steps: 64,
		units: 'kilometers'
	});

	// Update the circle source data
	map.getSource('circle').setData({
		type: 'FeatureCollection',
		features: [circle]
	});

	return circle;
}

/**
 * Creates a pulsing dot animation for the given map. The animation consists of a dot
 * that expands and fades in and out repeatedly to create a pulsing effect.
 *
 * @param {Object} map - The map object to which the animation is applied.
 * @return {Object} An object containing the animation configuration, rendering logic,
 * and required data for the pulsing dot animation.
 */
export function pulsingDotAnimation(map) {
	const size = 200;
	return {
		width: size,
		height: size,
		data: new Uint8Array(size * size * 4),

		onAdd: function () {
			const canvas = document.createElement('canvas');
			canvas.width = this.width;
			canvas.height = this.height;
			this.context = canvas.getContext('2d');
		},

		render: function () {
			const duration = 1000;
			const t = (performance.now() % duration) / duration;
			const radius = (size / 2) * 0.3;
			const outerRadius = (size / 2) * 0.7 * t + radius;
			const context = this.context;

			context.clearRect(0, 0, this.width, this.height);
			context.beginPath();
			context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
			context.fillStyle = `rgba(36, 198, 334, ${1 - t})`;
			context.fill();

			context.beginPath();
			context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
			context.fillStyle = 'rgba(36, 98, 234, 1)';
			context.strokeStyle = 'white';
			context.lineWidth = 2 + 4 * (1 - t);
			context.fill();
			context.stroke();

			this.data = context.getImageData(0, 0, this.width, this.height).data;

			map.triggerRepaint();
			return true;
		}
	};
}

/**
 * Highlights a point marker by modifying its visual appearance.
 *
 * @param {Object} marker The point marker object to be highlighted.
 * @param {boolean} [highlight=false] Determines whether the marker should highlight.
 * @return {void}
 */
export function highlightPointMarker(marker, highlight = false) {
	if (!marker) return;

	const element = marker.getElement();
	const svgElement = element.querySelector('svg');
	if (!svgElement) return;

	if (highlight) {
		svgElement.style.transition = 'transform 0.3s ease-out';
		svgElement.style.transform = 'scale(1.2)';
		svgElement.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))';
	} else {
		svgElement.style.transform = 'scale(1)';
		svgElement.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))';
	}
}
