<script lang="ts">
	import type { DateRange } from 'bits-ui';
	import { Button } from '$lib/components/ui/button/index.ts';
	import Icon from '@iconify/svelte';
	import { Switch } from '$lib/components/ui/switch';
	import * as Card from '$lib/components/ui/card';
	import * as Sheet from '$lib/components/ui/sheet';

	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		today,
		parseDate
	} from '@internationalized/date';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.ts';

	import { cn } from '$lib/utils.ts';
	import * as Popover from '$lib/components/ui/popover/index.ts';
	import { Label } from '$lib/components/ui/label';
	import { Slider } from '$lib/components/ui/slider';
	import { MapService } from '$lib/services/map-service';
	import AlertError from '$lib/components/form/messages/AlertError.svelte';
	import MapSearchBox from '$lib/components/ui/map/MapSearchBox.svelte';
	import { getDataFromURL, removeDataFromURL } from '$lib/utils/generalUtils';
	import { onMount } from 'svelte';
	import { SOCIAL_MEDIA_PLATFORMS, DATE_RANGE_OPTIONS } from '$lib/constants/constants';
	import XTwitterFilters from './social-filters/XTwitterFilters.svelte';
	import { formatDateToYYYYMMDD } from '$lib/utils/dateTimeUtils';
	import FacebookFilters from './social-filters/FacebookFilters.svelte';
	import FacebookMarketplaceFilters from './social-filters/FacebookMarketplaceFilters.svelte';

	let selectedSource = [];

	// Radius and Resolution slider
	let radiusValue = $state([1]);
	let resolutionValue = $state([5]);

	let selectedLocation = null;
	let timeFrame = $state('24_hours');
	let showDateRange = $state(false);

	// X-Twitter filters
	let xKeywords = $state('');
	let xUsernames = $state('');
	let xPostTypes = $state([
		{ label: 'Top', description: 'Most popular tweets', enabled: true },
		{ label: 'Latest', description: 'Most recent tweets', enabled: true }
	]);

	// Facebook filters
	let fbKeywords = $state('');
	let fbPublicPosts = $state(true);
	let fbRecentPosts = $state('Relevancy');
	let fbEducationId = $state('');
	let fbWorkId = $state('');
	let fbCategoryId = $state('');
	let fbPostTypes = $state([
		{
			label: 'Posts',
			description: 'Enable/Disable the Posts',
			enabled: true,
			subFilters: []
		},
		{ label: 'Users', description: 'Enable/Disable the Users', enabled: true },
		{ label: 'Pages', description: 'Enable/Disable the Pages', enabled: true },
		{ label: 'Groups', description: 'Enable/Disable the Group', enabled: true },
		{ label: 'Events', description: 'Enable/Disable the Events', enabled: true }
	]);

	// Facebook Marketplace filters
	let fbmKeywords = $state('');
	let fbmCategoryId = $state('');
	let fbmMinPrice = $state('');
	let fbmMaxPrice = $state('');
	let fbmSort = $state('');

	// date picker values
	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});
	const todayDate = today(getLocalTimeZone());
	let datePickerValue = $state<DateRange | undefined>({
		start: todayDate,
		end: todayDate
	});
	let startValue = $state<DateValue | undefined>(undefined);

	// Function to initialize values from URL parameters
	function initializeURLData() {
		// check if data present in the url
		const selectedLocationFromURL = getDataFromURL('search');
		const selectedLatitudeFromURL = getDataFromURL('lat');
		const selectedLongitudeFromURL = getDataFromURL('long');
		const selectedFeaturesFromURL = getDataFromURL('features[]');

		if (selectedLocationFromURL && selectedLatitudeFromURL && selectedLongitudeFromURL) {
			selectedLocation = {
				place_name: selectedLocationFromURL,
				latitude: selectedLatitudeFromURL,
				longitude: selectedLongitudeFromURL
			};
		}

		if (selectedFeaturesFromURL) {
			selectedSource = selectedFeaturesFromURL;
		}

		// Radius and resolution value parsing
		const rawRadius = getDataFromURL('radius');
		const rawResolution = getDataFromURL('resolution');
		radiusValue = [parseInt(rawRadius, 10) || 1];
		resolutionValue = [parseInt(rawResolution, 10) || 5];

		// X-Twitter filters from URL
		if (selectedFeaturesFromURL && selectedFeaturesFromURL.includes('x-twitter')) {
			const selectedXKeywordsFromURL = getDataFromURL('xKeywords');
			const selectedXUsernamesFromURL = getDataFromURL('xUsernames');
			const selectedXPostTypesFromURL = getDataFromURL('xPostTypes[]');
			if (selectedXKeywordsFromURL && xKeywords == '') {
				xKeywords = selectedXKeywordsFromURL;
			}
			if (selectedXUsernamesFromURL && xUsernames == '') {
				xUsernames = selectedXUsernamesFromURL;
			}
			if (selectedXPostTypesFromURL) {
				xPostTypes = xPostTypes.map((postType) => {
					postType.enabled = selectedXPostTypesFromURL.includes(postType.label.toLowerCase());

					return postType;
				});
			}
		} else {
			xKeywords = '';
			xUsernames = '';
			xPostTypes = xPostTypes.map((postType) => {
				postType.enabled = true;
				return postType;
			});
		}

		// Fetch timeframe, from, and to
		const timeFrameFromURL = getDataFromURL('timeframe');

		if (timeFrameFromURL === '') {
			timeFrame = '24_hours';
		} else {
			timeFrame = timeFrameFromURL;
		}
	}

	onMount(() => {
		if (getDataFromURL('search')) {
			initializeURLData();
		}

		const timeFrameFromURL = getDataFromURL('timeframe');
		const selectedFeaturesFromURL = getDataFromURL('features[]');
		if (timeFrameFromURL === 'custom' && getDataFromURL('from') && getDataFromURL('to')) {
			showDateRange = true;
			const fromDate = getDataFromURL('from');
			const toDate = getDataFromURL('to');

			datePickerValue.start = parseDate(fromDate);
			datePickerValue.end = parseDate(toDate);
			startValue = parseDate(fromDate);
		} else {
			showDateRange = false;
		}

		if (selectedFeaturesFromURL && selectedFeaturesFromURL.includes('facebook')) {
			// facebook post types
			const fbPostTypesFromURL = getDataFromURL('fbPostTypes[]');
			if (fbPostTypesFromURL) {
				fbPostTypes = fbPostTypes.map((postType) => {
					postType.enabled = fbPostTypesFromURL.includes(postType.label.toLowerCase());

					return postType;
				});
			}

			// Fetch Facebook Keywords
			const fbKeywordsFromURL = getDataFromURL('fbKeywords');
			if (fbKeywordsFromURL) {
				fbKeywords = fbKeywordsFromURL;
			}

			// Fetch Facebook Category ID
			const fbCategoryIdFromURL = getDataFromURL('fbCategoryId');
			if (fbCategoryIdFromURL) {
				fbCategoryId = fbCategoryIdFromURL;
			}

			// Fetch Facebook Education ID
			const fbEducationIdFromURL = getDataFromURL('fbEducationId');
			if (fbEducationIdFromURL) {
				fbEducationId = fbEducationIdFromURL;
			}

			// Fetch Facebook Work ID
			const fbWorkIdFromURL = getDataFromURL('fbWorkId');
			if (fbWorkIdFromURL) {
				fbWorkId = fbWorkIdFromURL;
			}

			// Fetch Facebook Public Posts
			const fbPublicPostsFromURL = getDataFromURL('fbPublicPosts');
			if (fbPublicPostsFromURL) {
				fbPublicPosts = fbPublicPostsFromURL === 'true';
			}

			// Fetch Facebook Recent Posts
			const fbRecentPostsFromURL = getDataFromURL('fbRecentPosts');
			if (fbRecentPostsFromURL) {
				fbRecentPosts = fbRecentPostsFromURL;
			}
		} else {
			fbKeywords = '';
			fbCategoryId = '';
			fbEducationId = '';
			fbWorkId = '';
			fbPublicPosts = true;
			fbRecentPosts = 'Relevancy';
			fbPostTypes = fbPostTypes.map((postType) => {
				postType.enabled = true;
				return postType;
			});
		}

		if (selectedFeaturesFromURL && selectedFeaturesFromURL.includes('facebook-marketplace')) {
			// Fetch Facebook Marketplace Keywords
			const fbmKeywordsFromURL = getDataFromURL('fbmKeywords');
			if (fbmKeywordsFromURL) {
				fbmKeywords = fbmKeywordsFromURL;
			}

			// Fetch Facebook Marketplace Category ID
			const fbmCategoryIdFromURL = getDataFromURL('fbmCategoryId');
			if (fbmCategoryIdFromURL) {
				fbmCategoryId = fbmCategoryIdFromURL;
			}

			// Fetch Facebook Marketplace Min Price
			const fbmMinPriceFromURL = getDataFromURL('fbmMinPrice');
			if (fbmMinPriceFromURL) {
				fbmMinPrice = fbmMinPriceFromURL;
			}

			// Fetch Facebook Marketplace Max Price
			const fbmMaxPriceFromURL = getDataFromURL('fbmMaxPrice');
			if (fbmMaxPriceFromURL) {
				fbmMaxPrice = fbmMaxPriceFromURL;
			}

			// Fetch Facebook Marketplace Sort
			const fbmSortFromURL = getDataFromURL('fbmSort');
			if (fbmSortFromURL) {
				fbmSort = fbmSortFromURL;
			}
		} else {
			fbmKeywords = '';
			fbmCategoryId = '';
			fbmMinPrice = '';
			fbmMaxPrice = '';
			fbmSort = '';
		}
	});

	// Initialize MapService
	const mapService = new MapService();

	// filter values
	let enabledPlatforms = $state(
		Object.fromEntries(SOCIAL_MEDIA_PLATFORMS.map(({ slug }) => [slug, true]))
	);
	$effect(() => {
		const features = getDataFromURL('features[]') || [];
		if (features.length === 0) {
			SOCIAL_MEDIA_PLATFORMS.forEach(({ slug }) => {
				enabledPlatforms[slug] = true;
			});
		} else {
			SOCIAL_MEDIA_PLATFORMS.forEach(({ slug }) => {
				enabledPlatforms[slug] = features.includes(slug);
			});
		}

		showDateRange = timeFrame === 'custom';
	});

	// apply filters
	let errorMessages = $state<string | null>(null);

	function handleLocationSelect(event) {
		selectedLocation = event.detail;
	}

	function updateSelectedSources() {
		selectedSource = SOCIAL_MEDIA_PLATFORMS.filter(({ slug }) => enabledPlatforms[slug]).map(
			({ slug }) => slug
		);
	}
	$effect(updateSelectedSources);

	async function applyFilters() {
		updateSelectedSources();

		removeDataFromURL('request_id');
		removeDataFromURL('req_id');

		if (!selectedLocation) {
			errorMessages = { address: ['Please select a location to continue.'] };
			return;
		}

		if (!selectedSource.length) {
			errorMessages = { features: ['Please select at least one data source to continue.'] };
			return;
		}

		const { place_name, latitude, longitude } = selectedLocation;

		let payload = {
			address: place_name,
			latitude: latitude,
			longitude: longitude,
			radius: radiusValue[0],
			resolution: resolutionValue[0],
			timeframe: timeFrame,
			features: selectedSource
		};

		// If timeframe is not 'custom', remove 'from' and 'to'
		if (timeFrame !== 'custom') {
			removeDataFromURL('from');
			removeDataFromURL('to');
		} else {
			const fromDate = formatDateToYYYYMMDD(datePickerValue?.start?.toDate(getLocalTimeZone()));
			const toDate = formatDateToYYYYMMDD(datePickerValue?.end?.toDate(getLocalTimeZone()));

			payload.from = fromDate;
			payload.to = toDate;
		}

		if (enabledPlatforms['x-twitter']) {
			payload.xKeywords = xKeywords;
			payload.xUsernames = xUsernames;
			payload.xPostTypes = xPostTypes
				.filter((postType) => postType.enabled)
				.map((postType) => postType.label.toLowerCase());
		}

		if (enabledPlatforms['facebook']) {
			payload.fbKeywords = fbKeywords;
			payload.fbPostTypes = fbPostTypes
				.filter((postType) => postType.enabled)
				.map((postType) => postType.label.toLowerCase());

			if (payload.fbPostTypes.includes('posts')) {
				payload.fbPublicPosts = fbPublicPosts;
				payload.fbRecentPosts = fbRecentPosts;
			}

			if (payload.fbPostTypes.includes('users')) {
				payload.fbEducationId = fbEducationId;
				payload.fbWorkId = fbWorkId;
			}

			if (payload.fbPostTypes.includes('pages')) {
				payload.fbCategoryId = fbCategoryId;
			}
		}

		if (enabledPlatforms['facebook-marketplace']) {
			payload.fbmKeywords = fbmKeywords;
			payload.fbmCategoryId = fbmCategoryId;
			payload.fbmMinPrice = fbmMinPrice;
			payload.fbmMaxPrice = fbmMaxPrice;
			payload.fbmSort = fbmSort;
		}

		try {
			const response = await mapService.validateFilters(payload);
			if (!response.success) {
				errorMessages = response.errors ?? null;
			} else {
				errorMessages = null;
				// pass payload in URL
				const url = new URL(window.location.href);
				let baseURL = url.origin + url.pathname.replace(/\/$/, '');
				baseURL = new URL(baseURL);

				Object.entries(payload).forEach(([key, value]) => {
					if (key === 'features') {
						if (value?.length) {
							value.forEach((v) => baseURL.searchParams.append('features[]', v));
						}
					} else if (key === 'xPostTypes') {
						if (value?.length) {
							value.forEach((v) => baseURL.searchParams.append('xPostTypes[]', v));
						}
					} else if (key === 'fbPostTypes') {
						if (value?.length) {
							value.forEach((v) => baseURL.searchParams.append('fbPostTypes[]', v));
						}
					} else {
						if (key === 'longitude') key = 'long';
						if (key === 'latitude') key = 'lat';
						if (key === 'address') key = 'search';

						baseURL.searchParams.set(key, value);
					}
				});

				window.history.replaceState({}, '', baseURL);
				window.location.reload();
			}
		} catch (error) {
			console.error('Error applying filters:', error);
			errorMessages = { general: ['An unexpected error occurred while applying filters.'] };
		}
	}
