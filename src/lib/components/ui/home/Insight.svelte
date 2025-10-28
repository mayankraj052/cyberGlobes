<script>
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import feeds from '$lib/assets/insights/feeds.svg';
	import api from '$lib/assets/insights/api.svg';
	import platform from '$lib/assets/insights/platform.svg';
	import dataStack from '$lib/assets/insights/data-stack-base.svg';
	import categorization from '$lib/assets/insights/categorization.svg';
	import target from '$lib/assets/insights/target.svg';
	import panel from '$lib/assets/insights/panel.svg';
	import polygon from '$lib/assets/insights/polygon.svg';
	import diagramLine from '$lib/assets/insights/diagram-line.svg';
	import dottedLine from '$lib/assets/insights/dotted-line.svg';
	import line from '$lib/assets/insights/line.svg';
	import diagramLine2 from '$lib/assets/insights/diagram-line2.svg';

	let animate = false;
	let lastScrollY = 0;
	let sectionInView = false;

	function handleScroll() {
		if (typeof window === 'undefined') return;

		const currentScrollY = window.scrollY;
		const isScrollingDown = currentScrollY > lastScrollY;

		if (sectionInView) {
			animate = isScrollingDown; // Only animate if section is visible
		}

		lastScrollY = currentScrollY;
	}

	function observeSection() {
		const section = document.querySelector('.data-wrapper');
		if (!section) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					sectionInView = entry.isIntersecting; // Update visibility
					if (entry.isIntersecting) {
						animate = true; // Start animation only when it enters viewport
					}
				});
			},
			{ threshold: 0.4 } // Trigger when 50% of the section is visible
		);

		observer.observe(section);
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			lastScrollY = window.scrollY;
			window.addEventListener('scroll', handleScroll);
			observeSection();
		}
	});
</script>

<div class="section bg-white">
	<div class="md:container">
		<h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight text-center">
			Powerful Insights<br />Built on Reliable Data
		</h2>
		<div
			class="font-size-1-875rem text-center margin-bottom-2-5rem margin-top-8-125rem mobile data-heading"
		>
			Data You Can Trust
		</div>
		<div class="data-step-1">
			<div class="flex-h-center-start position-relative mobile-margin">
				<img
					src={polygon}
					loading="lazy"
					alt="Property polygon image"
					class="margin-right-1rem mobile-width"
				/>
				<div class="data-floating-text">Street panoramas <br />live social media data</div>
			</div>
			<div class="flex-h-center-start position-relative">
				<img
					src={panel}
					loading="lazy"
					alt="accurate data image"
					class="margin-right-1rem mobile-width"
				/>
				<div class="data-floating-text _2">
					property data, <br />foot traffic data, news and more
				</div>
			</div>
		</div>
		<div class="diagram-lines margin-bottom">
			<img src={diagramLine} loading="lazy" alt="" />
		</div>
		<div class="font-size-1-875rem text-center margin-bottom-2-5rem margin-top-8-125rem mobile">
			Best-in-class Data Science
		</div>
		<div class="position-relative margin-bottom-4rem">
			<div data-w-id="072d35c5-5bc4-c307-bd3d-7ac074df790e" class="data-step-2">
				<div
					id="w-node-d6e1df3a-be79-c819-653c-96ff99579666-faea5da4"
					class="flex-v-start-center mobile-last"
				>
					<div class="data-dashed-wrapper">
						<div class="flex-h-center-space">
							<img src={target} loading="lazy" alt="target icon" class="margin-right-1rem" />
							<div class="ml-3">+92% accuracy</div>
						</div>
						<div class="flex-h-center-space">
							<img
								src={categorization}
								loading="lazy"
								alt="categorization icon"
								class="margin-right-1rem"
							/>
							<div class="ml-3">High cardinality<br />categorization</div>
						</div>
					</div>
				</div>
				<div
					id="w-node-_0d102a65-4d78-f821-cf53-b2b038e0d6e4-faea5da4"
					class="position-relative width-100 flex-v-center-start mobile-margin"
				>
					<div id="w-node-f1939910-3def-9d16-65de-1fe91c57c67f-faea5da4" class="data-wrapper">
						<img src={dataStack} loading="lazy" alt="data stack image" />
						<div
							class="floating-data _1"
							style={animate
								? 'transform: translate3d(0px, 0%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);'
								: ''}
						></div>
						<div
							class="floating-data _2"
							style={animate
								? 'transform: translate3d(0px, 0%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);'
								: ''}
						></div>
						<div
							class="floating-data _3"
							style={animate
								? 'transform: translate3d(0px, 0%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);'
								: ''}
						></div>
					</div>
					<img src={dottedLine} loading="lazy" alt="" class="dotted-data-line" />
				</div>
				<div id="w-node-_2638b400-68f4-92e1-d069-1d8f9c35c04a-faea5da4" class="flex-v-start-center">
					<div class="font-size-1-5rem text-bold text-line-height-1-5 mobile-line-height">
						Powerful insights into places, markets, and consumer trends<br /><span
							class="data-subtext"
							>Sales Estimation, Demographics, Business counts, Planned Development, Crime,
							Psychographics, Social Media / &nbsp;online, Consumer Expenditures, Climate</span
						>
					</div>
					<a
						href="/"
						class="flex items-center text-blue-600 font-semibold group transition-all duration-300"
					>
						<span class="mr-2">Learn more</span>
						<Icon
							icon="mdi:arrow-right"
							class="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-800"
						/>
					</a>
				</div>
			</div>
			<div class="diagram-lines absolute">
				<img src={line} loading="lazy" alt="line" />
			</div>
		</div>
		<div
			class="font-size-1-875rem text-center margin-bottom-2-5rem margin-top-8-125rem mobile seamless"
		>
			Seamless Business Integration
		</div>
		<div class="diagram-lines last">
			<img src={diagramLine2} loading="lazy" alt="diagram" class="width-55" />
		</div>
		<div class="data-step-3">
			<div class="width-50 flex-h-center-start padding-right mobile">
				<img
					src={platform}
					loading="lazy"
					alt="platform icon"
					class="height-30vh margin-bottom-1rem margin-right-2-5rem"
				/>
				<div>
					<div class="font-size-1-5rem text-bold text-line-height-1-5 mobile-line-height">
						Platform<br /><span class="data-subtext"
							>Explore property, chain and industry level reports and create custom reports directly
							on our UI Platform</span
						>
					</div>
					<a
						href="/"
						class="flex items-center text-blue-600 font-semibold group transition-all duration-300"
					>
						<span class="mr-2">Learn more</span>
						<Icon
							icon="mdi:arrow-right"
							class="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-800"
						/>
					</a>
				</div>
			</div>
			<div class="width-50 mobile">
				<div class="flex-h-center-start margin-bottom-1-5rem">
					<img
						src={api}
						loading="lazy"
						alt="API icon"
						class="height-25vh margin-right-2-5rem mobile"
					/>
					<div>
						<div class="font-size-1-5rem text-bold text-line-height-1-5 mobile-line-height">
							API<br /><span class="data-subtext"
								>Query PAPI, CyberGlobes's robust API to programmatically ingest our data into your
								own tech stack</span
							>
						</div>
						<a
							href="/"
							class="flex items-center text-blue-600 font-semibold group transition-all duration-300"
						>
							<span class="mr-2">Learn more</span>
							<Icon
								icon="mdi:arrow-right"
								class="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-800"
							/>
						</a>
					</div>
				</div>
				<div class="flex-h-center-start">
					<img
						src={feeds}
						loading="lazy"
						alt="Feeds icon"
						class="height-25vh margin-right-2-5rem mobile"
					/>
					<div>
						<div class="font-size-1-5rem text-bold text-line-height-1-5 mobile-line-height">
							Feeds<br /><span class="data-subtext"
								>Export CyberGlobes.ai proprietary data automatically</span
							>
						</div>
						<a
							href="/"
							class="flex items-center text-blue-600 font-semibold group transition-all duration-300"
						>
							<span class="mr-2">Learn more</span>
							<Icon
								icon="mdi:arrow-right"
								class="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-800"
							/>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- <div class="data-section-bg"></div> -->
</div>

