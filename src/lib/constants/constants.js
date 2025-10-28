import { PUBLIC_API_URL } from '$env/static/public';
import TwitterIcon from '$lib/assets/svg/marker/x-pin-red-dot.svg?raw';
import TwitterIconHistorical from '$lib/assets/svg/marker/x-pin.svg?raw';
import FacebookIcon from '$lib/assets/svg/marker/facebook-pin-red-dot.svg?raw';
import FacebookIconHistorical from '$lib/assets/svg/marker/facebook-pin.svg?raw';
import FacebookMarketPlaceIcon from '$lib/assets/svg/marker/facebook-marketplace-pin-red-dot.svg?raw';
import FacebookMarketPlaceIconHistorical from '$lib/assets/svg/marker/facebook-marketplace-pin.svg?raw';
import PanoidsIcon from '$lib/assets/svg/marker/panoids-pin.svg?raw';
import LinkedInIcon from '$lib/assets/svg/marker/linkedin-pin.svg?raw';
import InstagramIcon from '$lib/assets/svg/marker/insta-pin.svg?raw';
import GoogleNewsIcon from '$lib/assets/svg/marker/google-news-pin.svg?raw';

// ================= API Constants =================
export const API_BASE_URL = `${PUBLIC_API_URL}/api/v1/`;

// ================= LocalStorage Keys =================
export const AUTH_TOKEN = 'serviceapp-token';
export const USER_KEY = 'serviceapp-user';
export const USER_LAT = 'serviceapp-user-lat';
export const USER_LNG = 'serviceapp-user-lng';
export const AGENT_FROM_HOME = 'serviceapp-agent-from-home';
export const QUERY_BEFORE_LOGIN = 'serviceapp-query-before-login';

// ================= Defaults =================
export const NON_PANEL_ROUTES = ['login', 'register', 'forgot-password', 'reset-password'];
export const MAP_DEFAULT_LOCATION = {
	lat: 26.9124, // Jaipur, Rajasthan, India
	lng: 75.7873 // Jaipur, Rajasthan, India
};

// ================= Fixed URLS =================
export const PANOID_BASE_URL = 'https://www.google.com/maps/@?api=1&map_action=pano&pano=';

// ================= Map Things =================
export const MAPBOX_THEMES = [
	{ name: 'Mapbox Streets', style: 'mapbox://styles/mapbox/streets-v12' },
	{ name: 'Mapbox Outdoors', style: 'mapbox://styles/mapbox/outdoors-v12' },
	{ name: 'Mapbox Light', style: 'mapbox://styles/mapbox/light-v10' },
	{ name: 'Mapbox Dark', style: 'mapbox://styles/mapbox/dark-v10' },
	{ name: 'Mapbox Satellite', style: 'mapbox://styles/mapbox/satellite-v9' },
	{ name: 'Mapbox Satellite Streets', style: 'mapbox://styles/mapbox/satellite-streets-v11' },
	{ name: 'Mapbox Navigation Day', style: 'mapbox://styles/mapbox/navigation-day-v1' },
	{ name: 'Mapbox Navigation Night', style: 'mapbox://styles/mapbox/navigation-night-v1' }
];

export const REFRESH_FREQUENCY_OPTIONS = [
	'No Refresh',
	'Every 5 minutes',
	'Every 10 minutes',
	'Every 15 minutes',
	'Every 30 minutes',
	'Hourly',
	'Every 2 hours',
	'Every 6 hours',
	'Every 12 hours',
	'Daily',
	'Weekly',
	'Monthly',
	'Quarterly',
	'Yearly'
];

export const MARKER_HIGHLIGHT_COLOR = '#448ee4';
export const MARKER_DEFAULT_COLOR = 'black';
export const SOCIAL_MARKER_CLASS = 'social-marker';
export const MARKER_FONT_SIZE = '20px';

export const MAP_PRIMARY_COLOR = '#2462ea';