</script>

<Sheet.Root>
	<Sheet.Trigger>
		<Button variant="outline">
			<Icon class="w-6 h-6 md:me-2 sm:me-0" icon="mage:filter" />
			<span class="hidden md:inline">Filters</span>
		</Button>
	</Sheet.Trigger>
	<Sheet.Content class="flex flex-col h-full" side="right">
		<Sheet.Header class="mb-4">
			<Sheet.Title>Refine Your Search</Sheet.Title>
			<Sheet.Description>
				Adjust the filters below to customize your search results. Click "Apply Filters" once you
			</Sheet.Description>
		</Sheet.Header>

		<AlertError errors={errorMessages} />

		<div class="flex-1 overflow-y-auto overflow-x-hidden border-t border-b border-gray-200 py-2">
			<!-- Address Search -->
			<Card.Root class="mb-4 mt-2">
				<Card.Header>
					<Card.Title>Search Address</Card.Title>
					<Card.Description>Search by entering some address.</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-4">
						<MapSearchBox
							on:select={handleLocationSelect}
							query={getDataFromURL('search')}
							redirectOnSelect={false}
							showSearchButton={false}
						/>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Social Media Selector -->
			<Card.Root class="mb-4 mt-2">
				<Card.Header>
					<Card.Title>Select Data Source</Card.Title>
					<Card.Description
						>Choose the platforms you want to include in your data view.</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<div class="space-y-4">
						<div class="grid gap-6">
							{#each SOCIAL_MEDIA_PLATFORMS as { slug, tabIcon, name }}
								<div class="flex items-center justify-between space-x-4">
									<div class="flex items-center space-x-4">
										<Icon class="w-6 h-6" icon={tabIcon} />
										<div>
											<p class="text-sm font-medium leading-none">{name}</p>
										</div>
									</div>
									<Switch
										bind:checked={enabledPlatforms[slug]}
										on:click={() => (enabledPlatforms[slug] = !enabledPlatforms[slug])}
									/>
								</div>
								{#if slug === 'x-twitter' && enabledPlatforms[slug]}
									<XTwitterFilters bind:xKeywords bind:xUsernames bind:xPostTypes />
								{/if}

								{#if slug === 'facebook' && enabledPlatforms[slug]}
									<FacebookFilters
										bind:fbKeywords
										bind:fbPostTypes
										bind:fbCategoryId
										bind:fbEducationId
										bind:fbWorkId
										bind:fbPublicPosts
										bind:fbRecentPosts
									/>
								{/if}

								{#if slug === 'facebook-marketplace' && enabledPlatforms[slug]}
									<FacebookMarketplaceFilters
										bind:fbmKeywords
										bind:fbmCategoryId
										bind:fbmMinPrice
										bind:fbmMaxPrice
										bind:fbmSort
									/>
								{/if}
							{/each}
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Radius & Resolutions -->
			<Card.Root class="mb-4">
				<Card.Header>
					<Card.Title>Adjust Radius & Resolution</Card.Title>
					<Card.Description>Expand the search area to view more data points.</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="grid gap-4">
						<div class="flex items-center justify-between">
							<Label for="radius">Search Radius</Label>
							<span
								class="text-muted-foreground hover:border-border w-24 rounded-md border border-transparent px-2 py-0.5 text-right text-sm"
							>
								{radiusValue[0]} KM
							</span>
						</div>
						<Slider
							ariaLabel="Radius"
							bind:value={radiusValue}
							id="radius"
							max={100}
							min={1}
							step={1}
						/>
					</div>

					<div class="grid gap-2 pt-2">
						<div class="flex items-center justify-between">
							<Label for="resolution">Search Resolution</Label>
							<span
								class="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm"
							>
								{resolutionValue[0]}
							</span>
						</div>
						<Slider
							ariaLabel="Resolution"
							bind:value={resolutionValue}
							id="resolution"
							max={100}
							min={5}
							step={5}
						/>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Timeframe -->
			<Card.Root class="mb-4">
				<Card.Header>
					<Card.Title>Select a timeframe</Card.Title>
					<Card.Description
						>Select time to include historical data within your search.</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<select
						id="time-frame"
						name="time-frame"
						bind:value={timeFrame}
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						aria-label="Select a timeframe"
					>
						{#each DATE_RANGE_OPTIONS as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
					{#if timeFrame === 'custom'}
						<div class="grid gap-2 mt-4">
							<Popover.Root openFocus>
								<Popover.Trigger asChild let:builder>
									<Button
										builders={[builder]}
										class={cn(
											'justify-start text-left font-normal',
											!datePickerValue && 'text-muted-foreground'
										)}
										variant="outline"
									>
										<Icon class="mr-2 h-4 w-4" icon="lucide:calendar-days" />
										{#if datePickerValue && datePickerValue.start}
											{#if datePickerValue.end}
												{df.format(datePickerValue.start.toDate(getLocalTimeZone()))} - {df.format(
													datePickerValue.end.toDate(getLocalTimeZone())
												)}
											{:else}
												{df.format(datePickerValue.start.toDate(getLocalTimeZone()))}
											{/if}
										{:else if startValue}
											{df.format(startValue.toDate(getLocalTimeZone()))}
										{:else}
											Pick a date
										{/if}
									</Button>
								</Popover.Trigger>
								<Popover.Content align="start" class="w-auto p-0">
									<RangeCalendar
										bind:startValue
										bind:value={datePickerValue}
										initialFocus
										maxValue={todayDate}
										numberOfMonths={2}
										placeholder={datePickerValue?.start}
									/>
								</Popover.Content>
							</Popover.Root>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>

		<Sheet.Footer>
			<Button on:click={applyFilters}>Apply Filters</Button>
			<Sheet.Close>
				<Button variant="ghost">Close</Button>
			</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
