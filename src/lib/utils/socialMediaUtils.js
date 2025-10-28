import { PANOID_BASE_URL, SOCIAL_MEDIA_PLATFORMS } from '$lib/constants/constants.js';
import PanoidsIconImg from '$lib/assets/svg/marker/panoids-pin.svg';
import LinkedInIconImg from '$lib/assets/svg/marker/linkedin-pin.svg';
import FacebookIconImg from '$lib/assets/svg/marker/facebook-pin.svg';
import FacebookMarketPlaceIconImg from '$lib/assets/svg/marker/facebook-marketplace-pin.svg';
import InstagramIconImg from '$lib/assets/svg/marker/insta-pin.svg';
import GoogleNewsIconImg from '$lib/assets/svg/marker/google-news.svg';

/**
 * Generates a formatted object containing post data based on the input data and platform details.
 *
 * @param {Array} data - The array of input data to be processed into posts.
 * @param {Object} platformDetails - Details about the platform used to map the data.
 * @param {Function} platformDetails.mapFunction - A function to transform each item in the data array into a post.
 * @param {string} platformDetails.type - The type of platform for which the posts are generated.
 * @param {string} platformDetails.icon - The icon associated with the platform.
 * @return {Object} - An object containing the type, count of posts, platform icon, and the generated posts.
 */
export function generatePostData(data, platformDetails) {
	const { mapFunction, type, icon } = platformDetails;
	const posts = mapFunction(data);

	return {
		type,
		count: posts.length,
		icon,
		posts
	};
}

/**
 * A collection of platform-specific parsers for extracting and normalizing data from various social media and mapping data sources.
 * Each parser function processes platform-specific data and returns a normalized structure for further use.
 *
 * @type {Object<string, Function>}
 *
 * @property {Function} x-twitter - A parser for Twitter data. Processes tweet objects and returns normalized data with properties such as
 * id, title, description, lat, lng, image, and URL.
 *
 * @property {Function} linkedin - A parser for LinkedIn post data. Extracts and normalizes post information including id, title, description,
 * image, lat, lng, and URL.
 *
 * @property {Function} facebook - A parser for Facebook post data. Processes results of posts, normalizing id, title, description, image,
 * lat, lng, and URL.
 *
 * @property {Function} facebook-marketplace - A parser for Facebook Marketplace data. Extracts product details like id, title, description,
 * image, price, currency, and URL while normalizing them for consistent formatting.
 *
 * @property {Function} streetview - A parser for Google Street View data. Normalizes information from panoids to include id, title,
 * description, image, lat, lng, and a URL for the panorama.
 *
 * @property {Function} google-news - A parser for Google News data. Extracts article information including id, title, image, URL, and a fallback image.
 *
 * @property {Function} instagram - A parser for Instagram media grid data. Processes media sections, extracting properties like id, title,
 * description, image, URL, username, full name, profile picture URL, lat, lng, and fallback image.
 */
