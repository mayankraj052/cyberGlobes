<script lang="ts">
	import { onMount } from 'svelte';
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card/index.ts';
	import { page } from '$app/stores';
	import NotFound from '$lib/components/general/NotFound.svelte';
	import { ApiService } from '$lib/services/api-service';
	import GetBack from '$lib/components/general/GetBack.svelte';
	import TableShimmer from '$lib/components/general/shimmer/TableShimmer.svelte';
	import { formatDate } from '$lib/utils/generalUtils';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import FacebookPostCollection from '$lib/components/ui/map/social-cards/facebook/FacebookPostCollection.svelte';
	import CardShimmer from '$lib/components/general/shimmer/CardShimmer.svelte';
	import FacebookIconImg from '$lib/assets/svg/marker/facebook-pin.svg';

	const slug = 'facebook';
	$: id = $page.params.id;
	let loader = true;
	let posts;

	async function fetchFacebook(pageNumber = 1) {
		try {
			let apiService = new ApiService();
			let res = await apiService.makeApiCall(`search-requests/${id}/${slug}`);

			if (!res.success) {
				throw new Error(res.error);
			}

			posts = res.response.reduce((acc, response) => {
				const data = response.response;
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
								postMedia: fbObject.attachments?.[0]?.preview_image || FacebookIconImg,
								userName: fbObject.actors?.[0]?.name,
								userProfilePhoto: fbObject.actors?.[0]?.profile_picture,
								lat: null,
								lng: null,
								postTime: fbObject.creation_time,
								reaction: fbObject.feedback?.reaction_count,
								comment: fbObject.feedback?.comment_count,
								share: fbObject.feedback?.share_count,
								like: fbObject.feedback?.like_count,
								postType: fbObject.attachments?.[0]?.attachment_type
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

				if (fbType === 'videos') return acc;

				const fbDetails = fbObjects.data || fbObjects.results;

				if (!acc[fbType]) {
					acc[fbType] = [];
				}

				acc[fbType].push(...fbDetails.map(getFbDetails));

				return acc;
			}, {});
		} catch (err) {
			console.error('Pagination Error:', err);
		} finally {
			loader = false;
		}
	}

	onMount(async () => {
		await fetchFacebook();
	});
</script>

<div class="container max-w-100">
	<div class="flex-1 space-y-4">
		<h2 class="text-3xl font-bold tracking-tight text-dark dark:text-white">Facebook</h2>
		<GetBack url={`/my-requests/${id}`} />
		<Card.Root class="col-span-4">
			<Card.Content>
				{#if !loader}
					{#if posts.length === 0}
						<NotFound message={'No data found!!'} />
					{:else}
						<div class="columns-2 gap-4 p-4 space-y-4">
							{#each Object.keys(posts) as key}
								{#if posts[key].length > 0}
									{#each posts[key] as post}
										<div class="break-inside-avoid bg-white shadow-lg rounded-2xl p-4">
											<FacebookPostCollection {post} />
										</div>
									{/each}
								{/if}
							{/each}
						</div>
					{/if}
				{:else}
					<div class="w-full grid grid-cols-2 gap-4 p-4">
						<CardShimmer rows={16} />
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
</div>
