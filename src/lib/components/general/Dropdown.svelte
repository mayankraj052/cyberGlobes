<script>
	import { onMount } from 'svelte';

	export let el;

	function getParents(el, selector, filter) {
		let parentSelector = selector === undefined ? document : document.querySelector(selector);
		let parents = [];
		let pNode = el.parentNode;

		while (pNode !== parentSelector) {
			let element = pNode;

			if (filter === undefined) {
				parents.push(element);
			} else {
				element.classList.contains(filter) && parents.push(element);
			}
			pNode = element.parentNode;
		}

		return parents;
	}

	function isRTL() {
		return document.documentElement.getAttribute('dir') === 'rtl';
	}

	onMount(() => {
		const elm = document.querySelectorAll('.dropdown-toggle');
		elm.forEach((item) => {
			item.addEventListener('click', (e) => {
				e.preventDefault();
				item.classList.toggle('show');
			});

			document.addEventListener('mouseup', (e) => {
				e.preventDefault();
				if (
					item !== e.target &&
					getParents(e.target, undefined, 'clickable').length <= 0 &&
					!e.target.classList.contains('clickable')
				) {
					item.classList.remove('show');
				}
			});
		});
	});
</script>

<div class="dropdown">
	<slot></slot>
</div>

<style>
	.dropdown-menu {
		display: none;
	}
	.dropdown-toggle.show + .dropdown-menu {
		display: block;
	}
</style>
