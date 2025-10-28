<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import Logo from '../general/Logo.svelte';
	import { slideDown, slideUp } from '$lib/utils/animation';

	let config = {
		win: { height: 0, width: 0 }
	};

	onMount(() => {
		config.win = { height: window.innerHeight, width: window.innerWidth };
	});

	// Menu functions.
	let Menu = {
		load: (elm, subparent) => {
			let parent = elm.parentElement;
			if (!parent.classList.contains(subparent)) {
				parent.classList.add(subparent);
			}
		},
		toggle: (elm, active) => {
			let parent = elm.parentElement;
			let nextelm = elm.nextElementSibling;
			let speed = nextelm.children.length > 5 ? 400 + nextelm.children.length * 10 : 400;
			if (!parent.classList.contains(active)) {
				parent.classList.add(active);
				slideDown(nextelm, speed);
			} else {
				parent.classList.remove(active);
				slideUp(nextelm, speed);
			}
		},
		closeSiblings: (elm, active, subparent, submenu) => {
			let parent = elm.parentElement;
			let siblings = parent.parentElement.children;
			Array.from(siblings).forEach((item) => {
				if (item !== parent) {
					item.classList.remove(active);
					if (item.classList.contains(subparent)) {
						let subitem = item.querySelectorAll(`.${submenu}`);
						subitem.forEach((child) => {
							child.parentElement.classList.remove(active);
							slideUp(child, 400);
						});
					}
				}
			});
		}
	};

	// Sidebar functions.
	let Sidebar = {
		compact: function () {
			let toggle = document.querySelectorAll('.sidebar-compact-toggle');
			let parent = document.querySelector('.serviceapp-sidebar');
			let body = parent && parent.querySelector('.serviceapp-sidebar-body');
			toggle.forEach((item) => {
				item.addEventListener('click', function (e) {
					e.preventDefault();
					item.classList.toggle('compact-active');
					parent.classList.toggle('is-compact');
					if (!parent.classList.contains('is-compact')) {
						parent.classList.remove('has-hover');
					}
				});
			});
			if (body) {
				body.addEventListener('mouseenter', function () {
					if (parent.classList.contains('is-compact')) {
						parent.classList.add('has-hover');
					}
				});
				body.addEventListener('mouseleave', function () {
					if (parent.classList.contains('is-compact')) {
						parent.classList.remove('has-hover');
					}
				});
			}
		},

		toggle: function () {
			let toggle = document.querySelectorAll('.sidebar-toggle');
			let parent = document.querySelector('.serviceapp-sidebar');
			toggle.forEach((item) => {
				item.addEventListener('click', function (e) {
					e.preventDefault();
					item.classList.toggle('active');
					if (parent) {
						parent.classList.toggle('sidebar-visible');
					}
					document.body.classList.toggle('overflow-hidden');
				});
			});
		},

		page_resize: function () {
			let toggle = document.querySelectorAll('.sidebar-toggle');
			let parent = document.querySelector('.serviceapp-sidebar');
			if (config.win.width > config.break.xl) {
				toggle.forEach((item) => {
					item.classList.remove('active');
				});
				if (parent) {
					parent.classList.remove('sidebar-visible');
				}
				document.body.classList.remove('overflow-hidden');
			}
		}
	};

	let classes = {
		menu: {
			main: 'serviceapp-menu',
			item: 'serviceapp-menu-item',
			link: 'serviceapp-menu-link',
			toggle: 'serviceapp-menu-toggle',
			sub: 'serviceapp-menu-sub',
			subparent: 'has-sub',
			active: 'active',
			current: 'current-page'
		}
	};

	onMount(() => {
		// Toggle sub menu visibility.
		const elm = document.querySelectorAll(`.${classes.menu.toggle}`);
		let active = classes.menu.active;
		let subparent = classes.menu.subparent;
		let submenu = classes.menu.sub;
		elm.forEach((item) => {
			Menu.load(item, subparent);
			item.addEventListener('click', function (e) {
				e.preventDefault();
				Menu.toggle(item, active);
				Menu.closeSiblings(item, active, subparent, submenu);
			});
		});

		// Sidebar toggle.
		Sidebar.compact();
		Sidebar.toggle();
		window.addEventListener('resize', function () {
			Sidebar.page_resize();
		});
	});
</script>

<div
	class="serviceapp-sidebar group/sidebar peer dark fixed w-72 [&.is-compact:not(.has-hover)]:w-[74px] min-h-screen max-h-screen overflow-hidden h-full start-0 top-0 z-[1031] transition-[transform,width] duration-300 -translate-x-full rtl:translate-x-full xl:translate-x-0 xl:rtl:translate-x-0 [&.sidebar-visible]:translate-x-0"
