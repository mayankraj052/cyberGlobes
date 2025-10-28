import { writable } from 'svelte/store';

const storedTheme =
	typeof window !== 'undefined' ? localStorage.getItem('theme') || 'system' : 'system';
export const theme = writable(storedTheme);

if (typeof window !== 'undefined') {
	// Apply the theme immediately to avoid flash of light mode
	if (
		storedTheme === 'dark' ||
		(storedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
	) {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}

	theme.subscribe((value) => {
		localStorage.setItem('theme', value);
		if (
			value === 'dark' ||
			(value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	});

	// Listen for changes to the system preference
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
		if (storedTheme === 'system') {
			if (e.matches) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	});
}

export function toggleTheme() {
	theme.update((value) => {
		if (value === 'light') return 'dark';
		if (value === 'dark') return 'system';
		return 'light';
	});
}
