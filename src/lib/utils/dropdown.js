/**
 * Get all parents of an element.
 *
 * @param {HTMLElement} el The element to get the parents of
 * @param {string} selector The parent selector
 * @param {string} filter The parent filter
 *
 * @returns {HTMLElement[]} The parent elements
 */
export function getParents(el, selector, filter) {
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

/**
 * Initialize dropdown.
 *
 * @returns {void}
 */
export function initDropdown() {
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
}