<style>
	.w-container:before,
	.w-container:after {
		content: ' ';
		grid-area: 1/1/2/2;
		display: table;
	}

	.w-container:after {
		clear: both;
	}

	.w-container .w-row {
		margin-left: -10px;
		margin-right: -10px;
	}

	.w-row:before,
	.w-row:after {
		content: ' ';
		grid-area: 1/1/2/2;
		display: table;
	}

	.w-row:after {
		clear: both;
	}

	.w-row .w-row {
		margin-left: 0;
		margin-right: 0;
	}

	.w-col {
		float: left;
		width: 100%;
		min-height: 1px;
		padding-left: 10px;
		padding-right: 10px;
		position: relative;
	}

	.w-col .w-col {
		padding-left: 0;
		padding-right: 0;
	}

	.w-col-1 {
		width: 8.33333%;
	}

	.w-col-2 {
		width: 16.6667%;
	}

	.w-col-3 {
		width: 25%;
	}

	.w-col-4 {
		width: 33.3333%;
	}

	.w-col-5 {
		width: 41.6667%;
	}

	.w-col-6 {
		width: 50%;
	}

	.w-col-7 {
		width: 58.3333%;
	}

	.w-col-8 {
		width: 66.6667%;
	}

	.w-col-9 {
		width: 75%;
	}

	.w-col-10 {
		width: 83.3333%;
	}

	.w-col-11 {
		width: 91.6667%;
	}

	.w-col-12 {
		width: 100%;
	}

	.w-hidden-main {
		display: none !important;
	}

	.w-widget {
		position: relative;
	}

	.w-widget-map {
		width: 100%;
		height: 400px;
	}

	.w-widget-map label {
		width: auto;
		display: inline;
	}

	.w-widget-map img {
		max-width: inherit;
	}

	.w-widget-map .gm-style-iw {
		text-align: center;
	}

	.w-widget-twitter {
		overflow: hidden;
	}

	.w-widget-twitter-count-shim {
		vertical-align: top;
		text-align: center;
		background: #fff;
		border: 1px solid #758696;
		border-radius: 3px;
		width: 28px;
		height: 20px;
		display: inline-block;
		position: relative;
	}

	.w-widget-twitter-count-shim * {
		pointer-events: none;
		-webkit-user-select: none;
		user-select: none;
	}

	.w-widget-twitter-count-shim .w-widget-twitter-count-inner {
		text-align: center;
		color: #999;
		font-family: serif;
		font-size: 15px;
		line-height: 12px;
		position: relative;
	}

	.w-widget-twitter-count-shim .w-widget-twitter-count-clear {
		display: block;
		position: relative;
	}

	.w-widget-twitter-count-shim.w--large {
		width: 36px;
		height: 28px;
	}

	.w-widget-twitter-count-shim.w--large .w-widget-twitter-count-inner {
		font-size: 18px;
		line-height: 18px;
	}

	.w-widget-twitter-count-shim:not(.w--vertical) {
		margin-left: 5px;
		margin-right: 8px;
	}

	.w-widget-twitter-count-shim:not(.w--vertical).w--large {
		margin-left: 6px;
	}

	.w-widget-twitter-count-shim:not(.w--vertical):before,
	.w-widget-twitter-count-shim:not(.w--vertical):after {
		content: ' ';
		pointer-events: none;
		border: solid #0000;
		width: 0;
		height: 0;
		position: absolute;
		top: 50%;
		left: 0;
	}

	.w-widget-twitter-count-shim:not(.w--vertical):before {
		border-width: 4px;
		border-color: #75869600 #5d6c7b #75869600 #75869600;
		margin-top: -4px;
		margin-left: -9px;
	}

	.w-widget-twitter-count-shim:not(.w--vertical).w--large:before {
		border-width: 5px;
		margin-top: -5px;
		margin-left: -10px;
	}

	.w-widget-twitter-count-shim:not(.w--vertical):after {
		border-width: 4px;
		border-color: #fff0 #fff #fff0 #fff0;
		margin-top: -4px;
		margin-left: -8px;
	}

	.w-widget-twitter-count-shim:not(.w--vertical).w--large:after {
		border-width: 5px;
		margin-top: -5px;
		margin-left: -9px;
	}

	.w-widget-twitter-count-shim.w--vertical {
		width: 61px;
		height: 33px;
		margin-bottom: 8px;
	}

	.w-widget-twitter-count-shim.w--vertical:before,
	.w-widget-twitter-count-shim.w--vertical:after {
		content: ' ';
		pointer-events: none;
		border: solid #0000;
		width: 0;
		height: 0;
		position: absolute;
		top: 100%;
		left: 50%;
	}

	.w-widget-twitter-count-shim.w--vertical:before {
		border-width: 5px;
		border-color: #5d6c7b #75869600 #75869600;
		margin-left: -5px;
	}

	.w-widget-twitter-count-shim.w--vertical:after {
		border-width: 4px;
		border-color: #fff #fff0 #fff0;
		margin-left: -4px;
	}

	.w-widget-twitter-count-shim.w--vertical .w-widget-twitter-count-inner {
		font-size: 18px;
		line-height: 22px;
	}

	.w-widget-twitter-count-shim.w--vertical.w--large {
		width: 76px;
	}

	.w-background-video {
		color: #fff;
		height: 500px;
		position: relative;
		overflow: hidden;
	}

	.w-background-video > video {
		object-fit: cover;
		z-index: -100;
		background-position: 50%;
		background-size: cover;
		width: 100%;
		height: 100%;
		margin: auto;
		position: absolute;
		inset: -100%;
	}

	.w-background-video--control {
		background-color: #0000;
		padding: 0;
		position: absolute;
		bottom: 1em;
		right: 1em;
	}

	.w-background-video--control > [hidden] {
		display: none !important;
	}

	@media (min-width: 768px) {
		.w-lightbox-content {
			height: 96vh;
			margin-top: 2vh;
		}

		.w-lightbox-view,
		.w-lightbox-view:before {
			height: 96vh;
		}

		.w-lightbox-group,
		.w-lightbox-group .w-lightbox-view,
		.w-lightbox-group .w-lightbox-view:before {
			height: 84vh;
		}

		.w-lightbox-image {
			max-width: 96vw;
			max-height: 96vh;
		}

		.w-lightbox-group .w-lightbox-image {
			max-width: 82.3vw;
			max-height: 84vh;
		}

		.w-lightbox-left,
		.w-lightbox-right {
			opacity: 0.5;
			display: block;
		}

		.w-lightbox-close {
			opacity: 0.8;
		}

		.w-lightbox-control:hover {
			opacity: 1;
		}
	}

	.w-lightbox-inactive,
	.w-lightbox-inactive:hover {
		opacity: 0;
	}

	.w-richtext:before,
	.w-richtext:after {
		content: ' ';
		grid-area: 1/1/2/2;
		display: table;
	}

	.w-richtext:after {
		clear: both;
	}

	.w-richtext ol,
	.w-richtext ul {
		overflow: hidden;
	}

	.w-richtext .w-richtext-figure-selected.w-richtext-figure-type-video div:after,
	.w-richtext .w-richtext-figure-selected[data-rt-type='video'] div:after,
	.w-richtext .w-richtext-figure-selected.w-richtext-figure-type-image div,
	.w-richtext .w-richtext-figure-selected[data-rt-type='image'] div {
		outline: 2px solid #2895f7;
	}

	.w-richtext figure.w-richtext-figure-type-video > div:after,
	.w-richtext figure[data-rt-type='video'] > div:after {
		content: '';
		display: none;
		position: absolute;
		inset: 0;
	}

	.w-richtext figure {
		max-width: 60%;
		position: relative;
	}

	.w-richtext figure > div:before {
		cursor: default !important;
	}

	.w-richtext figure img {
		width: 100%;
	}

	.w-richtext figure figcaption.w-richtext-figcaption-placeholder {
		opacity: 0.6;
	}

	.w-richtext figure div {
		color: #0000;
		font-size: 0;
	}

	.w-richtext figure.w-richtext-figure-type-image,
	.w-richtext figure[data-rt-type='image'] {
		display: table;
	}

	.w-richtext figure.w-richtext-figure-type-image > div,
	.w-richtext figure[data-rt-type='image'] > div {
		display: inline-block;
	}

	.w-richtext figure.w-richtext-figure-type-image > figcaption,
	.w-richtext figure[data-rt-type='image'] > figcaption {
		caption-side: bottom;
		display: table-caption;
	}

	.w-richtext figure.w-richtext-figure-type-video,
	.w-richtext figure[data-rt-type='video'] {
		width: 60%;
		height: 0;
	}

	.w-richtext figure.w-richtext-figure-type-video iframe,
	.w-richtext figure[data-rt-type='video'] iframe {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.w-richtext figure.w-richtext-figure-type-video > div,
	.w-richtext figure[data-rt-type='video'] > div {
		width: 100%;
	}

	.w-richtext figure.w-richtext-align-center {
		clear: both;
		margin-left: auto;
		margin-right: auto;
	}

	.w-richtext figure.w-richtext-align-center.w-richtext-figure-type-image > div,
	.w-richtext figure.w-richtext-align-center[data-rt-type='image'] > div {
		max-width: 100%;
	}

	.w-richtext figure.w-richtext-align-normal {
		clear: both;
	}

	.w-richtext figure.w-richtext-align-fullwidth {
		text-align: center;
		clear: both;
		width: 100%;
		max-width: 100%;
		margin-left: auto;
		margin-right: auto;
		display: block;
	}

	.w-richtext figure.w-richtext-align-fullwidth > div {
		padding-bottom: inherit;
		display: inline-block;
	}

	.w-richtext figure.w-richtext-align-fullwidth > figcaption {
		display: block;
	}

	.container._2-col-3-row-grid.xtra {
		grid-column-gap: 36px;
		grid-row-gap: 16px;
		grid-template-rows: auto auto auto;
	}

	.container._2-col-3-row-grid.solutions {
		grid-column-gap: 32px;
		grid-template-columns: 1fr 1fr;
	}

	.container.right-gradient {
		background-image: linear-gradient(270deg, #ffffff17, var(--ghost-white));
		border-radius: 20px;
		width: auto;
		margin-left: auto;
		margin-right: auto;
		padding: 6.25rem 6.25rem 6.25rem 7rem;
	}

	.container._2-col-2-row-grid {
		grid-column-gap: 135px;
		grid-row-gap: 36px;
		grid-template-rows: auto auto;
		grid-template-columns: 0.8fr 1.2fr;
		grid-auto-columns: 1fr;
		align-content: start;
		align-items: start;
		display: grid;
	}

	.container._2-col-2-row-grid.bottom-margin-8rem {
		margin-bottom: 8rem;
	}

	.container.overflow-hidden {
		overflow: hidden;
	}

	.container._2-col-2-row-grid-analytics.margin-bottom-8rem {
		margin-bottom: 8rem;
	}

	.container._2-col-2-row-grid-analytics {
		grid-column-gap: 32px;
		grid-row-gap: 36px;
		grid-template-rows: auto auto;
		grid-template-columns: 1fr 1fr;
		grid-auto-columns: 1fr;
		align-content: start;
		align-items: start;
		display: grid;
	}

	.container._2-col-2-row-grid-analytics.bottom-margin-8rem {
		margin-bottom: 8rem;
	}

	.container._2-col-2-row-equal-grid {
		grid-column-gap: 135px;
		grid-row-gap: 36px;
		grid-template-rows: auto auto;
		grid-template-columns: 1fr 1fr;
		grid-auto-columns: 1fr;
		align-content: start;
		align-items: start;
		display: grid;
	}

	.container._2-col-2-row-equal-grid.gap-col-80-row-16 {
		grid-column-gap: 80px;
		grid-row-gap: 16px;
	}

	.container._2-col-2-row-equal-grid.gap-col-80-row-16.margin-bottom-8rem {
		margin-bottom: 8rem;
	}

	.container.flex-v-st-st {
		flex-direction: column;
		align-items: flex-start;
		display: flex;
	}

	.container.flex-v-st-e {
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;
		display: flex;
	}

	.container.height-80 {
		height: 80%;
	}

	.container.height-70px {
		min-height: 70px;
	}

	.container.height-70px.flex-h-center-start {
		justify-content: flex-start;
	}

	.container.height-70px.flex-h-center-start.mobile-padding-right-left-1-5rem.mobile-flex-v-start-start.padding-top-0-7rem {
		padding-top: 0.7rem;
	}

	.container.height-70px.flex-h-center-start.mobile-padding-right-left-1-5rem.mobile-flex-v-start-start.mobile-height-auto.mobile-tabs-menu {
		display: none;
	}

	.container.flex-v-center-center.gap-1-5rem {
		grid-column-gap: 1.5rem;
		grid-row-gap: 1.5rem;
	}

	.container.margin-top-1-5rem.z-index-1.min-height-490px {
		min-height: 490px;
	}

	.container._2-col-2-row-16-gap-grid {
		grid-column-gap: 16px;
		grid-row-gap: 16px;
		grid-template-rows: auto auto;
		grid-template-columns: 1fr 1fr;
		grid-auto-columns: 1fr;
		align-content: start;
		align-items: start;
		display: grid;
	}

	.container.wp {
		max-width: none;
	}

	.container.wp.wide {
		max-width: 1360px;
	}

	.flex-h-stretch-space {
		justify-content: space-between;
		align-items: stretch;
		width: 100%;
		display: flex;
		position: relative;
	}

	.flex-h-stretch-space.gap-40 {
		grid-column-gap: 40px;
		grid-row-gap: 40px;
	}

	.flex-h-stretch-space.gap-40.t-vert-center-reversed.margin-bottom-25rem {
		margin-bottom: 2.5rem;
	}

	.full-underline {
		width: 100%;
		height: 1px;
	}

	.full-underline.div-black {
		background-color: var(--primary);
	}

	.full-underline.div-black.margin-bottom-2-5rem {
		margin-top: 1rem;
		margin-bottom: 2.5rem;
	}

	.section {
		flex-direction: column;
		align-items: center;
		padding: 7rem 2.5rem 6.5rem;
		display: flex;
		position: relative;
	}

	.section:where(.w-variant-fade15fd-e941-875f-f2c7-76e0d6fcea94) {
		padding-top: 1.25rem;
		padding-bottom: 1.25rem;
	}

	.section.div-gray-gradient {
		background-image: linear-gradient(#ffffff17, #f1f3fb);
	}

	.section.padding-top-bottom-3rem {
		padding-top: 3rem;
		padding-bottom: 3rem;
	}

	.section.no-top-bottom-padding {
		padding-top: 0;
		padding-bottom: 0;
	}

	.section.no-bottom-padding {
		padding-bottom: 0;
	}

	.section.padding-bottom-2rem {
		padding-bottom: 2rem;
	}

	.section.div-white-smoke.top-bottom-padding-4rem {
		padding-top: 4rem;
		padding-bottom: 4rem;
	}

	.section.padding-bottom-5rem {
		padding-bottom: 5rem;
	}

	.section.padding-bottom-5rem.padding-top-10rem {
		padding-top: 10rem;
	}

	.section.padding-top-3-5rem {
		padding-top: 3.5rem;
	}

	.section.padding-top-2-5rem {
		color: #111;
		padding-top: 2.5rem;
	}

	.section.padding-top-2-5rem.padding-bottom-5rem {
		border-bottom: 0 #d0d0d0;
		padding-left: 1rem;
	}

	.section.padding-top-2-5rem.padding-bottom-5rem.placer-100 {
		padding-bottom: 2.5rem;
		padding-right: 1rem;
	}

	.section.padding-top-2-5rem.padding-top-bottom-0-5rem.placer-100 {
		padding-left: 1rem;
		padding-right: 1rem;
	}

	.section.padding-top-2-5rem.discover-tos {
		padding-top: 3.5rem;
	}

	.section.mobile-no-right-left-padding.padding-top-bottom-4rem {
		padding-top: 4rem;
	}

	.section.padding-top-bottom-4rem {
		padding-top: 4rem;
		padding-bottom: 4rem;
	}

	.section.padding-bottom-4rem {
		padding-bottom: 2.4rem;
	}

	.section.flex-h-st-sp {
		flex-direction: row;
		align-items: stretch;
	}

	.section.flex-h-st-sp.no-padding {
		padding: 0;
	}

	.section.padding-top-9rem {
		padding-top: 9rem;
	}

	.section.padding-top-3-75rem {
		padding-top: 3.75rem;
	}

	.section.no-top-padding {
		padding-top: 0;
	}

	.section.no-top-padding.no-right-left-padding {
		padding-left: 0;
		padding-right: 0;
	}

	.section.no-padding.padding-top-6rem {
		padding-top: 6rem;
	}

	.section.padding-top-bottom-6rem {
		padding-top: 6rem;
		padding-bottom: 3rem;
	}

	.section.less-padding {
		padding-top: 3rem;
		padding-bottom: 2.5rem;
	}

	.section.wp-section {
		border-top: 1px solid #e5e5e5;
	}

	.section.display-block {
		display: block;
	}

	.section.display-block:where(.w-variant-fade15fd-e941-875f-f2c7-76e0d6fcea94) {
		padding-top: 1.25rem;
		padding-bottom: 1.25rem;
	}

	.section.no-padding-top {
		padding-top: 0;
	}

	.section.padding-top-4-5rem {
		padding-top: 4.5rem;
	}

	.section.padding-top-4-5rem.padding-bottom-7-5rem {
		padding-bottom: 7.5rem;
	}

	.section.onboarding {
		height: 100vh;
		padding: 3rem 0;
	}

	.section.padding-top-5rem {
		padding-top: 5rem;
	}

	.section.padding-top-5rem.padding-bottom-2-5rem.bg-placer-blue {
		background-image: linear-gradient(#5e63e5 3.72%, #3136bf 85.85%);
	}

	.section.discover-tos {
		padding-top: 2.5rem;
		padding-bottom: 2.5rem;
	}

	.section.discover-faq {
		padding-top: 2.5rem;
	}

	.section.padding-top-bottom-1-5rem {
		padding-top: 1.5rem;
		padding-bottom: 1.5rem;
	}

	.style-guide-logo-grid {
		grid-row-gap: 4px;
		width: 100%;
	}

	.style-guide-typography-grid {
		grid-row-gap: 16px;
		grid-template-columns: 1fr;
		width: 100%;
	}

	.style-guide-colors-grid {
		grid-row-gap: 16px;
		grid-template-rows: 70px 70px;
		grid-template-columns: 70px 70px 70px 70px 70px 70px 70px 70px 70px;
		width: 100%;
	}

	.div-purple {
		background-color: var(--brand);
	}

	.div-dark-purple {
		background-color: var(--dark-slate-blue);
	}

	.div-white {
		background-color: var(--white);
	}

	.div-white.border-black {
		border: 1px solid var(--primary);
	}

	.div-light-gray {
		background-color: var(--white-smoke);
	}

	.div-medium-gray {
		background-color: var(--dark-grey-2);
	}

	._2fix-anchor {
		height: 0;
		position: relative;
		top: -100px;
	}

	.style-guide-icons-grid {
		grid-row-gap: 16px;
		grid-template-rows: 24px auto;
		grid-template-columns: 24px 29px 29px 24px;
		width: 100%;
	}

	.wrapper {
		scroll-behavior: smooth;
		overflow: hidden;
	}

	.wrapper.bg-gradiant-white-to-f1f3fb {
		background-image: radial-gradient(circle at 50% 100%, #f1f3fb, #fff);
	}

	.wrapper.discover-tos {
		background-image: linear-gradient(165deg, #fff 2%, #ccc2ff 94%);
	}

	.wrapper.discover {
		margin-top: 6.3rem;
		position: relative;
	}

	.wrapper.free-tools-page {
		background-color: #f0f3f7;
		overflow: visible;
	}

	.desktop-width-limit-44ch {
		max-width: 44ch;
	}

	.text-dark-gray {
		color: var(--gray);
	}

	.text-dark-gray.text-center.bottom-margin-2-5rem {
		margin-bottom: 2.5rem;
	}

	.text-dark-gray.text-normal.text-small {
		font-size: 1.25vw;
	}

	.text-dark-gray.text-1rem {
		line-height: 1.6;
	}

	.text-dark-gray.text-14px {
		letter-spacing: normal;
		font-size: 0.875rem;
	}

	.text-dark-gray.border-b-1 {
		letter-spacing: normal;
		border-bottom: 1px solid #e5e5e5;
		width: 100%;
		padding-bottom: 8px;
		font-size: 0.875rem;
	}

	.text-center {
		text-align: center;
	}

	.text-center.margin-bottom-1rem {
		margin-bottom: 1rem;
	}

	.text-center.margin-bottom-1rem.height-4rem {
		height: 4rem;
	}

	.text-center.bottom-margin-1-5rem {
		margin-bottom: 1.5rem;
	}

	.text-center.bottom-margin-0-5rem {
		margin-bottom: 0.5rem;
	}

	.text-center.margin-bottom-5rem {
		margin-bottom: 5rem;
	}

	.text-center.margin-bottom-1-5rem.desktop-width-limit-31ch {
		max-width: 31ch;
	}

	.text-center.margin-bottom-1-25rem.width-limit-16ch {
		max-width: 16ch;
	}

	.text-center.margin-top-4rem {
		margin-top: 4rem;
	}

	.text-center.text-color-white.padding-top-bottom-1rem {
		text-align: center;
		align-self: center;
		max-width: 900px;
		font-size: 1rem;
		line-height: 1.5;
	}

	.text-center.max-width-670 {
		max-width: 670px;
	}

	.text-center.max-width-670.padding-top-1-rem {
		padding-top: 1rem;
	}

	.customer-logo {
		flex-direction: column;
		flex: 0 0 16%;
		justify-content: center;
		align-items: center;
		height: 62px;
		display: flex;
	}

	.customer-logo.customers-page {
		height: 120px;
	}

	.customer-logo.homepage {
		justify-content: center;
		align-items: stretch;
		height: auto;
	}

	.customer-logo.homepage.width-130px {
		width: 130px;
	}

	.customer-logo.homepage.new-logo {
		max-width: 160px;
	}

	.customer-logo.homepage.national-vision {
		max-height: 80%;
	}

	.customer-logo.is--entertainments {
		flex: 0 auto;
		width: auto;
		height: auto;
		max-height: 63px;
	}

	.customers-logos-grid {
		grid-column-gap: 48px;
		grid-row-gap: 16px;
		flex-wrap: wrap;
		grid-template-rows: auto;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
		grid-auto-columns: 1fr;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		display: grid;
		position: relative;
	}

	.customers-logos-grid.customers-page {
		grid-column-gap: 32px;
		grid-row-gap: 16px;
		grid-template-rows: auto auto;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
	}

	.customers-logos-grid.homepage {
		grid-column-gap: 35px;
		grid-row-gap: 0px;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
		margin-top: 2%;
	}

	.customers-logos-grid.restaurant {
		grid-column-gap: 35px;
		grid-row-gap: 0px;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
		justify-content: space-between;
		margin-top: 2%;
	}

	.customers-logos-grid.is--entertainments {
		grid-column-gap: 30px;
		grid-row-gap: 30px;
		grid-template-rows: auto;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
		grid-auto-columns: 1fr;
		place-items: center;
		margin-top: 2%;
		display: grid;
	}

	.customers-logos-grid.is--advertising {
		grid-column-gap: 35px;
		grid-row-gap: 0px;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
		margin-top: 2%;
	}

	.cards-grid {
		grid-column-gap: 20px;
		grid-row-gap: 20px;
		flex: none;
		grid-template-rows: auto auto;
		grid-template-columns: 1fr 1fr 1fr;
		grid-auto-columns: 1fr;
		width: 100%;
		display: grid;
	}

	.cards-grid.press {
		grid-column-gap: 20px;
		grid-row-gap: 20px;
		grid-template-rows: auto auto;
		grid-template-columns: 1fr 1fr 1fr;
		grid-auto-columns: 1fr;
		display: grid;
	}

	.cards-grid.free-tools,
	.cards-grid.homepage {
		grid-template-rows: auto;
	}

	.cards-grid.homepage._2 {
		grid-template-columns: 1fr;
	}

	.card {
		background-color: var(--white);
		border-radius: 12px;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		min-height: 496px;
		padding: 2.25rem 2.5rem 2.5rem;
		display: flex;
		box-shadow: 0 4px 30px #0000001a;
	}

	.card:last-child {
		box-shadow: none;
		color: var(--dark-grey);
		border-radius: 0;
		justify-content: center;
		font-weight: 300;
	}

	.card.press {
		background-color: #0000;
		align-items: stretch;
		min-height: 350px;
		padding: 0 0 1rem;
		position: relative;
	}

	.card.press:last-child {
		color: var(--primary);
		border-radius: 12px;
		justify-content: space-between;
		box-shadow: 0 4px 30px #0000001a;
	}

	.card.library {
		align-items: stretch;
		min-height: 400px;
		padding: 0 0 1rem;
		position: relative;
		box-shadow: 0 4px 15px #00000026;
	}

	.card.library:last-child {
		color: var(--primary);
		border-radius: 12px;
		justify-content: space-between;
		box-shadow: 0 4px 30px #0000001a;
	}

	.card.library.no-bottom-padding {
		padding-bottom: 0;
	}

	.card.testimonials {
		border-radius: 12px;
		justify-content: flex-start;
		min-height: 420px;
		padding: 3.75rem;
		box-shadow: 0 -5px 25px #0000000d;
	}

	.card.testimonials.request-demo-page {
		min-height: 0;
		margin-bottom: 0.5rem;
		margin-left: 1.5rem;
		margin-right: 1.5rem;
		padding: 1.5rem;
		box-shadow: 0 1px 4px #00000026;
	}

	.card.homepage {
		border-radius: 12px;
		align-items: stretch;
		min-height: 400px;
		padding: 0 0 1rem;
		position: relative;
		box-shadow: 0 4px 15px #00000026;
	}

	.card.with-border {
		border: 1px solid var(--gainsboro);
		box-shadow: none;
		border-radius: 8px;
		min-height: 518px;
		padding: 0;
	}

	.card.with-border.width-px-resp {
		width: 304px;
	}

	.card.with-border.small {
		min-height: 370px;
	}

	.flex-v-center-center {
		flex-direction: column;
		flex: none;
		justify-content: center;
		align-items: center;
		display: flex;
	}

	.flex-v-center-center.div-white.top-bottom-padding-2-5rem {
		padding-top: 2.5rem;
		padding-bottom: 2.5rem;
	}

	.card-icon {
		height: 89px;
		margin-bottom: 2.25rem;
	}

	.cards-list-wrapper {
		width: 100%;
		margin-top: 7rem;
	}

	.cards-list-wrapper.margin-top-2-5rem {
		margin-top: 2.5rem;
	}

	.width-limit-21ch {
		max-width: 21ch;
	}

	.icon-box-grid {
		grid-column-gap: 50px;
		grid-row-gap: 90px;
		grid-template-rows: auto auto;
		grid-template-columns: 1fr 1fr;
		grid-auto-columns: 1fr;
		width: 100%;
		display: grid;
	}

	.icon-box-list-wrapper {
		width: 100%;
		margin-top: 7rem;
	}

	.icon-box {
		flex-direction: column;
		align-items: flex-start;
		display: flex;
	}

	.box-icon {
		height: 87px;
		margin-bottom: 2rem;
	}

	.margin-bottom-1-5rem {
		margin-bottom: 1.5rem;
	}

	.margin-bottom-1-5rem.height-limit-12ch {
		height: 12ch;
		overflow: hidden;
	}

	.faq-list-wrapper {
		width: 100%;
		margin-top: 7rem;
	}

	.faq-list-wrapper.discover-faq {
		margin-top: 1.5rem;
	}

	.faq-box {
		cursor: pointer;
	}

	.faq-question {
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		font-size: 1.56rem;
		font-weight: 600;
		line-height: 1.36;
		display: flex;
	}

	.faq-seperator {
		background-color: var(--gainsboro);
		width: 100%;
		height: 1px;
		margin-top: 1rem;
		margin-bottom: 4rem;
	}

	.faq-seperator.margin-top-4rem {
		margin-top: 4rem;
	}

	.faq-seperator.margin-top-bottom-2rem {
		margin-top: 2rem;
		margin-bottom: 2rem;
	}

	.faq-seperator.discover-faq {
		background-color: #111;
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.faq-answer {
		opacity: 0;
		max-width: 70ch;
		display: none;
	}

	.faq-answer.shown {
		opacity: 1;
		display: block;
	}

	.faq-answer.light {
		color: var(--white);
		transition: all 0.15s cubic-bezier(0.77, 0, 0.175, 1);
		display: none;
	}

	.faq-answer.light p {
		color: var(--white);
		font-size: 1rem;
	}

	.faq-answer.light a {
		color: var(--white);
		font-size: 1rem;
		text-decoration: underline;
	}

	.faq-answer p {
		color: #111;
		font-size: 1.5rem;
		font-weight: 300;
		line-height: 1.24;
	}

	.faq-answer.discover-faq {
		color: #111;
		font-family: Foundersgrotesk, sans-serif;
		font-size: 1.5rem;
		line-height: 1.24;
	}

	.faq-answer.discover-faq a {
		font-size: 1.5rem;
	}

	.grow-your-business-with-placer-icon {
		margin-bottom: 2rem;
	}

	.xtra-cards-grid {
		grid-column-gap: 24px;
		grid-row-gap: 34px;
		flex: none;
		grid-template-rows: auto auto;
		grid-template-columns: 1fr 1fr 1fr;
		grid-auto-columns: 1fr;
		width: 100%;
		display: grid;
	}

	.xtra-card {
		background-color: var(--white);
		border-radius: 12px;
		flex-direction: column;
		justify-content: flex-start;
		align-items: stretch;
		min-height: 580px;
		display: flex;
		box-shadow: 0 4px 15px #00000026;
	}

	.image {
		object-fit: cover;
		border-top-left-radius: 12px;
		border-top-right-radius: 12px;
		flex: none;
		height: 50%;
	}

	.flex-v-start-start {
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		display: flex;
	}

	.flex-v-start-start.left-right-padding-1-25rem {
		padding-top: 1rem;
		padding-left: 1.25rem;
		padding-right: 1.25rem;
	}

	.flex-v-start-start.left-right-padding-1-25rem.top-padding-1rem {
		padding-bottom: 2rem;
	}

	.flex-v-start-start.width-52 {
		flex: 0 0 52%;
	}

	.flex-v-start-start.width-52.margin-top-left-bottom-1-5rem {
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
		margin-left: 1.5rem;
	}

	.flex-v-start-start.grow {
		flex: 1;
	}

	.flex-v-start-start.padding-bottom-1rem {
		padding-bottom: 1rem;
	}

	.flex-v-start-start.gap-16px {
		grid-column-gap: 16px;
		grid-row-gap: 16px;
	}

	.margin-bottom-1rem {
		margin-bottom: 1rem;
	}

	.margin-bottom-1rem.height-limit-4-5rem {
		height: 4.5rem;
	}

	.margin-bottom-1rem.height-limit-3-5rem {
		height: 3.5rem;
	}

	.margin-bottom-1rem.display-block {
		display: block;
	}

	.div-ghost-white {
		background-color: var(--ghost-white);
	}

	.div-dark-gray {
		background-color: var(--dark-grey);
	}

	.border-gray {
		border: 1px solid var(--light-grey);
	}

	.left-quotation-mark {
		position: relative;
	}

	.quotation-author-detais-container {
		grid-column-gap: 20px;
		grid-row-gap: 4px;
		grid-template-columns: 83px 1fr;
	}

	.quotation-text {
		font-size: 1.5rem;
		line-height: 1.6;
	}

	.quotation-text p {
		font-size: 1.5rem;
	}

	.mobile-text-size-1rem.no-margin {
		margin-bottom: 0;
	}

	.mobile-text-size-1rem.no-margin.line-height-1-3 {
		line-height: 1.3;
	}

	.mobile-text-size-1rem.no-margin.line-height-1 {
		line-height: 1;
	}

	.mobile-text-size-1rem.no-margin.line-height-1.text-bold {
		font-weight: 700;
	}

	.quotation-author-photo {
		border-radius: 100%;
		width: 83px;
		position: relative;
		top: -4px;
	}

	.no-bottom-margin {
		margin-bottom: 0;
	}

	.style-guide-components-grid {
		grid-column-gap: 32px;
		grid-row-gap: 16px;
		grid-template-columns: 0.25fr 1fr;
		width: 100%;
	}

	.div-gray-gradient {
		background-image: linear-gradient(to bottom, white, #ffffff17 0%, var(--ghost-white));
	}

	.div-gray-gradient.flip {
		background-image: linear-gradient(to top, white, #ffffff17 0%, var(--ghost-white));
	}

	.desktop-width-limit-42ch {
		max-width: 42ch;
	}

	.flex-h-stretch-start {
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: stretch;
		width: 100%;
		display: flex;
		position: relative;
	}

	.flex-h-stretch-start.margin-top-2-5rem {
		margin-top: 2.5rem;
	}

	.analytics-reports-wrapper {
		flex: none;
		width: 100%;
		margin-top: 4rem;
		margin-bottom: 3rem;
	}

	.analytics-reports-list {
		grid-column-gap: 16px;
		grid-row-gap: 80px;
		grid-template-rows: auto;
		grid-template-columns: 1fr 1fr 1fr;
		grid-auto-columns: 1fr;
		width: 100%;
		display: grid;
	}

	.divider-gray {
		background-color: var(--light-grey);
		width: 100%;
		height: 1px;
		margin-top: 3rem;
		margin-bottom: 3rem;
	}

	.divider-gray.no-margins {
		margin-top: 0;
		margin-bottom: 0;
	}

	.divider-gray.margin-top-1-875rem.margin-bottom-1rem {
		margin-bottom: 1rem;
	}

	.tabs-menu {
		flex-direction: column;
		flex: none;
		width: 25%;
		margin-right: 80px;
		display: flex;
	}

	.tabs-menu.press {
		flex-direction: row;
	}

	.section-94vh {
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 94.375vh;
		padding-left: 2.5rem;
		padding-right: 2.5rem;
		display: flex;
		position: relative;
	}

	.section-94vh.div-gray-gradient {
		background-image: linear-gradient(#ffffff17, #f1f3fb);
	}

	.section-94vh.div-gray-gradient.desktop-no-right-padding {
		padding-right: 0;
	}

	.section-94vh.home-page {
		background-image: radial-gradient(
			circle farthest-corner at 50% 50%,
			var(--light-steel-blue),
			white
		);
		background-image: radial-gradient(circle, #a6bcf9, #fff);
		overflow: hidden;
	}

	.container-right {
		width: 100%;
		max-width: 1000px;
		margin-left: auto;
		margin-right: 0;
	}

	.desktop-width-limit-53ch {
		max-width: 53ch;
	}

	.container-large {
		width: 100%;
		max-width: 1000px;
	}

	.container-large.desktop-hidden {
		display: none;
	}

	.container-large.padding-right-left-10px {
		padding-left: 10px;
		padding-right: 10px;
	}

	.container-large.for-embed {
		max-width: 1400px;
	}

	.container-large.flex-h-center-space.tablet-mobile-flex-v {
		grid-column-gap: 40px;
		flex-flow: row;
		justify-content: space-between;
		align-items: center;
	}

	.container-large.is--strip {
		max-width: 100%;
	}

	.container-large.onboarding {
		flex-flow: column;
		justify-content: space-between;
		align-items: flex-start;
		height: 100%;
		display: flex;
	}

	.container-large.flex-h-stretch-start.gap-20px {
		grid-column-gap: 20px;
		grid-row-gap: 20px;
		flex-flow: row;
	}

	.container-large.bg-f9f8f7 {
		padding: 3rem 3rem 3rem 1.75rem;
	}

	.container-large.margin-x-auto {
		flex-flow: column;
		margin-left: auto;
		margin-right: auto;
		display: flex;
	}

	.container-large.anchor-insider-banner {
		grid-column-gap: 2rem;
		grid-row-gap: 2rem;
		background-color: var(--anchor-dark-purple);
		color: var(--white);
		text-align: center;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		padding: 5rem 1.5rem;
		font-size: 1rem;
		display: flex;
	}

	.container-large.anchor-gray-banner-container {
		grid-column-gap: 5rem;
		grid-row-gap: 5rem;
		background-color: var(--anchor-gray-bg);
		flex-flow: row;
		justify-content: center;
		align-items: center;
		padding: 5rem 8%;
		display: flex;
	}

	.container-large.gap-y-2rem {
		grid-row-gap: 2rem;
		flex-flow: column;
		display: flex;
	}

	.container-large.bg-anchor-gray {
		background-color: var(--anchor-gray-bg);
	}

	.tabs-content {
		width: 70%;
	}

	.tabs {
		flex-direction: row;
		margin-top: 3.5rem;
		display: flex;
	}

	.tab-title-grid {
		grid-column-gap: 16px;
		grid-row-gap: 10px;
		grid-template-rows: auto auto;
		grid-template-columns: 4px 1fr;
		grid-auto-columns: 1fr;
		min-height: 90px;
		display: grid;
	}

	.tab-divider {
		background-color: var(--light-grey);
		width: 4px;
		height: 100%;
	}

	.flex-h-center-start {
		justify-content: flex-start;
		align-items: center;
		display: flex;
	}

	.flex-h-center-start.mobile {
		display: none;
	}

	.flex-h-center-start.gap-0-5rem {
		grid-column-gap: 0.5rem;
	}

	.flex-h-center-start.link-semi-bold {
		font-weight: 600;
	}

	.flex-h-center-start.link-semi-bold.discover-announcement-link {
		padding-left: 10px;
		font-family: Foundersgrotesk, sans-serif;
		font-size: 1.25rem;
		font-weight: 400;
		display: inline-block;
	}

	.flex-h-center-start.link-semi-bold.discover-announcement-link.inline-text {
		padding-left: 0;
	}

	.flex-h-center-start.gap-2-5rem {
		grid-column-gap: 2.5rem;
		grid-row-gap: 2.5rem;
	}

	.flex-h-center-start.gap-0-5rem {
		grid-column-gap: 0.5rem;
		grid-row-gap: 0.5rem;
	}

	.flex-h-center-start.mobile-flex-v {
		flex-flow: column;
		justify-content: flex-start;
		align-items: center;
	}

	.flex-h-center-start.gap-16px {
		grid-column-gap: 16px;
		grid-row-gap: 16px;
	}

	.tab-link {
		background-color: #0000;
		flex: none;
		margin-bottom: 1rem;
		padding: 0 16px 0 0;
	}

	.tab-link:hover,
	.tab-link.w--current {
		background-color: var(--light-blue-1);
	}

	.flex-h-end-start {
		align-items: flex-end;
		display: flex;
	}

	.div-white-smoke {
		background-image: linear-gradient(to bottom, var(--white-smoke-2), var(--white-smoke-2));
	}

	.container-small.round-corners-12px.div-white.box-shadow.padding-right-left-2-5rem {
		padding: 2rem 2.5rem;
	}

	.container-small.round-corners-12px.div-white.box-shadow.padding-right-left-2-5rem.padding-top-bottom-4rem {
		padding-top: 4rem;
		padding-bottom: 4rem;
	}

	._2-col-2-row-grid {
		grid-column-gap: 80px;
		grid-row-gap: 16px;
		grid-template-rows: auto auto;
		grid-template-columns: 1fr 1fr;
		grid-auto-columns: 1fr;
		display: grid;
	}

	._2-col-2-row-grid.padding-5rem {
		padding: 5rem;
	}

	._2-col-2-row-grid.margin-top-2-5rem {
		margin-top: 2.5rem;
	}

	._2-col-2-row-grid.margin-top-2-5rem.row-80-gap {
		grid-row-gap: 80px;
	}

	.posts-wrapper {
		flex: none;
		width: 100%;
	}

	.posts-grid {
		grid-column-gap: 50px;
		grid-row-gap: 60px;
		flex: none;
		grid-template-rows: auto;
		grid-template-columns: 1fr 1fr 1fr;
		grid-auto-columns: 1fr;
		width: 100%;
		display: grid;
	}

	.post-summary-box {
		flex: none;
		height: 310px;
	}

	.flex-v-start-space {
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		display: flex;
	}

	.flex-v-start-space.gap-y-0-5rem {
		grid-row-gap: 0.5rem;
	}

	.flex-h-center-space {
		flex: none;
		justify-content: space-between;
		align-items: center;
		display: flex;
	}

	.flex-h-center-space.padding {
		padding-top: 6%;
		padding-bottom: 6%;
	}

	.flex-h-center-space.padding.link {
		color: var(--primary);
		transition: all 0.2s;
	}

	.flex-h-center-space.padding.link:hover {
		color: var(--brand);
	}

	.flex-h-center-space.gap-24 {
		grid-column-gap: 24px;
		grid-row-gap: 24px;
	}

	.flex-h-center-space.gap-x-5rem {
		grid-column-gap: 80px;
	}

	.flex-h-center-space.gap-16px {
		grid-column-gap: 16px;
		grid-row-gap: 16px;
	}

	.flex-h-center-space.gap-x-1-25rem {
		grid-column-gap: 1.25rem;
	}

	.height-limit-7ch {
		flex-wrap: wrap;
		max-height: 7ch;
		overflow: hidden;
	}

	.height-limit-7ch.margin-top-1-25rem {
		margin-top: 1.25rem;
	}

	.bold {
		font-weight: 700;
	}

	.post-link {
		color: #333;
		flex-direction: column;
		width: 100%;
		font-weight: 400;
		display: flex;
	}

	.margin-bottom-3rem {
		margin-bottom: 3rem;
	}

	._2-col-3-row-grid-1-55fr-1fr {
		grid-column-gap: 80px;
		grid-row-gap: 16px;
		grid-template-rows: auto auto auto;
		grid-template-columns: 1.55fr 1fr;
		grid-auto-columns: 1fr;
		display: grid;
	}

	._2-col-3-row-grid-1-55fr-1fr.analytics {
		grid-column-gap: 0px;
		grid-template-columns: 2fr 0.75fr;
	}

	.div-slate-blue {
		background-color: var(--slate-blue);
	}

	.text-purple {
		color: var(--brand);
	}

	.text-purple.text-semibold {
		padding-top: 6px;
		padding-bottom: 6px;
	}

	.div-transparent,
	.div-transparent.w--current {
		background-color: #0000;
	}

	.div-transparent.no-padding {
		padding: 0;
	}

	.div-transparent.no-padding.height-48px {
		height: 48px;
	}

	.width-210px {
		width: 210px;
	}

	.width-150px {
		width: 150px;
	}

	.width-195px {
		width: 195px;
	}

	.margin-right-left-0-8rem {
		margin-left: 0.8rem;
		margin-right: 0.8rem;
	}

	.border-white {
		border: 2px solid var(--white);
	}

	.div-white-9 {
		background-color: #ffffff17;
	}

	.div-white-9.absolute-position {
		position: absolute;
		inset: 0% 0% 0% auto;
	}

	.div-white-9.absolute-position.width-2-5rem {
		width: 2.5rem;
	}

	.div-white-9.absolute-position.width-2-5rem.mobile-width-1-5rem.v-mobile-width-1rem {
		flex: none;
	}

	.desktop-margin-top-6rem {
		margin-top: 6rem;
	}

	.utility-page-wrap {
		justify-content: center;
		align-items: center;
		width: 100vw;
		max-width: 100%;
		height: 100vh;
		max-height: 100%;
		display: flex;
	}

	.utility-page-content {
		text-align: center;
		flex-direction: column;
		width: 260px;
		display: flex;
	}

	.category-grid {
		flex-wrap: wrap;
		align-items: flex-start;
		display: flex;
	}

	.empty-state {
		height: 0;
		padding: 0;
	}

	.hidden {
		display: none;
	}

	.text-black {
		color: var(--primary);
	}

	.text-black.text-small.margin-top-0-5rem {
		margin-top: 0.5rem;
	}

	.text-black.text-1rem {
		letter-spacing: normal;
	}

	.text-black.text-1rem:hover {
		text-decoration: underline;
	}

	.vertical-divider {
		background-color: var(--light-grey);
		width: 1px;
		height: 100%;
	}

	.vertical-divider.div-light-gray.width-2px {
		width: 2px;
	}

	.vertical-divider.flex-child {
		background-color: var(--gainsboro);
		align-self: stretch;
		height: auto;
	}

	.margin-right-0-5rem {
		margin-right: 0.5rem;
	}

	.container-medium {
		flex: none;
		width: 75%;
		margin-left: 0;
		margin-right: 0;
		position: relative;
	}

	.container-medium.mobile-padding-right-left-1-25rem.full-width {
		width: 100%;
	}

	.position-relative {
		position: relative;
	}

	.position-relative.height-100px {
		height: 100px;
	}

	.position-relative._2-col-2-row-16-col-gap-align-start-distribute-center-grid {
		grid-column-gap: 16px;
		grid-row-gap: 16px;
		grid-template-rows: auto auto;
		grid-template-columns: 1fr 1fr;
		grid-auto-columns: 1fr;
		display: grid;
	}

	.position-relative.top-2rem {
		z-index: 0;
		top: 2rem;
	}

	.about-us-video-container {
		flex-direction: column;
		flex: 1;
		justify-content: center;
		align-items: center;
		margin-top: 5rem;
		display: flex;
		position: relative;
	}

	.about-us-video-container.margin-left-4rem {
		margin-left: 4rem;
	}

	.about-us-video-container.margin-left-4rem.no-top-margin {
		margin-top: 0;
	}

	.about-us-video-container.margin-left-4rem.no-top-margin.card {
		border-radius: 12px;
		min-height: auto;
		padding: 1.35rem;
		box-shadow: 0 4px 30px #0000001a;
	}

	.about-us-video-container.no-top-margin {
		margin-top: 0;
	}

	.about-us-video-container.no-top-margin.card {
		border-radius: 12px;
		min-height: auto;
		padding: 1.35rem;
		box-shadow: 0 4px 30px #0000001a;
	}

	.want-to-join-our-team-image {
		width: 353px;
		display: none;
		position: absolute;
		bottom: -3.5rem;
		left: auto;
		right: 0%;
	}

	.investors-logos-grid {
		grid-column-gap: 64px;
		grid-row-gap: 16px;
		flex-wrap: wrap;
		grid-template-rows: auto;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		grid-auto-columns: 1fr;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		display: grid;
		position: relative;
	}

	._3-col-6-row-1fr-0-5fr-0-5fr-col-gap-40-grid {
		grid-column-gap: 40px;
		grid-row-gap: 16px;
		grid-template-rows: auto auto auto auto auto auto;
		grid-template-columns: 1fr 0.5fr 0.5fr;
		grid-auto-columns: 1fr;
		height: 452px;
		display: grid;
	}

	._2-col-2-row-col-gap-40-grid {
		grid-column-gap: 20px;
		grid-row-gap: 24px;
		grid-template-rows: auto;
		grid-template-columns: 1fr 1fr;
		grid-auto-columns: 1fr;
		align-content: start;
		display: grid;
	}

	.width-100 {
		width: 100%;
	}

	.width-100.mobile-widget-content {
		display: none;
	}

	.height-100 {
		height: 100%;
	}

	._1-col-2-row-grid {
		grid-column-gap: 16px;
		grid-row-gap: 24px;
		grid-template-rows: 1fr 1fr;
		grid-template-columns: 1fr;
		grid-auto-columns: 1fr;
		align-content: space-between;
		align-items: stretch;
		display: grid;
	}

	.text-small {
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.text-small.text-normal.height-limit-12-5ch {
		width: 100%;
		max-height: 12.5ch;
		overflow: hidden;
	}

	.text-small.margin-left-0-5rem {
		margin-left: 0.4rem;
	}

	.map-image-wrap {
		flex: none;
		width: 100%;
		height: 100%;
		position: absolute;
		inset: 0%;
	}

	.font-inter-light {
		font-family: Inter, sans-serif;
		font-weight: 300;
	}

	.font-inter-bold {
		font-weight: 600;
	}

	.heading-xlarge {
		font-size: 4.375rem;
	}

	.metrics-wrapper {
		flex-direction: row;
		justify-content: center;
		width: 100%;
		margin-bottom: 3%;
		padding-left: 1rem;
		padding-right: 1rem;
		display: flex;
	}

	.metrics-wrapper.vertical-no-padding {
		flex-direction: column;
		justify-content: flex-start;
		align-items: stretch;
		padding-left: 0;
		padding-right: 0;
	}

	.metrics-wrapper.justify-space {
		justify-content: space-between;
	}

	.text-21 {
		font-size: 1.5rem;
	}

	.text-21.text-semibold.text-dim-grey {
		color: var(--secondary);
	}

	.subtext {
		color: var(--secondary);
		font-size: 0.75rem;
	}

	.subtext.testimonial {
		color: var(--dark-grey);
		font-size: 1rem;
		font-weight: 400;
	}

	.subtext.testimonial.max-width-90 {
		max-width: 90%;
	}

	.text-semibold {
		font-weight: 600;
	}

	.text-semibold.text-line-height-1-1 {
		line-height: 1.1;
	}

	.text-semibold.text-line-height-1-1.margin {
		margin-top: 4px;
		margin-left: 4px;
	}

	.text-semibold.text-line-height-1-1.margin.hide {
		display: none;
	}

	.youtube {
		flex: none;
		height: 100%;
	}

	.chart {
		width: 100%;
		height: 84%;
	}

	.chart.height-143px {
		height: 143px;
	}

	.text-normal {
		font-weight: 400;
	}

	.text-normal.margin-left-0-8rem {
		flex: none;
		margin-left: 0.8rem;
	}

	.text-light {
		font-weight: 300;
	}

	.text-bold {
		font-weight: 700;
	}

	.text-bold.text-small.text-black.responsive-font-size {
		font-size: 1.375rem;
	}

	.text-bold.text-small.text-black.responsive-font-size.request-demo-page {
		font-size: 1.25rem;
	}

	.text-bold.margin-bottom-2rem {
		font-size: 1.1rem;
	}

	.text-bold.margin-bottom-2rem.premium-only {
		display: none;
	}

	.text-bold.text-1-5rem {
		font-size: 1.5rem;
		line-height: 1.3;
	}

	.text-bold.padding-bottom-0 {
		margin-bottom: 0;
	}

	.margin-top-bottom-2-5rem {
		margin-top: 2.5rem;
		margin-bottom: 2.5rem;
	}

	._2-col-4-row-col-32-row-50-grid {
		grid-column-gap: 32px;
		grid-row-gap: 50px;
		grid-template-rows: auto auto auto auto;
		grid-template-columns: 60px 1fr;
	}

	.step-number {
		height: 36px;
		position: relative;
		top: 8px;
	}

	._2-col-2-row-col-80-row-80-gap-grid {
		grid-column-gap: 80px;
		grid-row-gap: 80px;
		grid-template-rows: auto auto;
		grid-template-columns: 1fr 1fr;
		grid-auto-columns: 1fr;
		display: grid;
	}

	._2-col-2-row-col-80-row-80-gap-grid.margin-bottom-8rem {
		margin-bottom: 8rem;
	}

	.lightbox-link {
		flex-direction: column;
		justify-content: center;
		align-items: center;
		display: flex;
		position: relative;
	}

	.div-left {
		margin-left: 0;
		margin-right: auto;
	}

	.question-arrow {
		margin-left: 0.5rem;
	}

	.title-text-card {
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		padding: 0;
		display: flex;
	}

	.title-text-card:last-child {
		box-shadow: none;
		color: var(--dark-grey);
		border-radius: 0;
		justify-content: center;
	}

	.divider-white-0-5-opacity {
		background-color: #ffffff80;
		width: 100%;
		height: 1px;
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.download-purple-icon {
		flex: none;
		width: 22px;
		margin-right: 0.5rem;
		display: block;
	}

	.download-white-icon {
		flex: none;
		width: 22px;
		margin-right: 0.5rem;
	}

	.flex-h-start-space {
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
		display: flex;
		position: relative;
	}

	.flex-h-start-space.width-520px {
		width: 520px;
	}

	.flex-h-start-space.gap-1-25rem {
		grid-column-gap: 1.25rem;
	}

	.flex-h-start-space.gap-8 {
		grid-column-gap: 8%;
		grid-row-gap: 8%;
	}

	.flex-h-start-space.gap-x-2rem {
		grid-column-gap: 2rem;
	}

	.tab {
		color: var(--dark-grey);
		background-color: #0000;
		padding: 0.5rem 1rem;
		font-weight: 300;
	}

	.tab.w--current {
		border-bottom-color: var(--primary);
		color: var(--primary);
		background-color: #0000;
		font-weight: 600;
	}

	.tabs-content {
		width: auto;
		padding-top: 2rem;
		overflow: visible;
	}

	.margin-top-2-5rem {
		margin-top: 2.5rem;
	}

	.margin-top-2-5rem.margin-bottom-7rem {
		margin-bottom: 7rem;
	}

	.lock-icon-circle {
		position: absolute;
	}

	.gray-line {
		background-color: #e5e5e5;
		flex: none;
		width: 100%;
		height: 1px;
	}

	.margin-top-0-25rem {
		margin-top: 0.35rem;
	}

	.flex-h-s-sp {
		justify-content: space-between;
		display: flex;
	}

	.flex-h-s-sp.margin-bottom-5rem {
		margin-bottom: 5rem;
	}

	.flex-h-s-sp.margin-bottom-5rem.shadow-box {
		border-radius: 12px;
		box-shadow: 0 4px 30px #0000001a;
	}

	.margin-bottom-0-5rem {
		margin-bottom: 0.5rem;
	}

	.container-full-width {
		width: 100%;
	}

	.flex-v-center-start {
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		display: flex;
	}

	.flex-v-center-start.gap-1rem {
		grid-column-gap: 1rem;
		grid-row-gap: 1rem;
	}

	.flex-v-center-start.gap-y-1rem {
		grid-row-gap: 1rem;
	}

	.flex-v-start-center {
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		display: flex;
	}

	.flex-v-start-center.width-100.margin-top-0-25rem.show-only-mobile {
		display: none;
	}

	.flex-v-start-center.gap-24 {
		grid-column-gap: 24px;
		grid-row-gap: 24px;
	}

	.flex-v-start-center.gap-40 {
		grid-column-gap: 40px;
		grid-row-gap: 40px;
	}

	.flex-v-start-center.gap-8px {
		grid-column-gap: 8px;
		grid-row-gap: 8px;
	}

	.flex-v-start-center.gap-y-0-5rem {
		grid-row-gap: 0.5rem;
	}

	.flex-v-s-st {
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		display: flex;
	}

	.flex-v-s-st.padding-top-bottom-1rem.flex-y-center {
		justify-content: flex-start;
		padding-top: 2.5rem;
	}

	.flex-v-s-st.width-1-2 {
		justify-content: flex-start;
		width: 50%;
	}

	.flex-v-s-st.gap-y-1-5rem {
		grid-row-gap: 1.5rem;
	}

	.flex-v-s-st.gap-y-1-5rem.align-top {
		justify-content: flex-start;
		align-items: flex-start;
	}

	.flex-v-s-st.gap-y-1-5rem.align-top.show-on-mobile {
		display: none;
	}

	.flex-v-s-st.padding-bottom-1-rem.border-bottom {
		border-bottom-color: var(--light-grey);
	}

	.padding-all-3-125rem {
		padding: 3.125rem;
	}

	.style-guide-margins-wrapper,
	.style-guide-padding-wrapper {
		display: flex;
	}

	.text-dark-purple {
		color: var(--brand-hover);
	}

	.text-xsmall {
		font-size: 0.75rem;
	}

	.text-xsmall.text-dark-gray.text-normal {
		color: #747474;
	}

	.text-xsmall.text-dark-gray.margin-top-0-5rem {
		margin-top: 0.5rem;
	}

	.margin-left-0 {
		margin-left: 0;
	}

	.padding-top-0-35rem {
		padding-top: 0.35rem;
	}

	.position-absolute.box-piece-2 {
		inset: auto auto -15% -15%;
	}

	.position-absolute.box-piece-3 {
		z-index: 0;
		inset: auto 19% -18% auto;
	}

	.position-absolute.box-piece-4 {
		inset: auto -27% 43% auto;
	}

	.position-absolute.box-piece-5 {
		z-index: 2;
		inset: -29% auto auto 17%;
	}

	.position-absolute.height-95 {
		height: 95%;
	}

	.position-absolute.bg-leaderboard-section {
		z-index: -1;
		width: 30%;
		inset: 0% auto auto 0%;
	}

	.position-absolute.bg-leaderboard-section._2 {
		inset: auto 0% 0% auto;
	}

	.position-absolute.halfway-point-img-2 {
		width: 340px;
		bottom: -17.5%;
	}

	.width-80 {
		flex: none;
		width: 80%;
	}

	.overflow-hidden {
		overflow: hidden;
	}

	.position-sticky {
		position: sticky;
	}

	.library-category-box {
		background-color: var(--brand);
		border-radius: 12px;
		flex: none;
		padding: 0.25rem 0.5rem;
		font-weight: 400;
	}

	.text-1rem {
		font-size: 1rem;
		line-height: 1.4;
	}

	.text-1rem.margin-right-0-5rem {
		margin-right: 0.5rem;
		font-weight: 400;
	}

	.flex-h-start-start {
		align-items: flex-start;
		display: flex;
	}

	.flex-h-start-start.trust-center-flex {
		grid-column-gap: 32px;
		grid-row-gap: 32px;
	}

	.flex-h-start-start.gap-x-1-5rem {
		grid-column-gap: 1.5rem;
		align-items: center;
	}

	.flex-h-start-start.gap-24px {
		grid-column-gap: 24px;
		grid-row-gap: 24px;
	}

	.flex-h-start-start.gap-x-5rem {
		grid-column-gap: 5rem;
	}

	.divider-gray-short {
		background-color: var(--light-grey);
		width: 26px;
		height: 1px;
		margin-top: 3rem;
		margin-bottom: 3rem;
	}

	.divider-gray-short.no-top-margin {
		margin-top: 0;
	}

	.divider-gray-short.no-top-margin.no-bottom-margin {
		margin-bottom: 0;
	}

	._2-col-2-row-col-16-gap-grid {
		grid-column-gap: 16px;
		grid-row-gap: 16px;
		grid-template-rows: auto auto;
		grid-template-columns: 1fr 1fr;
		grid-auto-columns: 1fr;
		display: grid;
	}

	._2-col-2-row-col-16-gap-grid.margin-top-1rem {
		margin-top: 1rem;
	}

	._2-col-2-row-col-16-gap-grid.margin-top-1rem.bottom-0 {
		position: absolute;
		inset: auto 0% 0%;
	}

	._2-col-2-row-col-16-gap-grid.margin-top-1rem.bottom-0.padding-right-left-1-5rem {
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}

	.overflow-visible {
		overflow: visible;
	}

	.active-tab-underline {
		background-color: var(--primary);
		border-radius: 20px;
		flex: none;
		width: 100%;
		height: 4px;
		display: none;
		position: absolute;
		bottom: 0;
	}

	.mobile-choose-category-btn {
		display: none;
	}

	.featured-tab {
		color: var(--dark-grey);
		background-color: #0000;
		padding: 0.5rem 1rem;
		font-weight: 300;
	}

	.featured-tab.w--current {
		color: var(--primary);
		background-color: #0000;
		font-weight: 600;
	}

	.featured-tab.height-100.flex-v-c-c.padding-right-left-1-5rem {
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}

	.white-papers-tab {
		color: var(--dark-grey);
		background-color: #0000;
		padding: 0.5rem 1rem;
		font-weight: 300;
	}

	.white-papers-tab.w--current {
		color: var(--primary);
		background-color: #0000;
		font-weight: 600;
	}

	.white-papers-tab.height-100.flex-v-c-c.padding-right-left-1-5rem {
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}

	.webinars-tab {
		color: var(--dark-grey);
		background-color: #0000;
		padding: 0.5rem 1rem;
		font-weight: 300;
	}

	.webinars-tab.w--current {
		color: var(--primary);
		background-color: #0000;
		font-weight: 600;
	}

	.webinars-tab.height-100.flex-v-c-c.padding-right-left-1-5rem {
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}

	.guides-tab {
		color: var(--dark-grey);
		background-color: #0000;
		padding: 0.5rem 1rem;
		font-weight: 300;
	}

	.guides-tab.w--current {
		color: var(--primary);
		background-color: #0000;
		font-weight: 600;
	}

	.guides-tab.height-100.flex-v-c-c.padding-right-left-1-5rem {
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}

	.tab {
		color: var(--dark-grey);
		background-color: #0000;
		border-bottom: 4px solid #0000;
		flex-direction: column;
		flex: none;
		justify-content: center;
		align-items: center;
		min-height: 70px;
		padding-left: 1.5rem;
		padding-right: 1.5rem;
		font-weight: 300;
		transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
		display: flex;
		position: relative;
	}

	.tab:hover {
		border-bottom-color: var(--primary);
	}

	.tab.w--current {
		color: var(--primary);
		background-color: #0000;
		font-weight: 600;
	}

	.tab.height-100.flex-v-c-c.padding-right-left-1-5rem {
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}

	.no-padding {
		flex: none;
		padding: 0;
	}

	.style-guide-flex-wrapper {
		grid-column-gap: 16px;
		grid-row-gap: 16px;
		flex-direction: column;
		display: flex;
	}

	.flex-h-center-center {
		justify-content: center;
		align-items: center;
		display: flex;
	}

	.flex-h-center-center.wrap {
		flex-flow: wrap;
	}

	.margin-right-3-75rem {
		flex: none;
		margin-right: 3.75rem;
	}

	.margin-left-3-75rem {
		flex: none;
		margin-left: 3.75rem;
		margin-right: 0;
	}

	.category-active-state {
		border: 1px solid var(--brand);
		color: var(--brand);
	}

	.z-index-1 {
		z-index: 1;
		position: relative;
	}

	.height-100vh {
		height: 100vh;
	}

	._2-col-2-row-16-col-gap-align-start-distribute-center-grid {
		align-content: center;
		place-items: start;
	}

	.section-triangle-left-right {
		border-style: solid;
		border-width: 150px 0 0 100vw;
		border-color: transparent transparent transparent var(--white-smoke);
		width: 0;
		height: 0;
		padding-right: 0;
		position: relative;
	}

	.section-triangle-left-right.top-minus-9-375rem {
		z-index: 0;
		top: -9.375rem;
	}

	.section-triangle-left-right-purple {
		border-style: solid;
		border-width: 150px 0 0 100vw;
		border-color: transparent transparent transparent var(--brand);
		width: 0;
		height: 0;
		padding-right: 0;
		position: relative;
	}

	.section-triangle-left-right-purple.top-minus-9-375rem {
		z-index: 0;
		top: -9.375rem;
	}

	.section-triangle-left-right-purple.position-absolute {
		position: absolute;
	}

	.margin-right-left-auto {
		flex: none;
		margin-left: auto;
		margin-right: auto;
	}

	.section-triangle-left-right-white {
		border-style: solid;
		border-width: 180px 0 0 100vw;
		border-color: transparent transparent transparent var(--white);
		width: 0;
		height: 0;
		padding-right: 0;
		position: relative;
	}

	.section-triangle-left-right-white.top-6-5rem {
		flex: none;
		top: 6.5rem;
	}

	.section-triangle-left-right-white.position-absolute {
		position: absolute;
	}

	.section-triangle-left-right-white.position-absolute.top-minus-7-5rem {
		border-top-width: 120px;
		top: -7.5rem;
	}

	.z-index-10 {
		z-index: 10;
		position: relative;
	}

	.z-index-0 {
		z-index: 0;
		position: relative;
	}

	.heading-xxlarge {
		font-size: 19rem;
		line-height: 1;
	}

	._3-col-1fr-3px-1fr-grid {
		grid-column-gap: 16px;
		grid-row-gap: 16px;
		grid-template-rows: auto;
		grid-template-columns: 1fr 2px 1fr;
		grid-auto-columns: 1fr;
		padding-left: 1.25rem;
		padding-right: 1.25rem;
		display: grid;
	}

	.flex-v-center-space {
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		display: flex;
	}

	.flex-v-center-space.gap-0-5rem {
		grid-column-gap: 0.5rem;
		grid-row-gap: 0.5rem;
	}

	.height-4ch {
		flex: none;
		max-height: 5ch;
	}

	.subtext-2 {
		color: #4d4d4d;
		font-size: 0.75rem;
	}

	.subtext-2.text-dark-gray.text-normal {
		margin-top: 4px;
	}

	.subtext-2.font-color-767676 {
		color: var(--gray);
	}

	.metrics {
		background-color: #f9f8f7;
		border-radius: 3px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 5.6rem;
		height: 4.375rem;
		margin-right: 0.3rem;
		display: flex;
	}

	.metrics.last {
		margin-right: 0;
	}

	.mask {
		z-index: 3;
		width: 7rem;
		height: 7rem;
		margin-top: -5px;
		display: none;
		position: absolute;
	}

	.paragragh-1-875rem {
		letter-spacing: -0.015em;
		margin-top: 20px;
		margin-bottom: 10px;
		font-size: 1.875rem;
		font-weight: 400;
		line-height: 1.3;
	}

	.link {
		color: #5e63e5;
		font-size: 1.1rem;
	}

	.desktop-width-limit-17ch {
		max-width: 17ch;
	}

	.container-xsmall {
		width: 100%;
		max-width: 672px;
	}

	.fit-contain {
		object-fit: contain;
		object-position: 0% 0%;
		flex: none;
	}

	.margin-top-2rem {
		margin-top: 2rem;
	}

	.margin-top-2rem.mobile-show {
		display: none;
	}

	.h2-small-normal-weight {
		font-size: 1.5rem;
		font-weight: 400;
	}

	.margin-bottom-4rem {
		margin-bottom: 4rem;
	}

	.flex-v-end-start {
		flex-direction: column;
		align-items: flex-end;
		display: flex;
	}

	.width-50 {
		width: 50%;
	}

	.width-50.flex-v-start-space.flex-gap-30px {
		grid-column-gap: 30px;
		grid-row-gap: 30px;
	}

	.width-50.flex-v-start-space.gap-y-0-5rem {
		width: 47%;
	}

	.width-50.flex-v-start-space.gap-y-0-5rem.width-10 {
		width: 10%;
	}

	.width-50.flex-h-center-start.padding-right {
		padding-right: 6%;
	}

	.width-50.flex-h-center-start.padding-right.mobile {
		display: flex;
	}

	.width-50.responsive {
		width: 72%;
	}

	.width-50.text-32px {
		font-size: 2.3vw;
		font-weight: 300;
	}

	.numbered-item-list.margin-top-1-5rem {
		list-style-type: decimal;
	}

	.underline {
		text-decoration: underline;
	}

	.grid-box {
		padding: 0.5rem 1rem;
	}

	.grid-box.div-light-gray.no-bottom-border,
	.grid-box.no-bottom-border,
	.grid-box.no-border {
		border-bottom-style: none;
	}

	.bg-light-blue {
		background-color: var(--light-blue-1);
	}

	.vizcontainer {
		width: 100%;
		max-width: 1000px;
		height: 501px;
	}

	.vizcontainer.brand-dominance {
		height: 760px;
	}

	._2-col-4-row-grid {
		grid-column-gap: 8px;
		grid-row-gap: 8px;
		grid-template-rows: auto auto 1fr auto;
		grid-template-columns: 1fr 1fr;
		grid-auto-columns: 1fr;
		place-content: center;
		place-items: start;
		display: grid;
	}

	.margin-left-1rem {
		margin-left: 1rem;
		display: inline-block;
	}

	.full-width-height {
		width: 100%;
		height: 100%;
	}

	.left-purple-line-container {
		align-items: stretch;
		margin-top: 3rem;
		margin-bottom: 1rem;
		margin-left: -1rem;
		display: flex;
	}

	.left-purple-line-container.first {
		margin-top: 0;
	}

	.line-purple {
		background-color: var(--brand);
		border-radius: 6px;
		flex: none;
		width: 6px;
		min-height: 50px;
	}

	.figure-caption {
		color: var(--dark-grey);
		margin-top: 0.25rem;
		font-size: 0.9rem;
	}

	.width-28 {
		flex: 0 0 28%;
	}

	.width-28.margin-right-2rem {
		margin-right: 2rem;
	}

	.width-28.margin-right-2rem.position-sticky {
		position: sticky;
		top: 120px;
	}

	.guide-content-title {
		color: var(--dark-grey-2);
		cursor: pointer;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 0.5rem;
		padding-right: 1rem;
		font-size: 1rem;
		font-weight: 400;
		line-height: 1.4;
		transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
		display: flex;
		position: relative;
	}

	.guide-content-title:hover {
		color: var(--primary);
		font-weight: 600;
	}

	.guide-content-title.w--current {
		color: var(--brand);
	}

	.guide-content {
		border-right: 1px none var(--light-grey);
		flex: 0 auto;
	}

	.width-35 {
		flex: 0 0 35%;
	}

	.width-60 {
		flex: 0 0 60%;
		width: 60%;
	}

	.position-fixed {
		position: fixed;
	}

	.line-light-gray {
		background-color: var(--light-grey);
		flex: none;
		width: 1px;
		height: 100%;
	}

	.line-light-gray.margin-right-1rem.guides {
		align-self: stretch;
		height: auto;
	}

	.flex-expand {
		flex: 1;
	}

	.width-30 {
		flex: 0 0 30%;
		width: 30%;
	}

	.mobile-margin-top-2rem {
		align-self: center;
	}

	.search-result-link {
		color: var(--primary);
		width: 100%;
		max-width: 100%;
		padding: 5px 16px;
		font-weight: 400;
		transition: all 0.2s;
		display: inline-block;
	}

	.search-result-link:hover {
		color: var(--primary);
		background-color: #0000000a;
	}

	.search-result-link.universal {
		justify-content: space-between;
		align-items: center;
		padding-top: 0;
		padding-bottom: 0;
		line-height: 1.4;
		display: flex;
	}

	.search-result-link.universal.v2 {
		text-align: left;
		min-height: 46px;
		padding-top: 6px;
		padding-bottom: 6px;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.search-result-link.index-page {
		padding-top: 0;
		padding-bottom: 0;
	}

	.search-result-link.index-page:hover {
		background-color: #ffffff80;
	}

	.search-result-link.padding-0px-16px {
		padding: 0 16px;
	}

	.search-address {
		font-size: 0.775rem;
		line-height: 1.26429em;
	}

	.search-address.universal {
		font-size: 0.75rem;
		font-weight: 400;
	}

	.discover-main-wrapper {
		display: flex;
	}

	.discover-main-wrapper.gap-16 {
		grid-column-gap: 16px;
		grid-row-gap: 16px;
	}

	.discover-main-wrapper.padding-top-2rem {
		grid-column-gap: 5.5rem;
		padding-top: 2rem;
		padding-left: 1.25rem;
	}

	.discover-main-wrapper.flex-col {
		grid-row-gap: 20px;
		flex-flow: column;
		justify-content: flex-start;
		width: 50%;
	}

	.discover-main-wrapper.discover-spline-container {
		flex-flow: row-reverse;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		height: 66%;
		display: flex;
		position: relative;
	}

	.margin-top-1rem {
		margin-top: 1rem;
	}

	.heading-paragragh-style {
		font-size: 1.1rem;
		font-weight: 400;
		line-height: 1.6;
	}

	.margin-top-bottom-1-5rem {
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.width-55 {
		width: 55%;
	}

	.width-70 {
		width: 70%;
	}

	.height-70px {
		height: 70px;
	}

	.width-25 {
		width: 25%;
	}

	.font-size-1-875rem {
		font-size: 1.875rem;
	}

	.font-size-1-875rem.text-center.margin-bottom-2-5rem.margin-top-8-125rem {
		z-index: 2;
		background-color: #fff;
		margin-top: 16.125rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		position: relative;
		top: -154px;
	}

	.padding-all-1rem {
		padding: 1rem;
	}

	.position-sticky-top {
		position: sticky;
		top: 0;
	}

	.flex-width-75 {
		flex: 0 0 75%;
	}

	.font-size-2-75rem {
		font-size: 2.75rem;
	}

	.padding-top-22px {
		padding-top: 22px;
	}

	.zip-code-negative-margin-flex {
		grid-column-gap: 40px;
		grid-row-gap: 40px;
		margin-top: -80px;
		margin-left: 12px;
		margin-right: 12px;
		display: flex;
	}

	.cell {
		background-color: #fff;
		border: 2px solid #e5e5e5;
		border-radius: 12px;
		flex-direction: column;
		flex: 1;
		justify-content: center;
		align-items: flex-start;
		padding: 32px;
		display: flex;
		box-shadow: 0 1px 8px #0000001a;
	}

	.cell.zip-codes-right-cell {
		background-image: linear-gradient(#fdfdfd, #f1f3fb);
	}

	.zip-codes-right-cell-heading {
		font-size: 32px;
		line-height: 1;
	}

	.embed-container {
		background-color: #fff;
		border: 1px solid #e5e5e5;
		border-radius: 4px;
		margin-top: 10px;
		box-shadow: 6px 6px 24px #0000000f;
	}

	.zip-code-sticky-heading {
		z-index: 100;
		opacity: 0;
		background-color: #fffffffc;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 0;
		padding-left: 2.5rem;
		padding-right: 2.5rem;
		transition:
			height 0.4s,
			opacity 0.4s;
		display: flex;
		position: sticky;
		top: 5.5rem;
	}

	.square-social-btn {
		background-color: var(--brand);
		border-radius: 5px;
		justify-content: center;
		align-items: center;
		width: 35px;
		height: 35px;
		padding: 6px;
		display: flex;
	}

	.flex-h-center-end {
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		display: flex;
	}

	.font-size-1-25rem {
		font-size: 1.25rem;
	}

	.flev-v-justify-end {
		flex-direction: column;
		justify-content: flex-end;
		display: flex;
	}

	.width-40 {
		width: 40%;
	}

	.square-banner-text {
		color: #e6e6e6;
		font-size: 1rem;
		font-weight: 400;
		line-height: 1.56;
	}

	.margin-bottom-0-9rem {
		margin-bottom: 0.9rem;
	}

	.image-3 {
		max-width: none;
		min-height: 293px;
	}

	.font-size-1-1rem {
		font-size: 1.1rem;
	}

	.font-size-1-1rem.poi-name.line-height-2 {
		line-height: 2;
	}

	.font-size-1-1rem.width-90.discover-faq {
		color: #111;
		font-family: Foundersgrotesk, sans-serif;
		font-size: 2.5rem;
		font-weight: 400;
		line-height: 1.1;
	}

	.font-size-2-5rem {
		font-size: 2.5rem;
	}

	.font-size-2-5rem.text-bold.text-line-height-1-1.text-color-white {
		text-align: center;
		font-size: 3.75rem;
	}

	.font-size-2-5rem.text-bold.line-height-1-4 {
		line-height: 1.2;
	}

	.font-size-2-5rem.text-bold.line-height-1-2.padding-b-1rem {
		padding-bottom: 1rem;
	}

	.desktop-hidden {
		display: none;
	}

	.flex-h-c-s {
		flex: 0 auto;
		align-content: stretch;
		width: 100%;
		display: flex;
	}

	.flex-h-c-s.gap-x-1-5rem {
		grid-column-gap: 1.5rem;
		letter-spacing: normal;
		flex-flow: row;
		font-size: 0.875rem;
		line-height: 1.3;
	}

	.flex-h-c-s.padding-t-1rem {
		grid-row-gap: 40px;
		flex-flow: wrap;
		width: 100%;
		padding-top: 1rem;
	}

	.flex-h-c-s.padding-t-1rem.gap-x-2-5rem {
		grid-column-gap: 40px;
		flex-flow: row;
		width: 100%;
	}

	.flex-h-c-s.padding-t-1rem.gap-x-2-5rem.grid {
		grid-column-gap: 40px;
		grid-row-gap: 40px;
		grid-template-rows: auto auto;
		grid-template-columns: 1fr 1fr;
		grid-auto-columns: 1fr;
		display: grid;
	}

	.flex-h-c-s.padding-t-1-5rem {
		grid-column-gap: 40px;
		grid-row-gap: 40px;
		grid-template-rows: auto;
		grid-template-columns: 1fr 1fr 1fr;
		grid-auto-columns: 1fr;
		width: 100%;
		padding-top: 2.5rem;
		display: grid;
	}

	.flex-h-c-s.padding-t-1-5rem.grid-2-col {
		grid-template-columns: 1fr 1fr;
		padding-top: 1.5rem;
	}

	.flex-h-c-s.padding-t-1-5rem.grid-col-1 {
		flex-flow: column;
		grid-template-columns: 1fr;
		padding-top: 1.5rem;
		display: flex;
	}

	.flex-h-c-s.padding-t-1-5rem.padding-0 {
		padding-top: 0;
	}

	.flex-h-c-s.gap-x-2-5rem {
		grid-column-gap: 40px;
	}

	.flex-h-c-s.padding-top-bottom-2-5rem.gap-x-0-5rem {
		grid-column-gap: 0.5rem;
		justify-content: flex-start;
		align-items: center;
		padding-top: 2.5rem;
		padding-bottom: 1.5rem;
	}

	.flex-h-c-s.padding-top-bottom-2-5rem.gap-24px {
		grid-column-gap: 24px;
		grid-row-gap: 24px;
	}

	.flex-h-c-s.padding-top-bottom-2-5rem.gap-24px.mobile-flex-v.being-to-front {
		z-index: 5;
		position: relative;
	}

	.flex-h-c-s.align-center {
		justify-content: flex-start;
		align-items: center;
	}

	.flex-h-c-s.padding-top-1rem {
		grid-column-gap: 80px;
		padding-top: 16px;
		padding-right: 0;
	}

	.flex-h-c-s.padding-top-1rem.mobile-flex-v {
		justify-content: flex-start;
		align-items: flex-start;
	}

	.flex-h-c-s.gap-x-0-5rem {
		grid-column-gap: 0.5rem;
	}

	.flex-h-c-s.gap-x-0-5rem.hide-on-desktop {
		display: none;
	}

	.flex-h-c-s.width-auto {
		width: auto;
	}

	.flex-h-c-s.gap-x-12px {
		grid-column-gap: 0.75rem;
	}

	.flex-h-c-s.grid-col-2 {
		grid-column-gap: 40px;
		grid-row-gap: 20px;
		grid-template-rows: auto;
		grid-template-columns: 1fr 1fr;
		grid-auto-columns: 1fr;
		align-items: start;
		display: grid;
	}

	.flex-h-c-s.padding-top-1-5rem {
		padding-top: 1.5rem;
	}

	.flex-h-c-s.padding-top-1-5rem.bg-anchor-light-purple {
		background-color: var(--anchor-light-purple-6);
		width: auto;
		margin-top: 1.5rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}

	.max-width-350px {
		max-width: 350px;
	}

	.get-demo-link {
		cursor: pointer;
		margin-top: 1%;
		display: flex;
	}

	.recent-publications {
		grid-column-gap: 20px;
		grid-row-gap: 20px;
		grid-template-rows: auto;
		grid-template-columns: 1fr 1fr 1fr;
	}

	.data-step-1 {
		z-index: 3;
		grid-column-gap: 24%;
		grid-row-gap: 10%;
		justify-content: center;
		display: flex;
		position: relative;
	}

	.width-20 {
		width: 20%;
	}

	.font-size-1-5rem {
		font-size: 1.5rem;
	}

	.font-size-1-5rem.text-bold.text-line-height-1-5 {
		line-height: 1.5;
	}

	.font-size-1-5rem.text-bold.text-line-height-1-5.mobile-line-height {
		margin-bottom: 3%;
		line-height: 1.3;
	}

	.data-step-2 {
		z-index: 2;
		grid-column-gap: 0px;
		grid-row-gap: 0px;
		grid-template-rows: auto;
		grid-template-columns: 1fr 1fr 1fr;
		grid-auto-columns: 1fr;
		justify-content: center;
		display: grid;
		position: relative;
	}

	.data-wrapper {
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		max-width: 295px;
		min-height: 290px;
		display: flex;
		position: relative;
	}

	.floating-data {
		background-image: url('../../../assets/insights/square-stack.svg');
		background-position: 50% 0;
		background-repeat: no-repeat;
		background-size: auto;
		width: 40%;
		height: 25%;
		position: absolute;
	}

	.floating-data._2 {
		background-image: url('../../../assets/insights/plus-stack.svg');
		margin-bottom: 80%;
	}

	.floating-data._1 {
		margin-bottom: 44%;
		margin-left: 69%;
	}

	.floating-data._3 {
		background-image: url('../../../assets/insights/blue-stack.svg');
		margin-bottom: 54%;
		margin-left: -64%;
	}

	.data-step-3 {
		z-index: 3;
		align-items: center;
		display: flex;
		position: relative;
		left: 2%;
		/* top: 200px; */
	}

	.height-30vh {
		height: 30vh;
	}

	.data-subtext {
		margin-top: 1rem;
		font-size: 1.1rem;
		font-weight: 400;
		line-height: 1.4;
		display: inline-block;
	}

	.height-25vh {
		height: 25vh;
	}

	.guide-step h2 {
		border-left: 5px solid var(--brand);
		border-radius: 4px;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		padding-left: 1rem;
	}

	.bg-gradient-f1f3fb {
		background-image: linear-gradient(#f1f3fb, #fff 39%);
	}
	.font-size-2rem {
		font-size: 2rem;
	}

	.diagram-lines {
		background-color: #fff;
		justify-content: center;
		margin-top: -5.2rem;
		display: flex;
	}

	.diagram-lines.absolute {
		z-index: 0;
		background-color: #0000;
		margin-top: -21rem;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
	}

	.diagram-lines.margin-bottom {
		z-index: 2;
		justify-content: center;
		margin-bottom: 4rem;
		position: relative;
	}

	.diagram-lines.last {
		z-index: 3;
		justify-content: flex-start;
		align-items: flex-start;
		margin-top: -4rem;
		margin-bottom: -24%;
		padding-left: 4rem;
		position: relative;
	}

	.text-color-secondary {
		color: var(--secondary);
	}

	.data-dashed-wrapper {
		grid-row-gap: 30px;
		background-color: #fff;
		background-image: url('../../../assets/insights/boarder.svg');
		background-position: 50% 0;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		flex-direction: column;
		justify-content: flex-start;
		padding: 12%;
		display: flex;
	}

	.dotted-data-line {
		z-index: -1;
		position: absolute;
		top: auto;
		bottom: -14%;
		left: -50%;
	}

	.margin-top-5rem {
		margin-top: 5rem;
	}

	.data-floating-text {
		position: absolute;
		inset: auto -85% auto auto;
	}

	.data-floating-text._2 {
		right: -152%;
	}

	.margin-right-2-5rem {
		margin-right: 2.5rem;
	}

	.data-section-bg {
		z-index: 2;
		background-image: linear-gradient(#fff 19%, #f1f3fb);
		width: 100%;
		height: 30vh;
		position: absolute;
		bottom: 0;
	}

	.page-styles {
		display: none;
	}

	.inline-text {
		display: inline;
	}

	.inline-text.text-small {
		font-size: 1.25vw;
	}

	.mobile-logos {
		display: none;
	}

	.universal-v2-tabs-menu {
		grid-column-gap: 0.75rem;
		border-top: 1px solid var(--gainsboro);
		border-bottom: 1px solid var(--gainsboro);
		flex-direction: row;
		align-items: center;
		padding: 0.9rem;
		display: flex;
	}

	.universal-v2-tabs-content {
		border-bottom-right-radius: 6px;
		border-bottom-left-radius: 6px;
		max-height: 24vh;
	}

	.universal-v2-tabs {
		z-index: 6;
		background-color: #fff;
		border-bottom-right-radius: 6px;
		border-bottom-left-radius: 6px;
		width: 100%;
		display: none;
		position: absolute;
		inset: 3.79rem auto auto;
		box-shadow: 0 2px 3px #0000001a;
	}

	.universal-v2-tabs.show {
		display: block;
	}

	.universal-v2-tab {
		border: 1px solid var(--gainsboro);
		color: var(--brand-2);
		background-color: #0000;
		border-radius: 4px;
		padding: 7px 10px;
		font-size: 0.875rem;
	}

	.universal-v2-tab.w--current {
		border-color: var(--brand);
		background-color: var(--brand);
		color: #fff;
	}

	.width-90 {
		width: 90%;
	}

	.region-label {
		color: var(--dark-grey);
		font-size: 0.7759rem;
		font-style: italic;
		font-weight: 400;
	}

	.line-height-1-4 {
		line-height: 1.4;
	}

	.border-box {
		border-top: 1px solid var(--gainsboro);
		border-bottom: 1px solid var(--gainsboro);
		text-align: left;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		min-height: 66px;
		margin-top: -1px;
		padding-top: 6px;
		padding-bottom: 6px;
		display: flex;
	}

	.text-line-height-1-4 {
		line-height: 1.4;
	}

	.poi-page-tabs {
		flex-direction: column;
		align-items: flex-end;
		display: flex;
		position: static;
	}

	.poi-page-tabs-menu {
		flex-direction: row;
		justify-content: flex-start;
		align-items: stretch;
		display: flex;
		position: absolute;
		inset: 0 0 auto auto;
	}

	.poi-page-tabs-content {
		width: 100%;
		margin-top: 4rem;
	}

	.poi-page-tab {
		background-color: #0000;
		padding-top: 1rem;
		padding-bottom: 1rem;
		font-size: 1.2rem;
	}

	.poi-page-tab.w--current {
		border-bottom: 3px solid var(--brand);
		background-color: #0000;
		font-weight: 700;
	}

	.rank-badge {
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
		width: 35%;
		min-width: 230px;
	}

	.flex-h-end-space {
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-end;
		display: flex;
	}

	.main {
		position: relative;
	}

	.cs-bg {
		z-index: -1;
		width: 100%;
		height: 100%;
		min-height: 100vh;
		position: absolute;
		inset: 0%;
		overflow: hidden;
	}

	.lp-circle-a {
		background-color: var(--light-brand);
		filter: blur(738px);
		border-radius: 50vw;
		width: 50vw;
		height: 50vw;
		position: absolute;
		inset: -10vw -20vw auto auto;
	}

	.lp-circle-a-2 {
		background-color: #fff3;
		border-radius: 30vw;
		width: 30vw;
		height: 30vw;
		position: absolute;
		inset: -10vw -7vw auto auto;
	}

	.lp-circle-b {
		background-color: var(--light-brand);
		filter: blur(200px);
		border-radius: 30vw;
		width: 30vw;
		height: 30vw;
		position: absolute;
		top: 50%;
		bottom: auto;
		left: -15vw;
	}

	.lp-circle-b-2 {
		z-index: 1;
		background-color: #fff3;
		border-radius: 30vw;
		width: 30vw;
		height: 30vw;
		position: absolute;
		top: 60%;
		bottom: auto;
		left: -13vw;
	}

	.lp-circle-c {
		background-color: var(--light-brand);
		filter: blur(600px);
		border-radius: 30vw;
		width: 30vw;
		height: 30vw;
		position: absolute;
		bottom: -15vw;
		right: -15vw;
	}

	.lp-circle-c-2 {
		z-index: 1;
		background-color: #fff3;
		border-radius: 45vw;
		width: 45vw;
		height: 45vw;
		position: absolute;
		bottom: 6vw;
		right: -15vw;
	}

	.lp-circle-c-3 {
		z-index: 1;
		background-color: #fff3;
		border-radius: 45vw;
		width: 30vw;
		height: 30vw;
		position: absolute;
		bottom: -15vw;
		right: -7vw;
	}

	.cs-pre-head {
		grid-column-gap: 16px;
		grid-row-gap: 16px;
		align-items: center;
		margin-bottom: 16px;
		font-size: 1.5rem;
		display: flex;
	}

	.cs-lp-divider {
		background-color: var(--light-grey);
		width: 1px;
		height: 64px;
	}

	.cs-lp-logo {
		max-height: 60px;
	}

	.cs-lp-arrow-a {
		width: 304px;
		position: absolute;
		bottom: 0;
		left: auto;
		right: -10%;
	}

	.cs-lp-numbers {
		grid-column-gap: 40px;
		grid-row-gap: 40px;
		justify-content: space-between;
		display: flex;
	}

	.cs-lp-number {
		margin-top: 0;
		margin-bottom: 1.25rem;
		font-size: 3.75rem;
	}

	.cs-lp-number-block {
		flex: none;
		width: 30%;
		font-size: 1.125rem;
	}

	.cs-lp-flex {
		justify-content: flex-end;
		display: flex;
	}

	.section-bg-wrap {
		position: absolute;
		inset: 0%;
		overflow: hidden;
	}

	.section-bg-wrap.overflow-visible {
		overflow: visible;
	}

	.section-bg-wrap.is--advertising {
		background-color: #fff;
		background-image: linear-gradient(#fff, #f1f3fb);
	}

	.cs-lp-img-left-wrap {
		justify-content: flex-end;
		align-items: center;
		width: 45%;
		display: flex;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}

	.cs-lp-challange {
		flex: 1;
		max-width: 48%;
	}

	.cs-lp-h3 {
		margin-top: 0;
		font-size: 1.5625rem;
	}

	.cs-lp-txt {
		margin-top: 1rem;
		margin-bottom: 2.5rem;
	}

	.cs-lp-txt p {
		line-height: 1.6rem;
	}

	.academy-h1 {
		margin-top: 0;
		margin-bottom: 16px;
		font-size: 30px;
		line-height: 38px;
	}

	.academy-h1.font-weight-bold {
		font-weight: 700;
	}

	.cs-lp-arrow-b {
		position: absolute;
		top: 40%;
		left: -10%;
	}

	.cs-lp-img-left {
		object-fit: cover;
		width: 100%;
		max-width: 750px;
		max-height: 400px;
	}
	.cs-lp-img-fg {
		max-width: 50%;
		position: absolute;
		inset: 10% -10% auto auto;
		box-shadow: 0 2px 30px #0000001a;
	}

	.cs-lp-arrow-c {
		width: 304px;
		position: absolute;
		bottom: -80px;
		left: 20%;
		right: auto;
	}

	.poi-page-tabs-pane-content {
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
		display: flex;
	}

	.border-iframe {
		border: 1px solid var(--gainsboro);
		border-radius: 6px;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}

	.border-iframe.leaderboard {
		background-color: #fff;
		height: 650px;
	}

	.border-iframe.ft-trends {
		height: 616px;
	}
	.poi-page-section-title {
		grid-column-gap: 1rem;
		grid-row-gap: 1rem;
		border-bottom: 1px solid var(--light-grey);
		align-items: center;
		padding-bottom: 0.6rem;
		display: flex;
	}

	.no-margin {
		margin: 0;
	}
	.h1-48 {
		max-width: 640px;
		margin-bottom: 2rem;
		font-size: 3rem;
	}
	.h1-48.solutions-h1 {
		max-width: 600px;
		margin-bottom: 1rem;
	}

	.h1-48.is--restaurant {
		max-width: 621px;
		margin-bottom: 1rem;
	}

	.flex-h-start-center {
		flex-flow: row;
		justify-content: flex-start;
		align-items: center;
		display: flex;
	}

	.flex-h-start-center.gap-24px {
		grid-column-gap: 24px;
		grid-row-gap: 24px;
	}

	.flex-h-start-center.gap-24px.flex-wrap-down,
	.flex-h-start-center.gap-24px.flex-stack {
		flex-flow: wrap;
	}

	.flex-h-start-center.gap-0-3rem {
		grid-column-gap: 0.3rem;
		grid-row-gap: 0.3rem;
	}

	.flex-h-start-center.gap-8px {
		grid-column-gap: 8px;
		grid-row-gap: 8px;
	}

	.flex-h-start-center.gap-x-2-5rem {
		grid-column-gap: 2.5rem;
	}

	.flex-h-start-center.gap-12px {
		grid-column-gap: 12px;
		grid-row-gap: 12px;
	}

	.flex-h-start-center.gap-6px {
		grid-column-gap: 0.375rem;
		grid-row-gap: 0.375rem;
	}
	.flex-h-start-center.gap-x-6px {
		grid-column-gap: 6px;
	}
	.floating-data._1 {
		will-change: transform;
		transform: translate3d(0px, 30%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg)
			skew(0deg, 0deg);
		transform-style: preserve-3d;
	}

	.floating-data._2 {
		will-change: transform;
		transform: translate3d(0px, 80%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg)
			skew(0deg, 0deg);
		transform-style: preserve-3d;
	}

	.floating-data._3 {
		will-change: transform;
		transform: translate3d(0px, 60%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg)
			skew(0deg, 0deg);
		transform-style: preserve-3d;
	}
	.floating-data {
		transition: transform 0.8s ease-in-out;
	}

	.font-size-1-875rem.text-center.margin-bottom-2-5rem.margin-top-8-125rem.data-heading {
		margin-top: 250px;
	}
	.data-step-1 {
		top: -100px;
	}
	.data-step-3 {
		top: -20px;
	}

	#w-node-_6555176d-d5e1-a173-c37b-efdaf9c786f2-faea5da4,
	#w-node-_6555176d-d5e1-a173-c37b-efdaf9c78747-faea5da4,
	#w-node-d6e1df3a-be79-c819-653c-96ff99579666-faea5da4 {
		grid-area: span 1 / span 1 / span 1 / span 1;
	}

	/* ======================= */
	@media screen and (max-width: 991px) {
		.flex-h-center-start.position-relative.mobile-margin {
			margin-bottom: 5%;
		}
		.data-step-1 {
			flex-direction: column;
		}
		.margin-right-1rem.mobile-width {
			width: 140px;
		}
		.data-floating-text {
			position: static;
		}
		.margin-right-1rem.mobile-width {
			width: 140px;
		}
		.margin-right-1rem.mobile-width {
			width: 160px;
			margin-right: 2rem;
		}
		.font-size-1-875rem.text-center.margin-bottom-2-5rem.margin-top-8-125rem.mobile {
			font-size: 1.5rem;
		}
		.font-size-1-875rem.text-center.margin-bottom-2-5rem.margin-top-8-125rem.mobile {
			border-bottom: 1px solid var(--light-grey);
			text-align: center;
			margin-top: 7.125rem;
		}
		.position-relative.width-100.flex-v-center-start.mobile-margin {
			margin-bottom: 5%;
		}
		.data-step-2 {
			flex-direction: column;
			display: flex;
			top: -145px;
		}
		.dotted-data-line {
			display: none;
		}
		.font-size-1-5rem.text-bold.text-line-height-1-5.mobile-line-height {
			line-height: 1.3;
		}
		.flex-v-start-center.mobile-last {
			order: 1;
		}
		.data-dashed-wrapper {
			background-image: none;
			background-repeat: repeat;
			background-size: auto;
			padding-left: 0%;
		}
		.diagram-lines.absolute,
		.diagram-lines.margin-bottom,
		.diagram-lines.last {
			display: none;
		}
		.data-step-3 {
			flex-direction: column;
		}
		.width-50.flex-h-center-start.padding-right.mobile {
			flex-direction: column;
			width: 100%;
			margin-bottom: 5%;
		}
		.height-30vh.margin-bottom-1rem.margin-right-2-5rem {
			margin-right: 0;
		}
		.font-size-1-5rem.text-bold.text-line-height-1-5.mobile-line-height {
			line-height: 1.3;
		}
		.flex-h-center-start.link-semi-bold {
			font-size: 0.875rem;
		}
		.width-50.flex-h-center-start.tablet-width-100,
		.width-50.mobile,
		.width-50.responsive {
			width: 100%;
		}
		.margin-bottom-1-5rem {
			margin-bottom: 1rem;
		}
		.height-25vh.margin-right-2-5rem.mobile {
			min-width: 40%;
		}
		.font-size-1-5rem.text-bold.text-line-height-1-5.mobile-line-height {
			line-height: 1.3;
		}
		.section {
			padding: 4rem 1rem 3rem;
		}
		.height-25vh.margin-right-2-5rem.mobile {
			margin-right: 1.5rem;
		}

		.data-step-3 {
			top: -118px;
		}
		.font-size-1-875rem.text-center.margin-bottom-2-5rem.margin-top-8-125rem.data-heading {
			margin-top: 187px;
		}
		.font-size-1-875rem.text-center.margin-bottom-2-5rem.margin-top-8-125rem.mobile.seamless.mobile {
			margin-top: 0;
		}
	}
</style>
