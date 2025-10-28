export function intersection(node, options = { threshold: 0.1 }) {
	const observer = new IntersectionObserver(([entry]) => {
		if (entry.isIntersecting) {
			node.dispatchEvent(new CustomEvent('enter'));
		} else {
			node.dispatchEvent(new CustomEvent('leave'));
		}
	}, options);

	observer.observe(node);

	return {
		destroy() {
			observer.unobserve(node);
		}
	};
}