>
	<div
		class="flex items-center min-w-full w-72 h-16 border-b border-e bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-900 px-6 py-3 overflow-hidden"
	>
		<div class="-ms-1 me-4">
			<div class="hidden xl:block">
				<a
					href="/"
					class="sidebar-compact-toggle [&>*]:pointer-events-none inline-flex items-center isolate relative h-9 w-9 px-1.5 before:content-[''] before:absolute before:-z-[1] before:h-5 before:w-5 hover:before:h-10 hover:before:w-10 before:rounded-full before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-300 before:-translate-x-1/2 before:-translate-y-1/2 before:top-1/2 before:left-1/2 before:bg-gray-200 dark:before:bg-gray-900"
				>
					<Icon class="text-2xl text-slate-600 dark:text-slate-300" icon="ic:round-menu" />
				</a>
			</div>

			<div class="xl:hidden">
				<a
					href="/"
					class="sidebar-toggle [&>*]:pointer-events-none inline-flex items-center isolate relative h-9 w-9 px-1.5 before:content-[''] before:absolute before:-z-[1] before:h-5 before:w-5 hover:before:h-10 hover:before:w-10 before:rounded-full before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-300 before:-translate-x-1/2 before:-translate-y-1/2 before:top-1/2 before:left-1/2 before:bg-gray-200 dark:before:bg-gray-900"
				>
					<Icon
						class="text-2xl text-slate-600 dark:text-slate-300 rtl:-scale-x-100"
						icon="formkit:arrowleft"
					/>
				</a>
			</div>
		</div>

		<div class="relative flex flex-shrink-0">
			<a
				href="/"
				class="relative inline-block transition-opacity duration-300 h-9 group-[&.is-compact:not(.has-hover)]/sidebar:opacity-0"
			>
				<Logo />
			</a>
		</div>
	</div>
	<div
		class="serviceapp-sidebar-body max-h-full relative overflow-hidden w-full bg-white dark:bg-gray-950 border-e border-gray-200 dark:border-gray-900"
	>
		<div class="flex flex-col w-full h-[calc(100vh-theme(spacing.16))]">
			<div class="h-full pt-4 pb-10">
				<ul class="serviceapp-menu">
					<li
						class="relative first:pt-1 pt-10 pb-2 px-6 before:absolute before:h-px before:w-full before:start-0 before:top-1/2 before:bg-gray-200 dark:before:bg-gray-900 first:before:hidden before:opacity-0 group-[&.is-compact:not(.has-hover)]/sidebar:before:opacity-100"
					>
						<h6
							class="group-[&.is-compact:not(.has-hover)]/sidebar:opacity-0 text-slate-400 dark:text-slate-300 whitespace-nowrap uppercase font-bold text-xs tracking-relaxed leading-tight"
						>
							General
						</h6>
					</li>
					<li
						class="serviceapp-menu-item py-0.5 group/item {$page.url.pathname === '/dashboard'
							? 'active current-page'
							: ''}"
					>
						<a
							href="/dashboard"
							class="serviceapp-menu-link flex relative items-center align-middle py-2.5 ps-6 pe-10 font-heading font-bold tracking-snug group"
						>
							<span
								class="font-normal tracking-normal w-9 inline-flex flex-grow-0 flex-shrink-0 text-slate-400 group-[.active]/item:text-primary-500 group-hover:text-primary-500"
							>
								<Icon
									class="text-2xl leading-none text-current transition-all duration-300"
									icon="lucide:layout-dashboard"
								/>
							</span>
							<span
								class="group-[&.is-compact:not(.has-hover)]/sidebar:opacity-0 flex-grow-1 inline-block whitespace-nowrap transition-all duration-300 text-slate-600 dark:text-slate-500 group-[.active]/item:text-primary-500 group-hover:text-primary-500"
								>Dashboard</span
							>
						</a>
					</li>
					<li
						class="relative first:pt-1 pt-10 pb-2 px-6 before:absolute before:h-px before:w-full before:start-0 before:top-1/2 before:bg-gray-200 dark:before:bg-gray-900 first:before:hidden before:opacity-0 group-[&.is-compact:not(.has-hover)]/sidebar:before:opacity-100"
					>
						<h6
							class="group-[&.is-compact:not(.has-hover)]/sidebar:opacity-0 text-slate-400 dark:text-slate-300 whitespace-nowrap uppercase font-bold text-xs tracking-relaxed leading-tight"
						>
							Services
						</h6>
					</li>
					<li
						class="serviceapp-menu-item py-0.5 group/item {$page.url.pathname === '/my-requests'
							? 'active current-page'
							: ''}"
					>
						<a
							href="/my-requests"
							class="serviceapp-menu-link flex relative items-center align-middle py-2.5 ps-6 pe-10 font-heading font-bold tracking-snug group"
						>
							<span
								class="font-normal tracking-normal w-9 inline-flex flex-grow-0 flex-shrink-0 text-slate-400 group-[.active]/item:text-primary-500 group-hover:text-primary-500"
							>
								<Icon
									class="text-2xl leading-none text-current transition-all duration-300"
									icon="material-symbols:map-search-outline"
								/>
							</span>
							<span
								class="group-[&.is-compact:not(.has-hover)]/sidebar:opacity-0 flex-grow-1 inline-block whitespace-nowrap transition-all duration-300 text-slate-600 dark:text-slate-500 group-[.active]/item:text-primary-500 group-hover:text-primary-500"
								>My Requests</span
							>
						</a>
					</li>

					<li
						class="serviceapp-menu-item py-0.5 group/item {$page.url.pathname === '/contact-support'
							? 'active current-page'
							: ''}"
					>
						<a
							href="/contact-support"
							class="serviceapp-menu-link flex relative items-center align-middle py-2.5 ps-6 pe-10 font-heading font-bold tracking-snug group"
						>
							<span
								class="font-normal tracking-normal w-9 inline-flex flex-grow-0 flex-shrink-0 text-slate-400 group-[.active]/item:text-primary-500 group-hover:text-primary-500"
							>
								<Icon
									class="text-2xl leading-none text-current transition-all duration-300"
									icon="hugeicons:customer-support"
								/>
							</span>
							<span
								class="group-[&.is-compact:not(.has-hover)]/sidebar:opacity-0 flex-grow-1 inline-block whitespace-nowrap transition-all duration-300 text-slate-600 dark:text-slate-500 group-[.active]/item:text-primary-500 group-hover:text-primary-500"
								>Contact Support</span
							>
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>
<!-- sidebar -->
<div
	class="sidebar-toggle fixed inset-0 bg-slate-950 bg-opacity-20 z-[1030] opacity-0 invisible peer-[.sidebar-visible]:opacity-100 peer-[.sidebar-visible]:visible xl:!opacity-0 xl:!invisible"
></div>