const PLATFORM_PARSERS = {
	'x-twitter': (data) => {
		const tweetData = Object.entries(data)[0];
		const tweetType = tweetData[0];
		const tweetObjects = tweetData[1];

		const getTweetDetails = (tweetObject) => {
			const { tweet = {} } = tweetObject;
			const { user_details: user, place, extended_entities } = tweet;
			const [lng, lat] = place?.bounding_box?.coordinates?.[0]?.[0] ?? [null, null];

			const mediaDetails = extended_entities?.media?.[0] || {};
			const postType = mediaDetails.type || 'text';
			const media = mediaDetails.media_url_https || null;
			return {
				id: tweetObject.entryId,
				content: tweet.full_text,
				url: tweet.url ?? '#',
				type: postType,
				postMedia: media,
				isUserVerified: user.verified,
				userName: user.name,
				userScreenName: user.screen_name,
				userProfilePhoto: user.profile_image_url_https,
				lat,
				lng,
				tweetType,
				favoriteCount: tweet.favorite_count,
				replyCount: tweet.reply_count,
				retweetCount: tweet.retweet_count,
				postTime: tweet.created_at,
				historical: data?.historical || false
			};
		};

		return { [tweetType]: tweetObjects.tweets.map(getTweetDetails) };
	},

	linkedin: (data) =>
		data.posts.map((post) => ({
			id: post.urn,
			title: post.text,
			description: post.text,
			image: post.post_image || post.author.image_url || LinkedInIconImg,
			lat: null,
			lng: null,
			url: post.url ?? '#'
		})),

	facebook: (data) => {
		const fbData = Object.entries(data)[0];
		const fbType = fbData[0];
		const fbObjects = fbData[1];

		const getFbDetails = (fbObject) => {
			const commonDetails = {
				id: fbObject.id,
				url: fbObject.url ?? '#',
				type: fbType,
				historical: data?.historical || false
			};

			switch (fbType) {
				case 'posts':
					return {
						...commonDetails,
						content: fbObject.message,
						postMedia: fbObject.attachments[0]?.preview_image || FacebookIconImg,
						userName: fbObject.actors[0]?.name,
						userProfilePhoto: fbObject.actors[0]?.profile_picture,
						lat: null,
						lng: null,
						postTime: fbObject.creation_time,
						reaction: fbObject.feedback?.reaction_count,
						comment: fbObject.feedback?.comment_count,
						share: fbObject.feedback?.share_count,
						like: fbObject.feedback?.like_count,
						postType: fbObject.attachments[0]?.attachment_type
					};
				case 'users':
					return {
						...commonDetails,
						name: fbObject.name,
						image: fbObject.photoUrl,
						info: fbObject.info
					};
				case 'pages':
					return {
						...commonDetails,
						name: fbObject.name,
						image: fbObject.photoUrl,
						info: fbObject.info,
						postsFrequency: fbObject.postsFrequency,
						followers: fbObject.followers
					};
				case 'groups':
					return {
						...commonDetails,
						name: fbObject.name,
						image: fbObject.photoUrl,
						info: fbObject.info,
						postsFrequency: fbObject.postsFrequency,
						members: fbObject.members
					};
				case 'events':
					return {
						...commonDetails,
						name: fbObject.name,
						image: fbObject.picture,
						attendings: fbObject.attendings,
						startTimeStamp: fbObject.startTimeStamp,
						startText: fbObject.startText,
						timezone: fbObject.timezone,
						isAllDay: fbObject.isAllDay,
						endTimeStamp: fbObject.endTimeStamp,
						location: fbObject.location,
						pastEvent: fbObject.pastEvent
					};
				default:
					return commonDetails;
			}
		};

		if (fbType === 'videos') return false;
		// const fbDetails = fbType === 'videos' ? fbObjects.data : fbObjects.results;
		const fbDetails = fbObjects.data || fbObjects.results;
		return { [fbType]: fbDetails.map(getFbDetails) };
	},

	'facebook-marketplace': (data) =>
		data.data.marketplace_search.feed_units.edges
			.map((post) => {
				if (post.node?.data?.title) {
					return {
						id: post.node.entity_id,
						title: post.node?.data?.title || '',
						description: post.node?.data?.description || '',
						image: post.node?.photo?.image?.uri || FacebookMarketPlaceIconImg,
						lat: null,
						lng: null,
						url: 'https://www.facebook.com/marketplace/item/' + post.node.entity_id,
						price: (Number(post.node?.data?.price?.amount_with_offset) / 100).toLocaleString(),
						currency: post.node?.data?.price?.currency || null,
						historical: data?.historical || false
					};
				}
			})
			.filter(Boolean),

	streetview: (data) =>
		data.panoids.map((panoid) => ({
			id: panoid.panoid,
			title: `panoid - ${panoid.panoid}`,
			description: `description - ${panoid.panoid}`,
			image: PanoidsIconImg,
			lat: panoid.lat,
			lng: panoid.lon,
			url: `${PANOID_BASE_URL}${panoid.panoid}`
		})),

	'google-news': (data) =>
		data.news.map((article) => ({
			id: article.position,
			title: article.title,
			image: article.imageUrl || GoogleNewsIconImg,
			lat: null,
			lng: null,
			url: article.link,
			fallback_image: GoogleNewsIconImg
		})),

	instagram: (data) =>
		(data.media_grid?.sections || [])
			.map((section) => {
				const item = section?.layout_content?.one_by_two_item?.clips?.items?.[0]?.media;
				if (item) {
					return {
						id: item.pk || null,
						title: item?.caption?.text || '@' + item?.user?.username || 'Unknown',
						description: item?.caption?.text || 'No description available',
						image: item?.image_versions2?.candidates?.[0]?.url || InstagramIconImg,
						url: item?.code ? `https://www.instagram.com/p/${item.code}/` : '#',
						username: item?.user?.username || 'Unknown',
						full_name: item?.user?.full_name || 'Unknown',
						lat: null,
						lng: null,
						profile_pic_url: item?.user?.profile_pic_url || '',
						fallback_image: InstagramIconImg
					};
				}
			})
			.filter(Boolean)
};

