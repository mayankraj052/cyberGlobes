<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import mapboxgl from 'mapbox-gl';
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';
	import { MAP_DEFAULT_LOCATION } from '$lib/constants/constants';
	import { ApiService } from '$lib/services/api-service';
	import { getDataFromURL } from '$lib/utils/generalUtils';
	import { base } from '$app/paths';
	import { BarChart, LineChart, PieChart } from 'layerchart';

	export let hasData = false;
	export let selectedStep = '';
	export let lastUserQuery = '';
	export let conversationResults: Array<any> = [];
	export let scripterResults: Array<any> = [];
	export let selectedViewType = 'datatable'; // View type from sidebar: 'datatable' or 'map'

	let mapContainer: HTMLDivElement;
	let map: mapboxgl.Map | null = null;
	
	// API service for scripter endpoints
	let apiService = new ApiService();
	let isLoadingTableData = false;
	let processedTableData: Array<any> = [];
	let processingError: string | null = null;

	// Declare variables before reactive statements
	let tableData: Array<any> = [];
	let tableHeaders: Array<string> = [];
	let tableKeys: Array<string> = [];



	// Get selected step data from conversation results
	function getSelectedStepData(): any {
		if (!selectedStep || !conversationResults.length) return null;
		
		const stepData = conversationResults.find(result => 
			(result.id || `step-${conversationResults.indexOf(result)}`) === selectedStep
		);
		
		return stepData;
	}

	// Transform data for LayerChart BarChart
	function transformDataForBarChart(data: any[]): any[] {
		if (!Array.isArray(data)) return [];
		
		return data.map((item, index) => ({
			date: new Date(item.date) || new Date(item.created_at) || new Date(item.timestamp) || new Date(Date.now() - (data.length - index) * 24 * 60 * 60 * 1000),
			value: typeof item.value === 'number' ? item.value : 
				   typeof item.count === 'number' ? item.count :
				   typeof item.likes === 'number' ? item.likes :
				   typeof item.comments === 'number' ? item.comments :
				   Math.floor(Math.random() * 100) + 1,
			baseline: typeof item.baseline === 'number' ? item.baseline : Math.floor(Math.random() * 80) + 20
		}));
	}

	// Transform data for LayerChart LineChart
	function transformDataForLineChart(data: any[]): any[] {
		if (!Array.isArray(data)) return [];
		
		return data.map((item, index) => ({
			date: new Date(item.date) || new Date(item.created_at) || new Date(item.timestamp) || new Date(Date.now() - (data.length - index) * 24 * 60 * 60 * 1000),
			value: typeof item.value === 'number' ? item.value : 
				   typeof item.count === 'number' ? item.count :
				   typeof item.likes === 'number' ? item.likes :
				   typeof item.comments === 'number' ? item.comments :
				   Math.floor(Math.random() * 100) + 1
		}));
	}

	// Transform data for LayerChart PieChart
	function transformDataForPieChart(data: any[]): any[] {
		if (!Array.isArray(data)) return [];
		
		// Group data by categories
		const grouped = data.reduce((acc, item) => {
			const key = item.category || item.type || item.fruit || item.name || 'Unknown';
			const value = typeof item.value === 'number' ? item.value : 
						  typeof item.count === 'number' ? item.count :
						  typeof item.likes === 'number' ? item.likes :
						  typeof item.comments === 'number' ? item.comments : 1;
			
			if (acc[key]) {
				acc[key] += value;
			} else {
				acc[key] = value;
			}
			return acc;
		}, {});
		
		return Object.entries(grouped).map(([fruit, value]) => ({
			year: new Date().getFullYear(),
			basket: 1,
			fruit,
			value: value as number
		}));
	}

	// Dummy data for demonstration
	const dummyBarData = [
		{ date: new Date('2025-09-26T18:30:00.000Z'), value: 100, baseline: 98 },
		{ date: new Date('2025-09-27T18:30:00.000Z'), value: 50, baseline: 54 },
		{ date: new Date('2025-09-28T18:30:00.000Z'), value: 93, baseline: 77 },
		{ date: new Date('2025-09-29T18:30:00.000Z'), value: 57, baseline: 31 },
		{ date: new Date('2025-09-30T18:30:00.000Z'), value: 82, baseline: 51 },
		{ date: new Date('2025-10-01T18:30:00.000Z'), value: 100, baseline: 40 },
		{ date: new Date('2025-10-02T18:30:00.000Z'), value: 52, baseline: 82 },
		{ date: new Date('2025-10-03T18:30:00.000Z'), value: 40, baseline: 44 },
		{ date: new Date('2025-10-04T18:30:00.000Z'), value: 61, baseline: 72 },
		{ date: new Date('2025-10-05T18:30:00.000Z'), value: 90, baseline: 82 }
	];

	const dummyLineData = [
		{ date: new Date('2025-09-06T18:30:00.000Z'), value: 59 },
		{ date: new Date('2025-09-07T18:30:00.000Z'), value: 74 },
		{ date: new Date('2025-09-08T18:30:00.000Z'), value: 55 },
		{ date: new Date('2025-09-09T18:30:00.000Z'), value: 85 },
		{ date: new Date('2025-09-10T18:30:00.000Z'), value: 82 },
		{ date: new Date('2025-09-11T18:30:00.000Z'), value: 95 },
		{ date: new Date('2025-09-12T18:30:00.000Z'), value: 100 },
		{ date: new Date('2025-09-13T18:30:00.000Z'), value: 97 },
		{ date: new Date('2025-09-14T18:30:00.000Z'), value: 69 },
		{ date: new Date('2025-09-15T18:30:00.000Z'), value: 59 }
	];

	// Color schemes for charts using your Tailwind design system
	const chartColors = {
		primary: 'hsl(var(--primary))',
		secondary: 'hsl(var(--secondary))',
		accent: 'hsl(var(--accent))',
		muted: 'hsl(var(--muted))',
		destructive: 'hsl(var(--destructive))',
		success: 'hsl(var(--primary-500))',
		warning: 'hsl(var(--destructive-400))',
		info: 'hsl(var(--accent-600))',
		// Surface colors for backgrounds and subtle elements
		surface100: 'hsl(var(--color-surface-100))',
		surface200: 'hsl(var(--color-surface-200))',
		surface300: 'hsl(var(--color-surface-300))',
		surfaceContent: 'hsl(var(--color-surface-content))',
		// Extended palette with various chart colors
		primaryVariants: [
			'hsl(var(--primary))',
			'hsl(var(--primary-600))',
			'hsl(var(--primary-700))',
			'hsl(var(--primary-800))'
		],
		secondaryVariants: [
			'hsl(var(--secondary-600))',
			'hsl(var(--secondary-700))',
			'hsl(var(--secondary-800))',
			'hsl(var(--secondary-900))'
		],
		// Various chart color schemes
		vibrantColors: [
			'hsl(var(--primary))',      // Blue
			'hsl(120 60% 50%)',         // Green
			'hsl(45 90% 55%)',          // Orange/Yellow
			'hsl(300 70% 60%)',         // Purple
			'hsl(15 85% 60%)',          // Red-Orange
			'hsl(200 80% 55%)',         // Cyan
			'hsl(270 60% 65%)',         // Violet
			'hsl(90 55% 50%)'           // Lime Green
		],
		mutedColors: [
			'hsl(var(--muted-600))',
			'hsl(var(--muted-700))',
			'hsl(var(--muted-800))',
			'hsl(var(--secondary-600))',
			'hsl(var(--secondary-700))',
			'hsl(var(--accent-600))',
			'hsl(var(--accent-700))',
			'hsl(var(--accent-800))'
		]
	};

	// Removed dummy pie data - only show real scripter results

	// Chart type selector
	let activeChartType = 'bar';

	const pieChartColors = [
		chartColors.vibrantColors[0],  // Blue
		chartColors.vibrantColors[1],  // Green
		chartColors.vibrantColors[2],  // Orange/Yellow
		chartColors.vibrantColors[3],  // Purple
		chartColors.vibrantColors[4],  // Red-Orange
		chartColors.vibrantColors[5],  // Cyan
		chartColors.vibrantColors[6],  // Violet
		chartColors.vibrantColors[7],  // Lime Green
		chartColors.mutedColors[0],    // Muted fallbacks
		chartColors.mutedColors[1],
		chartColors.mutedColors[2],
		chartColors.mutedColors[3]
	];

	// Reactive data transformations - only transform data for the selected view type
	$: layerChartBarData = (scripterResults.length > 0 && selectedViewType === 'bar')
		? transformDataForBarChart(scripterResults)
		: (selectedViewType === 'bar' ? [] : dummyBarData);

	$: layerChartLineData = (scripterResults.length > 0 && selectedViewType === 'line')
		? transformDataForLineChart(scripterResults)
		: (selectedViewType === 'line' ? [] : dummyLineData);

	$: layerChartPieData = (scripterResults.length > 0 && selectedViewType === 'pie')
		? transformDataForPieChart(scripterResults)
		: [];

	// Debug logging
	$: {
		console.log('Chart data status:', {
			barDataLength: layerChartBarData.length,
			lineDataLength: layerChartLineData.length,
			pieDataLength: layerChartPieData.length,
			hasScripterResults: scripterResults.length > 0,
			activeChartType,
			hasChartData
		});
	}

	// Show charts even without data for demo purposes
	$: hasChartData = true; // Always show charts with dummy data

	// Sync activeChartType with selectedViewType from sidebar
	$: if (selectedViewType === 'pie') {
		activeChartType = 'pie';
	} else if (selectedViewType === 'line') {
		activeChartType = 'line';
	} else if (selectedViewType === 'bar') {
		activeChartType = 'bar';
	}

	// Validation for chart data - check both scripter results and selected view type
	$: hasPieChartData = scripterResults.length > 0 && selectedViewType === 'pie' && layerChartPieData && layerChartPieData.length > 0;
	$: hasLineChartData = scripterResults.length > 0 && selectedViewType === 'line' && layerChartLineData && layerChartLineData.length > 0;
	$: hasBarChartData = scripterResults.length > 0 && selectedViewType === 'bar' && layerChartBarData && layerChartBarData.length > 0;

	// Note: Scripter execution is now handled by InstagramStepsSidebar with Pusher events.
	// Results are passed down via scripterResults prop. This component only displays the data.

	// Create table data from step's json_data URL
	async function createTableFromStepData(stepData: any): Promise<any[]> {
		if (!stepData) return [];
		
		try {
			console.log('Creating table from step data:', stepData);
			
			// Check if step has json_data URL
			if (stepData.json_data) {
				console.log('Fetching data from json_data URL:', stepData.json_data);
				isLoadingTableData = true;
				processingError = null;
				
				try {
					const response = await fetch(stepData.json_data);
					if (!response.ok) {
						throw new Error(`Failed to fetch JSON data: ${response.statusText}`);
					}
					
					const jsonData = await response.json();
					console.log('Fetched JSON data:', jsonData);
					
					// Handle different JSON structures
					if (Array.isArray(jsonData)) {
						return jsonData;
					} else if (jsonData && typeof jsonData === 'object') {
						// If it's an object with a data array property
						if (jsonData.data && Array.isArray(jsonData.data)) {
							return jsonData.data;
						}
						// If it's an object with results array property
						else if (jsonData.results && Array.isArray(jsonData.results)) {
							return jsonData.results;
						}
						// If it's a single object, wrap in array
						else {
							const flattened = flattenObject(jsonData);
							return [flattened];
						}
					}
					
					return [];
				} catch (fetchError) {
					console.error('Error fetching JSON data:', fetchError);
					processingError = `Failed to load data: ${fetchError.message}`;
					return [];
				} finally {
					isLoadingTableData = false;
				}
			}
			
			// Fallback to step data if no json_data URL
			if (stepData.data && Array.isArray(stepData.data)) {
				return stepData.data;
			}
			
			if (Array.isArray(stepData)) {
				return stepData;
			}
			
			if (typeof stepData === 'object' && stepData !== null) {
				const flattened = flattenObject(stepData);
				return [flattened];
			}
			
			return [];
		} catch (error) {
			console.error('Error creating table from step data:', error);
			processingError = `Error processing data: ${error.message}`;
			return [];
		}
	}
	
	// Flatten nested objects for table display
	function flattenObject(obj: any, prefix: string = ''): any {
		const flattened: any = {};
		
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				const newKey = prefix ? `${prefix}_${key}` : key;
				const value = obj[key];
				
				if (value && typeof value === 'object' && !Array.isArray(value)) {
					// Recursively flatten nested objects (limit depth to avoid infinite recursion)
					if (prefix.split('_').length < 3) {
						Object.assign(flattened, flattenObject(value, newKey));
					} else {
						flattened[newKey] = JSON.stringify(value);
					}
				} else {
					flattened[newKey] = value;
				}
			}
		}
		
		return flattened;
	}

	function generateChartData(step: string) {
		switch (step) {
			case 'posts':
				return {
					labels: ['Photo', 'Video', 'Carousel', 'Reel', 'Story'],
					datasets: [{
						label: 'Posts Count',
						data: [25, 19, 15, 20, 12],
						backgroundColor: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6']
					}]
				};
			case 'likes':
				return {
					labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
					datasets: [{
						label: 'Daily Likes',
						data: [1200, 1900, 800, 1500, 2000, 2400, 1800],
						backgroundColor: ['#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E', '#06B6D4', '#3B82F6']
					}]
				};
			case 'comments':
				return {
					labels: ['Positive', 'Neutral', 'Negative'],
					datasets: [{
						label: 'Comment Sentiment',
						data: [65, 25, 10],
						backgroundColor: ['#22C55E', '#6B7280', '#EF4444']
					}]
				};
			default:
				return null;
		}
	}

	// Generate data based on selected step
	function getStepData() {
		return [];
	}

	// Get raw table keys for data mapping
	function getStepTableKeys() {
		console.log('getStepTableKeys called:', {
			scripterResultsLength: scripterResults.length,
			processedTableDataLength: processedTableData.length,
			selectedStep
		});

		// Priority 1: Use scripter results if available
		if (scripterResults && scripterResults.length > 0) {
			const firstRow = scripterResults[0];
			if (firstRow && typeof firstRow === 'object') {
				const keys = Object.keys(firstRow);
				console.log('Using scripter result keys:', keys);
				return keys;
			}
		}

		// Priority 2: Use processed data if available
		if (processedTableData && processedTableData.length > 0) {
			const firstRow = processedTableData[0];
			if (firstRow && typeof firstRow === 'object') {
				const keys = Object.keys(firstRow);
				console.log('Using processed data keys:', keys);
				return keys;
			}
		}

		return [];
	}

	function getStepTableHeaders() {
		console.log('getStepTableHeaders called:', {
			scripterResultsLength: scripterResults.length,
			processedTableDataLength: processedTableData.length,
			selectedStep
		});

		// Priority 1: Use scripter results if available
		if (scripterResults && scripterResults.length > 0) {
			const firstRow = scripterResults[0];
			if (firstRow && typeof firstRow === 'object') {
				const headers = Object.keys(firstRow).map(key => 
					// Convert camelCase/snake_case to Title Case
					key.replace(/([A-Z])/g, ' $1')
					   .replace(/_/g, ' ')
					   .replace(/^\w/, c => c.toUpperCase())
					   .trim()
				);
				console.log('Using scripter result headers:', headers);
				return headers;
			}
		}

		// Priority 2: Use processed data if available
		if (processedTableData && processedTableData.length > 0) {
			const firstRow = processedTableData[0];
			if (firstRow && typeof firstRow === 'object') {
				const headers = Object.keys(firstRow).map(key => 
					// Convert camelCase/snake_case to Title Case
					key.replace(/([A-Z])/g, ' $1')
					   .replace(/_/g, ' ')
					   .replace(/^\w/, c => c.toUpperCase())
					   .trim()
				);
				console.log('Using processed data headers:', headers);
				return headers;
			}
		}

		return [];
	}

	// Use scripter results first, then processed data, then mock data
	$: {
		if (scripterResults && scripterResults.length > 0) {
			tableData = [...scripterResults]; // Create a copy to trigger reactivity
			console.log('Using scripter results for table data:', tableData.length, 'rows');
		} else if (processedTableData && processedTableData.length > 0) {
			tableData = [...processedTableData];
			console.log('Using processed table data:', tableData.length, 'rows');
		} else if (hasData && selectedStep) {
			tableData = getStepData();
			console.log('Using mock step data:', tableData.length, 'rows');
		} else {
			tableData = [];
			console.log('No table data available');
		}
	}

	// Auto-generate table data when a step is selected
	$: if (selectedStep && conversationResults.length > 0) {
		const stepData = getSelectedStepData();
		if (stepData && !scripterResults.length) {
			console.log('Auto-generating table data for selected step:', selectedStep);
			// Reset previous state
			processedTableData = [];
			processingError = null;
			// Create new table data asynchronously
			createTableFromStepData(stepData).then(data => {
				processedTableData = data;
				console.log('Table data updated:', data.length, 'rows');
			}).catch(error => {
				console.error('Failed to create table data:', error);
				processingError = error.message;
			});
		}
	}
	$: chartData = (hasData && selectedStep) || scripterResults.length > 0 ? generateChartData(selectedStep) : null;
	// Map sidebar view types to tab values - handle all chart types (pie, line, bar) to show 'chart' tab
	$: currentViewType = selectedViewType === 'map' ? 'map'
	                   : (selectedViewType === 'pie' || selectedViewType === 'line' || selectedViewType === 'bar' || selectedViewType === 'chart') ? 'chart'
	                   : 'table';
	
	// Debug logging for view type
	$: {
		console.log('VisualizationPanel - View type:', {
			selectedViewType,
			currentViewType,
			scripterResultsLength: scripterResults.length
		});
	}
	
	// Force reactive updates when scripter results change
	$: {
		// Trigger recalculation when scripter results change
		const _ = scripterResults.length;
		tableHeaders = getStepTableHeaders();
		tableKeys = getStepTableKeys();
		console.log('Table structure updated:', { headers: tableHeaders.length, keys: tableKeys.length });
	}

	// Debug reactive statements
	$: console.log('Debug - VisualizationPanel reactive data:', {
		scripterResults: scripterResults.length,
		scripterResultsData: scripterResults,
		processedTableData: processedTableData.length,
		hasData,
		selectedStep,
		tableData: tableData.length,
		tableDataContent: tableData,
		tableHeaders: tableHeaders.length,
		tableHeadersContent: tableHeaders,
		tableKeys: tableKeys.length,
		tableKeysContent: tableKeys,
		firstRow: tableData[0]
	});

	// Additional debug for scripter results specifically
	$: if (scripterResults.length > 0) {
		console.log('Scripter Results Details:', {
			count: scripterResults.length,
			firstItem: scripterResults[0],
			allKeys: scripterResults[0] ? Object.keys(scripterResults[0]) : [],
			dataTypes: scripterResults[0] ? Object.entries(scripterResults[0]).map(([key, value]) => ({key, type: typeof value, sample: value})) : []
		});
	}

	// Initialize map when conditions are met
	$: if (mapContainer && !map && hasData && currentViewType === 'map') {
		console.log('Conditions met for map initialization:', { mapContainer: !!mapContainer, map: !!map, hasData, currentViewType });
		setTimeout(() => {
			if (mapContainer && !map) {
				console.log('Timeout: Initializing map');
				initializeMap();
			}
		}, 500);
	}

	// Watch for step changes to reinitialize map with new data
	$: if (map && selectedStep) {
		// Clear existing markers and add new ones
		setTimeout(() => {
			const markers = document.querySelectorAll('.mapboxgl-marker');
			markers.forEach(marker => marker.remove());
			addDataPinsToMap();
		}, 100);
	}

	// Watch for scripter results changes to refresh map pins
	$: if (map && scripterResults && scripterResults.length > 0 && currentViewType === 'map') {
		console.log('Scripter results updated, refreshing map pins...');
		setTimeout(() => {
			// Clear existing markers
			const markers = document.querySelectorAll('.mapboxgl-marker');
			markers.forEach(marker => marker.remove());
			// Add new pins from updated scripter results
			addDataPinsToMap();
		}, 200);
	}

	// Alternative trigger - watch for tab changes
	let currentTabValue = currentViewType;
	$: {
		if (currentViewType !== currentTabValue) {
			currentTabValue = currentViewType;
			if (currentViewType === 'map' && mapContainer && !map && hasData) {
				console.log('Tab changed to map, initializing...');
				setTimeout(initializeMap, 500);
			}
		}
	}

	// Map functionality - Process scripter data for map pins
	function processDataForMapPins(): any[] {
		if (!scripterResults || scripterResults.length === 0) {
			console.log('No scripter results available for map pins');
			return [];
		}

		const pins = [];
		console.log('Processing scripter results for map pins:', scripterResults);
		console.log('Sample scripter result item:', scripterResults[0]);

		scripterResults.forEach((item, index) => {
			// Scripter returns data in format: { lat, lng, city, title, caption }
			// But also handle alternative formats from real scripter data
			let lat, lng, city, title, caption;

			// Primary format: direct lat/lng fields
			if (item.lat !== undefined && item.lng !== undefined) {
				lat = parseFloat(item.lat);
				lng = parseFloat(item.lng);
				city = item.city || 'Unknown Location';
				title = item.title || `Data Point ${index + 1}`;
				caption = item.caption || 'Generated from data analysis';
			}
			// Alternative format: location field
			else if (item.location && typeof item.location === 'object') {
				lat = parseFloat(item.location.lat || item.location.latitude);
				lng = parseFloat(item.location.lng || item.location.longitude);
				city = item.location.city || item.city || 'Unknown Location';
				title = item.title || item.name || `Data Point ${index + 1}`;
				caption = item.caption || item.description || 'Generated from data analysis';
			}
			// Alternative format: coordinates array [lng, lat]
			else if (item.coordinates && Array.isArray(item.coordinates) && item.coordinates.length >= 2) {
				lng = parseFloat(item.coordinates[0]);
				lat = parseFloat(item.coordinates[1]);
				city = item.city || item.name || 'Unknown Location';
				title = item.title || item.name || `Data Point ${index + 1}`;
				caption = item.caption || item.description || 'Generated from data analysis';
			}
			// Fallback: try common field names
			else {
				lat = parseFloat(item.latitude || item.lat);
				lng = parseFloat(item.longitude || item.lng || item.lon);
				city = item.city || item.location || item.place || 'Unknown Location';
				title = item.title || item.name || item.label || `Data Point ${index + 1}`;
				caption = item.caption || item.description || item.text || 'Generated from data analysis';
			}

			console.log(`Item ${index} coordinates:`, { lat, lng, city, title, item });

			// Validate coordinates
			if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
				pins.push({
					id: index + 1,
					lat: lat,
					lng: lng,
					city: city,
					title: title,
					caption: caption,
					data: item // Include original data for popup details
				});
				console.log(`✓ Valid pin created for item ${index}:`, { lat, lng, city, title });
			} else {
				console.warn(`✗ Invalid coordinates for item ${index}:`, { lat, lng, city, title, item });
			}
		});

		console.log(`Generated ${pins.length} map pins from ${scripterResults.length} data items`);
		return pins;
	}

	function initializeMap() {
		if (!mapContainer || map) return;

		try {
			console.log('Initializing map with token:', PUBLIC_MAPBOX_ACCESS_TOKEN ? 'Token available' : 'No token');
			
			if (!PUBLIC_MAPBOX_ACCESS_TOKEN) {
				console.error('Mapbox access token is not available');
				return;
			}

			mapboxgl.accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;

			map = new mapboxgl.Map({
				container: mapContainer,
				style: 'mapbox://styles/mapbox/streets-v12',
				center: [MAP_DEFAULT_LOCATION.lng, MAP_DEFAULT_LOCATION.lat],
				zoom: 2,
				attributionControl: false
			});

		map.on('load', () => {
			console.log('Map loaded successfully');
			addDataPinsToMap();
		});			map.on('error', (e) => {
				console.error('Map error:', e);
			});

			// Force trigger load event after timeout if it doesn't fire
			setTimeout(() => {
				if (map && map.loaded()) {
					console.log('Map was already loaded, adding pins');
					addDataPinsToMap();
				}
			}, 2000);

		} catch (error) {
			console.error('Failed to initialize map:', error);
		}
	}

	function addDataPinsToMap() {
		if (!map) {
			console.log('Map not initialized, cannot add pins');
			return;
		}

		console.log('Adding pins to map...');
		const pins = processDataForMapPins();

		if (pins.length === 0) {
			console.log('No valid coordinates found in data for map pins');
			return;
		}

		console.log(`Adding ${pins.length} pins to map`);
		pins.forEach((pin, index) => {
			// Create popup using the specific scripter format: title, caption, city
			const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
				<div class="p-3 max-w-xs">
					<h3 class="font-semibold text-sm mb-2">${pin.title}</h3>
					<p class="text-xs text-muted-foreground mb-2">${pin.caption}</p>
					<div class="flex items-center gap-1 text-xs text-blue-600 mb-2">
						<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
						</svg>
						${pin.city}
					</div>
					<div class="text-xs text-muted-foreground border-t pt-2">
						<p><strong>Coordinates:</strong> ${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}</p>
					</div>
				</div>
			`);

			// Create marker with dynamic color based on data or step
			const marker = new mapboxgl.Marker({
				color: selectedStep === 'posts' ? '#8B5CF6' : selectedStep === 'likes' ? '#EF4444' : '#3B82F6'
			})
				.setLngLat([pin.lng, pin.lat])
				.setPopup(popup)
				.addTo(map);

			console.log(`✓ Added marker ${index + 1} at [${pin.lng}, ${pin.lat}] for ${pin.title}`);
		});

		// Fit map to show all pins if there are multiple
		if (pins.length > 1) {
			const bounds = new mapboxgl.LngLatBounds();
			pins.forEach(pin => bounds.extend([pin.lng, pin.lat]));
			map.fitBounds(bounds, { padding: 50 });
		} else if (pins.length === 1) {
			// Center on single pin
			map.setCenter([pins[0].lng, pins[0].lat]);
			map.setZoom(10);
		}

		// Force map refresh to ensure markers are visible
		setTimeout(() => {
			if (map) {
				map.resize();
				map.triggerRepaint();
			}
		}, 100);
	}

	function destroyMap() {
		if (map) {
			map.remove();
			map = null;
		}
	}

	onDestroy(() => {
		destroyMap();
	});

	// Auto-initialize map when container is available
	onMount(() => {
		if (currentViewType === 'map' && hasData) {
			setTimeout(() => {
				if (mapContainer && !map) {
					console.log('OnMount: Initializing map');
					initializeMap();
				}
			}, 200);
		}
	});

	// Svelte action to auto-initialize map when element is visible
	function autoInitMap(node: HTMLElement) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting && !map && hasData) {
					console.log('Map container is visible, initializing...');
					setTimeout(initializeMap, 100);
				}
			});
		}, { threshold: 0.1 });

		observer.observe(node);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}

	function exportStepData(format: 'json') {
		const stepData = getSelectedStepData();
		if (!stepData || !stepData.json_data) return;
		
		// Open JSON file URL in a new tab
		window.open(stepData.json_data, '_blank');
	}
</script>

<Card class="h-full overflow-y-auto">
	<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
		<div class="flex items-center gap-2">
			<CardTitle class="text-lg font-semibold">Data Visualization</CardTitle>
		</div>
		{#if getSelectedStepData()?.json_data}
			<div class="flex gap-2">
				<Button variant="outline" size="sm" on:click={() => exportStepData('json')}>
					<Icon icon="lucide:download" class="w-4 h-4 mr-2" />
					JSON
				</Button>
			</div>
		{/if}
	</CardHeader>
	
	<CardContent class="flex-1">
		{#if (!hasData || !selectedStep) && scripterResults.length === 0}
			<div class="flex flex-col items-center justify-center h-[400px] text-center">
				<Icon icon="lucide:bar-chart-3" class="w-16 h-16 text-muted-foreground mb-4" />
				<h3 class="text-lg font-medium text-muted-foreground mb-2">Select a Data Category</h3>
				<p class="text-sm text-muted-foreground max-w-md">
					Choose an Instagram data category from the sidebar, then ask questions like:
					<br><strong>"Show me a table"</strong>, <strong>"Create a bar chart"</strong>, or <strong>"Make a pie chart"</strong>
				</p>
			</div>
		{:else}
			<Tabs value={currentViewType} class="w-full h-full">
				<TabsList class="grid w-full grid-cols-3 mb-4">
					<TabsTrigger value="table" class="flex items-center gap-2">
						<Icon icon="lucide:table" class="w-4 h-4" />
						Table View
					</TabsTrigger>
					<TabsTrigger value="chart" class="flex items-center gap-2">
						<Icon icon="lucide:bar-chart" class="w-4 h-4" />
						Chart View
					</TabsTrigger>
					<TabsTrigger value="map" class="flex items-center gap-2">
						<Icon icon="lucide:map" class="w-4 h-4" />
						Map View
					</TabsTrigger>
				</TabsList>

				<TabsContent value="table">
					<div class="border rounded-lg overflow-hidden h-full flex flex-col">
						<!-- Table Header with Processing Controls -->
						<div class="border-b bg-muted/50 p-3 flex items-center justify-between">
							<div class="flex items-center gap-2">
								<Icon icon="lucide:table" class="w-4 h-4" />
								<span class="font-medium">
									{processedTableData.length > 0 ? 'Processed Data' : 'Data Table'}
								</span>
								{#if processedTableData.length > 0}
									<span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
										{processedTableData.length} rows
									</span>
								{/if}
							</div>
							<div class="flex items-center gap-2">
								{#if getSelectedStepData()}
									<Button 
										size="sm" 
										variant="outline"
										on:click={async () => {
											const stepData = getSelectedStepData();
											if (stepData) {
												// Reset state and create new table
												processedTableData = [];
												processingError = null;
												try {
													const data = await createTableFromStepData(stepData);
													processedTableData = data;
												} catch (error) {
													processingError = error.message;
												}
											}
										}}
										disabled={isLoadingTableData}
									>
										{#if isLoadingTableData}
											<Icon icon="lucide:loader-2" class="w-3 h-3 mr-1 animate-spin" />
											Loading...
										{:else}
											<Icon icon="lucide:refresh-cw" class="w-3 h-3 mr-1" />
											Refresh Table Data
										{/if}
									</Button>
								{/if}
								{#if processedTableData.length > 0}
									<Button 
										size="sm" 
										variant="ghost"
										on:click={() => { processedTableData = []; processingError = null; }}
									>
										<Icon icon="lucide:x" class="w-3 h-3 mr-1" />
										Clear
									</Button>
								{/if}
							</div>
						</div>

						<!-- Error Display -->
						{#if processingError}
							<div class="p-4 bg-red-50 border-b">
								<div class="flex items-center gap-2 text-red-800 text-sm">
									<Icon icon="lucide:alert-circle" class="w-4 h-4" />
									<span class="font-medium">Processing Error:</span>
									<span>{processingError}</span>
								</div>
							</div>
						{/if}

						<!-- Loading State -->
						{#if isLoadingTableData}
							<div class="flex-1 flex items-center justify-center">
								<div class="text-center">
									<Icon icon="lucide:loader-2" class="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
									<p class="text-sm text-muted-foreground">Processing step data...</p>
									<p class="text-xs text-muted-foreground mt-1">This may take a few minutes</p>
								</div>
							</div>
						{:else}
							<!-- Table Content -->
							{#if tableData.length > 0 && tableHeaders.length > 0}
								<div class="flex-1 overflow-x-auto overflow-y-auto">
									<table class="w-full text-sm">
										<thead class="bg-muted sticky top-0">
											<tr>
												{#each tableHeaders as header}
													<th class="text-left p-3 font-medium">{header}</th>
												{/each}
											</tr>
										</thead>
										<tbody>
											{#each tableData as row, rowIndex}
											<tr class="border-t hover:bg-muted/50">
												{#each tableKeys as key, keyIndex}
													{@const value = row[key]}
													<td class="p-3">
														{#if key === 'image_url' || key === 'imageUrl'}
															<!-- Image thumbnail -->
															{#if value}
																<div class="flex items-center gap-2">
																	<img 
																		src={value} 
																		alt="Thumbnail" 
																		class="w-12 h-12 object-cover rounded-md border"
																		on:error={(e) => {
																			e.target.style.display = 'none';
																			e.target.nextElementSibling.style.display = 'flex';
																		}}
																	/>
																	<div class="w-12 h-12 bg-muted rounded-md border flex items-center justify-center text-xs text-muted-foreground" style="display: none;">
																		No Img
																	</div>
																	<a href={value} target="_blank" rel="noopener noreferrer" class="text-xs text-blue-600 hover:underline truncate max-w-[100px]">
																		View
																	</a>
																</div>
															{:else}
																<span class="text-muted-foreground text-xs">No Image</span>
															{/if}
														{:else if key.toLowerCase().includes('price') && value}
															<!-- Price formatting -->
															<span class="font-medium text-green-600">{value}</span>
														{:else if key.toLowerCase().includes('location') && value}
															<!-- Location formatting -->
															<span class="inline-flex items-center gap-1 text-sm">
																<Icon icon="lucide:map-pin" class="w-3 h-3 text-blue-500" />
																{value}
															</span>
														{:else if key.toLowerCase().includes('id') && value}
															<!-- ID formatting -->
															<span class="font-mono text-xs bg-muted px-2 py-1 rounded">{value}</span>
														{:else if typeof value === 'number' && value > 100}
															<!-- Large number formatting -->
															<span class="font-mono">{value.toLocaleString()}</span>
														{:else if value && value.toString().startsWith('http')}
															<!-- URL formatting -->
															<a href={value} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline text-sm truncate max-w-[150px] block">
																Link
															</a>
														{:else}
															<!-- Default value display -->
															{value || '-'}
														{/if}
													</td>
												{/each}
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
							{:else}
								<!-- Table Placeholder -->
								<div class="flex-1 flex flex-col items-center justify-center text-center p-8">
									<div class="mb-6">
										<Icon icon="lucide:table" class="w-20 h-20 text-muted-foreground/40 mx-auto mb-4" />
										<h3 class="text-xl font-semibold text-foreground mb-2">No Table Data Available</h3>
										<p class="text-sm text-muted-foreground max-w-md">
											Select a conversation step from the sidebar and ask for a data table visualization.
											<br><br>
											Example: <strong>"Show me a table"</strong> or <strong>"Display all data in a table"</strong>
										</p>
									</div>
									<div class="flex flex-col gap-2 text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg max-w-md">
										<div class="flex items-start gap-2">
											<Icon icon="lucide:info" class="w-4 h-4 mt-0.5 flex-shrink-0" />
											<span>The scripter will generate table data from the selected conversation step when you submit a query.</span>
										</div>
									</div>
								</div>
							{/if}
						{/if}
					</div>
				</TabsContent>

				<TabsContent value="chart">
					<div class="border rounded-lg overflow-hidden">
						{#if hasChartData}
							<div class="flex flex-col">
								<!-- Header with Chart Type Selection -->
								<div class="flex items-center justify-between p-4 border-b bg-muted/20">
									<h3 class="text-lg font-semibold capitalize">
										Charts
									</h3>
									<div class="flex gap-2">
										<button 
											class={`px-3 py-1 rounded text-sm transition-colors ${
												activeChartType === 'bar' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
											}`}
											on:click={() => activeChartType = 'bar'}
											title="Bar Chart"
										>
											<Icon icon="lucide:bar-chart-3" class="w-4 h-4" />
										</button>
										<button 
											class={`px-3 py-1 rounded text-sm transition-colors ${
												activeChartType === 'line' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
											}`}
											on:click={() => activeChartType = 'line'}
											title="Line Chart"
										>
											<Icon icon="lucide:line-chart" class="w-4 h-4" />
										</button>
										<button 
											class={`px-3 py-1 rounded text-sm transition-colors ${
												activeChartType === 'pie' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
											}`}
											on:click={() => activeChartType = 'pie'}
											title="Pie Chart"
										>
											<Icon icon="lucide:pie-chart" class="w-4 h-4" />
										</button>
									</div>
								</div>

								<!-- LayerChart Content -->
								<div class="flex-1 p-4">
									{#if activeChartType === 'bar'}
										<!-- LayerChart Bar Chart -->
										{#if hasBarChartData}
											<div class="space-y-3">
												<div class="px-4 pt-4">
													<h3 class="text-lg font-semibold text-foreground">Bar Chart</h3>
													<p class="text-sm text-muted-foreground">Data comparison by category</p>
												</div>
												<div class="chart-container h-[350px] p-4 border rounded-sm" style="background: radial-gradient(circle at center, {chartColors.surface100} 0%, {chartColors.surface200} 70%, {chartColors.surface300} 100%);">
													<BarChart
														data={layerChartBarData}
														x="date"
														y="value"
													/>
												</div>
											</div>
										{:else}
											<!-- Bar Chart Placeholder -->
											<div class="h-[450px] flex flex-col items-center justify-center text-center p-8">
												<div class="mb-6">
													<Icon icon="lucide:bar-chart-3" class="w-20 h-20 text-muted-foreground/40 mx-auto mb-4" />
													<h3 class="text-xl font-semibold text-foreground mb-2">No Bar Chart Data Available</h3>
													<p class="text-sm text-muted-foreground max-w-md">
														Select a conversation step from the sidebar and ask for a bar chart visualization.
														<br><br>
														Example: <strong>"Show me comparison by category as a bar chart"</strong>
													</p>
												</div>
												<div class="flex flex-col gap-2 text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg max-w-md">
													<div class="flex items-start gap-2">
														<Icon icon="lucide:info" class="w-4 h-4 mt-0.5 flex-shrink-0" />
														<span>The scripter will generate bar chart data in the required format when you submit a query.</span>
													</div>
												</div>
											</div>
										{/if}
									{:else if activeChartType === 'line'}
										<!-- LayerChart Line Chart -->
										{#if hasLineChartData}
											<div class="space-y-3">
												<div class="px-4 pt-4">
													<h3 class="text-lg font-semibold text-foreground">Line Chart</h3>
													<p class="text-sm text-muted-foreground">Trends over time</p>
												</div>
												<div class="chart-container h-[350px] p-4 border rounded-sm" style="background: radial-gradient(circle at center, {chartColors.surface100} 0%, {chartColors.surface200} 70%, {chartColors.surface300} 100%);">
													<LineChart
														data={layerChartLineData}
														x="date"
														y="value"
													/>
												</div>
											</div>
										{:else}
											<!-- Line Chart Placeholder -->
											<div class="h-[450px] flex flex-col items-center justify-center text-center p-8">
												<div class="mb-6">
													<Icon icon="lucide:line-chart" class="w-20 h-20 text-muted-foreground/40 mx-auto mb-4" />
													<h3 class="text-xl font-semibold text-foreground mb-2">No Line Chart Data Available</h3>
													<p class="text-sm text-muted-foreground max-w-md">
														Select a conversation step from the sidebar and ask for a line chart visualization.
														<br><br>
														Example: <strong>"Show me trend over time as a line chart"</strong>
													</p>
												</div>
												<div class="flex flex-col gap-2 text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg max-w-md">
													<div class="flex items-start gap-2">
														<Icon icon="lucide:info" class="w-4 h-4 mt-0.5 flex-shrink-0" />
														<span>The scripter will generate line chart data in the required format when you submit a query.</span>
													</div>
												</div>
											</div>
										{/if}
									{:else if activeChartType === 'pie'}
										<!-- LayerChart Pie Chart -->
										{#if hasPieChartData}
											<div class="space-y-4">
												<div class="px-4 pt-4">
													<h3 class="text-lg font-semibold text-foreground">Pie Chart</h3>
													<p class="text-sm text-muted-foreground">Breakdown by category</p>
												</div>
												<div class="chart-container h-[350px] p-4 border rounded-sm" style="background: radial-gradient(circle at center, {chartColors.surface100} 0%, {chartColors.surface200} 70%, {chartColors.surface300} 100%);">
													<PieChart
														data={layerChartPieData}
														key="fruit"
														value="value"
													/>
												</div>

												<!-- Pie Chart Legend -->
												<div class="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-lg border" style="background: linear-gradient(135deg, {chartColors.surface100} 0%, {chartColors.surface200} 100%);">
													{#each layerChartPieData as item, index}
														<div class="flex items-center gap-3 text-sm p-2 rounded-md hover:shadow-sm transition-all bg-surface-300">
															<div
																class="w-5 h-5 rounded-full flex-shrink-0 shadow-sm border"
																style="background-color: {pieChartColors[index % pieChartColors.length]}; border-color: hsl(var(--border));"
															></div>
															<div class="flex-1 min-w-0">
																<div class="font-semibold truncate" style="color: {chartColors.surfaceContent};">{item.fruit}</div>
																<div class="text-xs font-medium" style="color: hsl(var(--muted-foreground));">{item.value.toLocaleString()}</div>
															</div>
														</div>
													{/each}
												</div>
											</div>
										{:else}
											<!-- Pie Chart Placeholder -->
											<div class="h-[450px] flex flex-col items-center justify-center text-center p-8">
												<div class="mb-6">
													<Icon icon="lucide:pie-chart" class="w-20 h-20 text-muted-foreground/40 mx-auto mb-4" />
													<h3 class="text-xl font-semibold text-foreground mb-2">No Pie Chart Data Available</h3>
													<p class="text-sm text-muted-foreground max-w-md">
														Select a conversation step from the sidebar and ask for a pie chart visualization.
														<br><br>
														Example: <strong>"Show me distribution by category as a pie chart"</strong>
													</p>
												</div>
												<div class="flex flex-col gap-2 text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg max-w-md">
													<div class="flex items-start gap-2">
														<Icon icon="lucide:info" class="w-4 h-4 mt-0.5 flex-shrink-0" />
														<span>The scripter will generate pie chart data in the required format when you submit a query.</span>
													</div>
												</div>
											</div>
										{/if}
									{/if}
								</div>
							</div>
						{:else}
							<div class="h-full flex items-center justify-center">
								<div class="text-center text-muted-foreground">
									<Icon icon="lucide:alert-circle" class="w-16 h-16 mx-auto mb-4 opacity-50" />
									<h3 class="text-xl font-semibold mb-2">Chart Loading Error</h3>
									<p class="text-sm">
										Unable to load chart data. Please try refreshing the page.
									</p>
								</div>
							</div>
						{/if}
					</div>
				</TabsContent>

				<TabsContent value="map">
					<div class="h-full border rounded-lg overflow-hidden relative">
						<div bind:this={mapContainer} class="w-full h-full min-h-[600px]" use:autoInitMap>
							{#if mapContainer && !map}
								<div class="flex items-center justify-center h-full bg-muted/10">
									<div class="text-center">
										<Icon icon="lucide:map" class="w-12 h-12 mx-auto mb-2 opacity-50" />
										<p class="text-muted-foreground">Loading map...</p>
										<button 
											class="mt-2 px-3 py-1 bg-primary text-primary-foreground rounded text-xs"
											on:click={initializeMap}
										>
											Initialize Map
										</button>
									</div>
								</div>
							{/if}
						</div>
						
						<!-- Map overlay with stats -->
						<div class="absolute top-4 right-4 bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
							<h4 class="font-semibold text-sm mb-2">Map Overview</h4>
							<div class="space-y-1 text-xs">
								<div class="flex justify-between gap-4">
									<span class="text-muted-foreground">Data Points:</span>
									<span class="font-medium">{scripterResults.length || 0} locations</span>
								</div>
								<div class="flex justify-between gap-4">
									<span class="text-muted-foreground">Data Type:</span>
									<span class="font-medium capitalize">
										{selectedStep ? `Instagram ${selectedStep}` : 'Map Data'}
									</span>
								</div>
								<div class="flex justify-between gap-4">
									<span class="text-muted-foreground">Coverage:</span>
									<span class="font-medium">
										{scripterResults.length > 0 ? 'Dynamic' : 'No Data'}
									</span>
								</div>
								{#if scripterResults.length > 0}
									<div class="flex justify-between gap-4">
										<span class="text-muted-foreground">Status:</span>
										<span class="font-medium text-green-600">Live Data</span>
									</div>
								{/if}
							</div>
						</div>

						<!-- Map controls -->
						<div class="absolute bottom-4 left-4 flex gap-2">
							<Button 
								size="sm" 
								variant="secondary"
								class="bg-background/95 backdrop-blur-sm"
								on:click={() => {
									if (map) {
										destroyMap();
										setTimeout(initializeMap, 100);
									}
								}}
							>
								<Icon icon="lucide:refresh-cw" class="w-4 h-4 mr-1" />
								Refresh
							</Button>
							<Button 
								size="sm" 
								variant="secondary"
								class="bg-background/95 backdrop-blur-sm"
								on:click={() => {
									if (map) {
										map.flyTo({
											center: [MAP_DEFAULT_LOCATION.lng, MAP_DEFAULT_LOCATION.lat],
											zoom: 2,
											duration: 1000
										});
									}
								}}
							>
								<Icon icon="lucide:home" class="w-4 h-4 mr-1" />
								Reset View
							</Button>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		{/if}
	</CardContent>
</Card>

<!-- Map CSS -->
<svelte:head>
	<link href='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css' rel='stylesheet' />
</svelte:head>

<style>
	/* LayerChart Custom Styling */
	:global(.layerchart) {
		font-family: inherit;
	}

	/* Fix transparent fill issues */
	:global(.fill-transparent) {
		fill: transparent !important;
	}

	:global(.fill-none) {
		fill: none !important;
	}

	/* Bar Chart Styling */
	:global(.layerchart .tooltip-rects rect) {
		transition: all 0.2s ease;
		fill: hsl(var(--primary)) !important;
	}

	:global(.layerchart .tooltip-rects rect:hover) {
		fill: hsl(var(--primary) / 0.9) !important;
		stroke: hsl(var(--primary-foreground)) !important;
		stroke-width: 1px !important;
		transform: translateY(-2px);
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)) !important;
	}

	/* Override any default black fills */
	:global(.layerchart rect) {
		fill: hsl(var(--primary)) !important;
	}

	:global(.layerchart rect:hover) {
		fill: hsl(var(--primary) / 0.8) !important;
	}

	/* Line Chart Styling */
	:global(.layerchart .line) {
		transition: all 0.2s ease;
		fill: none !important;
		stroke: hsl(var(--secondary)) !important;
		stroke-width: 2px;
	}

	:global(.layerchart .line:hover) {
		filter: drop-shadow(0 0 4px currentColor);
	}

	:global(.layerchart .dots circle) {
		transition: all 0.2s ease;
		fill: hsl(var(--secondary)) !important;
		stroke: hsl(var(--background)) !important;
		stroke-width: 2px;
	}

	:global(.layerchart .dots circle:hover) {
		transform: scale(1.2);
		filter: brightness(1.2);
	}

	/* Pie Chart Styling */
	:global(.layerchart .arcs path) {
		transition: all 0.2s ease;
		cursor: pointer;
		stroke: hsl(var(--background)) !important;
		stroke-width: 2px;
	}

	:global(.layerchart .arcs path:hover) {
		transform: scale(1.02);
		filter: brightness(1.1) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
	}

	/* Axis Styling */
	:global(.layerchart .axis) {
		font-size: 12px;
	}

	:global(.layerchart .axis .tick line) {
		stroke: hsl(var(--border));
		stroke-opacity: 0.5;
	}

	:global(.layerchart .axis .tick text) {
		fill: hsl(var(--muted-foreground));
		font-size: 11px;
	}

	:global(.layerchart .axis .domain) {
		stroke: hsl(var(--border));
	}

	/* Grid Lines */
	:global(.layerchart .grid line) {
		stroke: hsl(var(--border));
		stroke-opacity: 0.3;
	}

	/* Tooltip Styling */
	:global(.layerchart .tooltip) {
		background: hsl(var(--background));
		border: 1px solid hsl(var(--border));
		border-radius: 6px;
		padding: 8px 12px;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
		font-size: 13px;
		color: hsl(var(--foreground));
		pointer-events: none;
		z-index: 1000;
	}

	/* Chart Container Styling */
	:global(.chart-container) {
		position: relative;
	}

	:global(.chart-container::before) {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, transparent 0%, hsl(var(--primary) / 0.02) 50%, transparent 100%);
		pointer-events: none;
		border-radius: inherit;
	}

	/* LayerChart Tooltip Styling Fix */
	:global(.bg-surface-100\/90) {
		background-color: hsl(var(--color-surface-100) / 0.9) !important;
	}

	:global(.dark .bg-surface-300\/90) {
		background-color: hsl(var(--color-surface-300) / 0.9) !important;
	}

	:global(.text-surface-content) {
		color: hsl(var(--color-surface-content)) !important;
	}

	:global(.text-surface-content\/75) {
		color: hsl(var(--color-surface-content) / 0.75) !important;
	}

	/* LayerChart specific tooltip overrides */
	:global(div[style*="top:"][style*="left:"] .bg-surface-100\/90) {
		background-color: hsl(var(--color-surface-100) / 0.9) !important;
		backdrop-filter: blur(2px) !important;
	}

	:global(.dark div[style*="top:"][style*="left:"] .bg-surface-300\/90) {
		background-color: hsl(var(--color-surface-300) / 0.9) !important;
		backdrop-filter: blur(2px) !important;
	}

	/* Fix for LayerChart color indicators in tooltips */
	:global(.color[style*="--color"]) {
		background-color: var(--color) !important;
	}

	:global(div[style*="--color: hsl(var(--color-primary))"]) {
		--color: hsl(var(--primary)) !important;
	}

	/* Animation for chart loading */
	:global(.layerchart) {
		animation: fadeIn 0.5s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		:global(.layerchart .axis .tick text) {
			font-size: 10px;
		}
		
		:global(.chart-container) {
			height: 250px !important;
		}
	}
</style>