export const SOCIAL_MEDIA_PLATFORMS = [
	{
		name: 'X (Twitter)',
		slug: 'x-twitter',
		tabIcon: 'ri:twitter-x-fill',
		mapIcon: TwitterIcon,
		mapIconHistorical: TwitterIconHistorical,
		visibility: true,
		tabs: ['Top', 'Latest']
	},
	{
		name: 'Facebook',
		slug: 'facebook',
		tabIcon: 'lucide:facebook',
		mapIcon: FacebookIcon,
		mapIconHistorical: FacebookIconHistorical,
		visibility: true,
		tabs: ['Posts', 'Users', 'Groups', 'Videos', 'Pages', 'Events']
	},
	{
		name: 'Marketplace',
		slug: 'facebook-marketplace',
		tabIcon: 'lucide:facebook',
		mapIcon: FacebookMarketPlaceIcon,
		mapIconHistorical: FacebookMarketPlaceIconHistorical,
		visibility: true,
		tabs: []
	},
	{
		name: 'LinkedIn',
		slug: 'linkedin',
		tabIcon: 'mdi:linkedin',
		mapIcon: LinkedInIcon,
		mapIconHistorical: LinkedInIcon,
		visibility: true,
		tabs: []
	},
	{
		name: 'Instagram',
		slug: 'instagram',
		tabIcon: 'lucide:instagram',
		mapIcon: InstagramIcon,
		mapIconHistorical: InstagramIcon,
		visibility: true,
		tabs: []
	},
	{
		name: 'Google News',
		slug: 'google-news',
		tabIcon: 'simple-icons:googlenews',
		mapIcon: GoogleNewsIcon,
		mapIconHistorical: GoogleNewsIcon,
		visibility: true,
		tabs: []
	},
	{
		name: 'Panoids',
		slug: 'streetview',
		tabIcon: 'lucide:map-pinned',
		mapIcon: PanoidsIcon,
		mapIconHistorical: PanoidsIcon,
		visibility: true,
		tabs: []
	}
];

export const DATE_RANGE_OPTIONS = [
	{ label: '1 hour', value: '1_hour' },
	{ label: '12 hours', value: '12_hours' },
	{ label: '24 hours', value: '24_hours' },
	{ label: '72 hours', value: '72_hours' },
	{ label: '1 week', value: '1_week' },
	{ label: '2 weeks', value: '2_weeks' },
	{ label: '1 month', value: '1_month' },
	{ label: '6 months', value: '6_months' },
	{ label: '1 year', value: '1_year' },
	{ label: 'Custom', value: 'custom' }
];

export const FACEBOOK_CATEGORIES = [
	{ label: 'Local Business or Place', value: '1006' },
	{ label: 'Company, Organization or Institution', value: '1013' },
	{ label: 'Brand or Product', value: '1009' },
	{ label: 'Artist, Band or Public Figure', value: '1007' },
	{ label: 'Entertainment', value: '1019' },
	{ label: 'Cause or Community', value: '2612' }
];

export const FACEBOOK_MARKETPLACE_CATEGORIES = [
	{ label: 'Vehicles', value: '546583916084032' },
	{ label: 'Property for rent', value: '460427381212751' },
	{ label: 'Classifieds', value: '759201041254543' },
	{ label: 'Clothing', value: '677457442746983' },
	{ label: 'Electronics', value: '479353692612078' },
	{ label: 'Entertainment', value: '529595287638583' },
	{ label: 'Family', value: '891748581240437' },
	{ label: 'Free stuff', value: '2796952007029050' },
	{ label: 'Garden and outdoors', value: '1109541402725436' },
	{ label: 'Hobbies', value: '459026188375950' },
	{ label: 'Home goods', value: '753380185098614' },
	{ label: 'Home improvement supplies', value: '476291743038859' },
	{ label: 'Musical instruments', value: '1078592699170502' },
	{ label: 'Office supplies', value: '586894672179024' },
	{ label: 'Pet supplies', value: '197143151659643' },
	{ label: 'Property for sale', value: '1270772586445798' },
	{ label: 'Sporting goods', value: '391335928190702' },
	{ label: 'Toys and games', value: '199404184572737' }
];

export const FACEBOOK_MARKETPLACE_SORT_OPTIONS = [
	{ label: 'Best Match', value: 'BEST_MATCH' },
	{ label: 'Distance Ascending', value: 'DISTANCE_ASCEND' },
	{ label: 'Creation Time Descending', value: 'CREATION_TIME_DESCEND' },
	{ label: 'Price Ascending', value: 'PRICE_ASCEND' },
	{ label: 'Price Descending', value: 'PRICE_DESCEND' }
];


export const ACTION_TYPES = {
	SEARCH_BY_ADDRESS: 'search_by_address',
	SEARCH_BY_AGENT: 'search_by_agent',
	SEARCH_BY_IMAGE: 'search_by_image',
}