/**
 * Parses the social media response data based on the specified platform.
 *
 * @param {Object} data - The raw response data from the social media platform.
 * @param {string} platform - The name of the social media platform to parse the data for.
 * @return {Object} An object containing parsed post data, platform type, icon, and post count.
 */
export function parseSocialMediaResponse(data, platform) {
	const platformDetails = {
		mapFunction: PLATFORM_PARSERS[platform],
		type: platform,
		icon: SOCIAL_MEDIA_PLATFORMS.find((p) => p.slug === platform)?.mapIcon
	};

	if (!platformDetails.mapFunction) {
		return { type: platform, count: 0, icon: null, posts: [] };
	}

	return generatePostData(data, platformDetails);
}

/**
 * Retrieves the social media tabs associated with a specified platform.
 *
 * @param {string} socialMediaPlatformSlug - The slug identifier of the social media platform.
 * @return {Array} An array of tabs for the specified social media platform. Returns an empty array if the platform is not found.
 */
export function getSocialMediaTabs(socialMediaPlatformSlug) {
	const socialMediaPlatform = SOCIAL_MEDIA_PLATFORMS.find(
		(platform) => platform.slug === socialMediaPlatformSlug
	);
	return socialMediaPlatform ? socialMediaPlatform.tabs : [];
}

/**
 * Removes duplicate posts from an array based on their unique `id`.
 *
 * @param {Array<Object>} posts - The array of posts to deduplicate.
 * @return {Array<Object>} The deduplicated array of posts.
 */
function deduplicatePosts(posts) {
	return posts.filter((post, index, self) => self.findIndex((p) => p.id === post.id) === index);
}

/**
 * Processes and groups posts for Twitter by type (top and latest).
 *
 * @param {Object} twitterData - The Twitter data object containing posts.
 * @param {Object} acc - The accumulator object to group data.
 */
function processTwitterPosts(twitterData, acc) {
	const { type, posts } = twitterData;
	acc[type] = acc[type] || { top: [], latest: [] };

	if (posts?.top) {
		acc[type].top.push(...posts.top);
		acc[type].top = deduplicatePosts(acc[type].top);
	}
	if (posts?.latest) {
		acc[type].latest.push(...posts.latest);
		acc[type].latest = deduplicatePosts(acc[type].latest);
	}
}

/**
 * Processes and groups posts for Facebook by type (users, groups, pages, etc..).
 *
 * @param {Object} twitterData - The Facebook data object containing posts.
 * @param {Object} acc - The accumulator object to group data.
 */
function processFacebookPosts(twitterData, acc) {
	const { type, posts } = twitterData;
	acc[type] = acc[type] || { groups: [], pages: [], users: [], events: [], posts: [] };

	if (posts?.groups) {
		acc[type].groups.push(...posts.groups);
		acc[type].groups = deduplicatePosts(acc[type].groups);
	}

	if (posts?.pages) {
		acc[type].pages.push(...posts.pages);
		acc[type].pages = deduplicatePosts(acc[type].pages);
	}

	if (posts?.users) {
		acc[type].users.push(...posts.users);
		acc[type].users = deduplicatePosts(acc[type].users);
	}

	if (posts?.events) {
		acc[type].events.push(...posts.events);
		acc[type].events = deduplicatePosts(acc[type].events);
	}

	if (posts?.posts) {
		acc[type].posts.push(...posts.posts);
		acc[type].posts = deduplicatePosts(acc[type].posts);
	}
}

/**
 * Groups social media data based on their type and organizes posts accordingly.
 *
 * @param {Array<Object>} data - An array of social media data objects, each containing a `type` property
 * and optional `posts` property with `top` and/or `latest` posts.
 * @return {Object} An object where keys represent social media types, and values contain grouped
 * and deduplicated posts for each type. For `x-twitter`, posts are further divided into `top` and `latest` categories.
 */
export function groupSocialMediaData(data) {
	return data.reduce((acc, { type, posts }) => {
		if (type === 'x-twitter') {
			processTwitterPosts({ type, posts }, acc);
		} else if (type === 'facebook') {
			processFacebookPosts({ type, posts }, acc);
		} else {
			acc[type] = acc[type] || [];
			acc[type].push(...(posts || []));
			acc[type] = deduplicatePosts(acc[type]);
		}
		return acc;
	}, {});
}
