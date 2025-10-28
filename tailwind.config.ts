import { fontFamily } from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: [
		'dark',
		// LayerChart tooltip classes
		'bg-surface-100/90',
		'dark:bg-surface-300/90',
		'text-surface-content',
		'bg-surface-100',
		'bg-surface-200', 
		'bg-surface-300',
		'text-surface-content/75',
		// Surface color variants with opacity
		{
			pattern: /bg-surface-(100|200|300)\/(10|20|30|40|50|60|70|80|90|95)/
		},
		{
			pattern: /text-surface-content\/(25|50|75)/
		}
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			zIndex: {
				100: '100'
			},
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
					50: 'hsl(var(--primary-50) / <alpha-value>)',
					100: 'hsl(var(--primary-100) / <alpha-value>)',
					200: 'hsl(var(--primary-200) / <alpha-value>)',
					300: 'hsl(var(--primary-300) / <alpha-value>)',
					400: 'hsl(var(--primary-400) / <alpha-value>)',
					500: 'hsl(var(--primary-500) / <alpha-value>)',
					600: 'hsl(var(--primary-600) / <alpha-value>)',
					700: 'hsl(var(--primary-700) / <alpha-value>)',
					800: 'hsl(var(--primary-800) / <alpha-value>)',
					900: 'hsl(var(--primary-900) / <alpha-value>)',
					950: 'hsl(var(--primary-950) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
					50: 'hsl(var(--secondary-50) / <alpha-value>)',
					100: 'hsl(var(--secondary-100) / <alpha-value>)',
					200: 'hsl(var(--secondary-200) / <alpha-value>)',
					300: 'hsl(var(--secondary-300) / <alpha-value>)',
					400: 'hsl(var(--secondary-400) / <alpha-value>)',
					500: 'hsl(var(--secondary-500) / <alpha-value>)',
					600: 'hsl(var(--secondary-600) / <alpha-value>)',
					700: 'hsl(var(--secondary-700) / <alpha-value>)',
					800: 'hsl(var(--secondary-800) / <alpha-value>)',
					900: 'hsl(var(--secondary-900) / <alpha-value>)',
					950: 'hsl(var(--secondary-950) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
					50: 'hsl(var(--destructive-50) / <alpha-value>)',
					100: 'hsl(var(--destructive-100) / <alpha-value>)',
					200: 'hsl(var(--destructive-200) / <alpha-value>)',
					300: 'hsl(var(--destructive-300) / <alpha-value>)',
					400: 'hsl(var(--destructive-400) / <alpha-value>)',
					500: 'hsl(var(--destructive-500) / <alpha-value>)',
					600: 'hsl(var(--destructive-600) / <alpha-value>)',
					700: 'hsl(var(--destructive-700) / <alpha-value>)',
					800: 'hsl(var(--destructive-800) / <alpha-value>)',
					900: 'hsl(var(--destructive-900) / <alpha-value>)',
					950: 'hsl(var(--destructive-950) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
					50: 'hsl(var(--muted-50) / <alpha-value>)',
					100: 'hsl(var(--muted-100) / <alpha-value>)',
					200: 'hsl(var(--muted-200) / <alpha-value>)',
					300: 'hsl(var(--muted-300) / <alpha-value>)',
					400: 'hsl(var(--muted-400) / <alpha-value>)',
					500: 'hsl(var(--muted-500) / <alpha-value>)',
					600: 'hsl(var(--muted-600) / <alpha-value>)',
					700: 'hsl(var(--muted-700) / <alpha-value>)',
					800: 'hsl(var(--muted-800) / <alpha-value>)',
					900: 'hsl(var(--muted-900) / <alpha-value>)',
					950: 'hsl(var(--muted-950) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
					50: 'hsl(var(--accent-50) / <alpha-value>)',
					100: 'hsl(var(--accent-100) / <alpha-value>)',
					200: 'hsl(var(--accent-200) / <alpha-value>)',
					300: 'hsl(var(--accent-300) / <alpha-value>)',
					400: 'hsl(var(--accent-400) / <alpha-value>)',
					500: 'hsl(var(--accent-500) / <alpha-value>)',
					600: 'hsl(var(--accent-600) / <alpha-value>)',
					700: 'hsl(var(--accent-700) / <alpha-value>)',
					800: 'hsl(var(--accent-800) / <alpha-value>)',
					900: 'hsl(var(--accent-900) / <alpha-value>)',
					950: 'hsl(var(--accent-950) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
					50: 'hsl(var(--popover-50) / <alpha-value>)',
					100: 'hsl(var(--popover-100) / <alpha-value>)',
					200: 'hsl(var(--popover-200) / <alpha-value>)',
					300: 'hsl(var(--popover-300) / <alpha-value>)',
					400: 'hsl(var(--popover-400) / <alpha-value>)',
					500: 'hsl(var(--popover-500) / <alpha-value>)',
					600: 'hsl(var(--popover-600) / <alpha-value>)',
					700: 'hsl(var(--popover-700) / <alpha-value>)',
					800: 'hsl(var(--popover-800) / <alpha-value>)',
					900: 'hsl(var(--popover-900) / <alpha-value>)',
					950: 'hsl(var(--popover-950) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
					50: 'hsl(var(--card-50) / <alpha-value>)',
					100: 'hsl(var(--card-100) / <alpha-value>)',
					200: 'hsl(var(--card-200) / <alpha-value>)',
					300: 'hsl(var(--card-300) / <alpha-value>)',
					400: 'hsl(var(--card-400) / <alpha-value>)',
					500: 'hsl(var(--card-500) / <alpha-value>)',
					600: 'hsl(var(--card-600) / <alpha-value>)',
					700: 'hsl(var(--card-700) / <alpha-value>)',
					800: 'hsl(var(--card-800) / <alpha-value>)',
					900: 'hsl(var(--card-900) / <alpha-value>)',
					950: 'hsl(var(--card-950) / <alpha-value>)'
				},
				'surface-100': 'hsl(var(--color-surface-100) / <alpha-value>)',
				'surface-200': 'hsl(var(--color-surface-200) / <alpha-value>)',
				'surface-300': 'hsl(var(--color-surface-300) / <alpha-value>)',
				'surface-content': 'hsl(var(--color-surface-content) / <alpha-value>)',
				'color-primary': 'hsl(var(--color-primary) / <alpha-value>)',
				'color-secondary': 'hsl(var(--color-secondary) / <alpha-value>)',
				'color-success': 'hsl(var(--color-success) / <alpha-value>)',
				'color-danger': 'hsl(var(--color-danger) / <alpha-value>)',
				'color-warning': 'hsl(var(--color-warning) / <alpha-value>)',
				'color-info': 'hsl(var(--color-info) / <alpha-value>)',
				transparent: 'transparent',
				// Additional transparent variations
				'transparent-50': 'rgba(255, 255, 255, 0.05)',
				'transparent-100': 'rgba(255, 255, 255, 0.1)',
				'transparent-200': 'rgba(255, 255, 255, 0.2)',
				'transparent-300': 'rgba(255, 255, 255, 0.3)',
				'transparent-white-50': 'rgba(255, 255, 255, 0.05)',
				'transparent-white-100': 'rgba(255, 255, 255, 0.1)',
				'transparent-white-200': 'rgba(255, 255, 255, 0.2)',
				'transparent-white-300': 'rgba(255, 255, 255, 0.3)',
				success: {
					DEFAULT: 'hsl(var(--color-success) / <alpha-value>)',
					50: 'hsl(142 69% 95%)',
					100: 'hsl(142 69% 90%)',
					200: 'hsl(142 69% 80%)',
					300: 'hsl(142 69% 70%)',
					400: 'hsl(142 69% 65%)',
					500: 'hsl(var(--color-success) / <alpha-value>)',
					600: 'hsl(142 69% 50%)',
					700: 'hsl(142 69% 42%)',
					800: 'hsl(142 69% 35%)',
					900: 'hsl(142 69% 28%)',
					950: 'hsl(142 69% 20%)'
				},
				danger: {
					DEFAULT: 'hsl(var(--color-danger) / <alpha-value>)',
					50: 'hsl(0 84% 97%)',
					100: 'hsl(0 84% 94%)',
					200: 'hsl(0 84% 87%)',
					300: 'hsl(0 84% 78%)',
					400: 'hsl(0 84% 69%)',
					500: 'hsl(var(--color-danger) / <alpha-value>)',
					600: 'hsl(0 84% 51%)',
					700: 'hsl(0 84% 42%)',
					800: 'hsl(0 84% 35%)',
					900: 'hsl(0 84% 28%)',
					950: 'hsl(0 84% 18%)'
				},
				warning: {
					DEFAULT: 'hsl(var(--color-warning) / <alpha-value>)',
					50: 'hsl(43 96% 97%)',
					100: 'hsl(43 96% 93%)',
					200: 'hsl(43 96% 86%)',
					300: 'hsl(43 96% 78%)',
					400: 'hsl(43 96% 67%)',
					500: 'hsl(var(--color-warning) / <alpha-value>)',
					600: 'hsl(43 96% 45%)',
					700: 'hsl(43 96% 36%)',
					800: 'hsl(43 96% 29%)',
					900: 'hsl(43 96% 24%)',
					950: 'hsl(43 96% 13%)'
				},
				info: {
					DEFAULT: 'hsl(var(--color-info) / <alpha-value>)',
					50: 'hsl(212 100% 97%)',
					100: 'hsl(212 100% 94%)',
					200: 'hsl(212 100% 87%)',
					300: 'hsl(212 100% 78%)',
					400: 'hsl(212 100% 74%)',
					500: 'hsl(var(--color-info) / <alpha-value>)',
					600: 'hsl(212 100% 63%)',
					700: 'hsl(212 100% 56%)',
					800: 'hsl(212 100% 46%)',
					900: 'hsl(212 100% 39%)',
					950: 'hsl(212 100% 24%)'
				},
				indigo: {
					DEFAULT: 'hsl(var(--color-secondary) / <alpha-value>)',
					50: 'hsl(238 75% 97%)',
					100: 'hsl(238 75% 94%)',
					200: 'hsl(238 75% 87%)',
					300: 'hsl(238 75% 78%)',
					400: 'hsl(238 75% 71%)',
					500: 'hsl(var(--color-secondary) / <alpha-value>)',
					600: 'hsl(238 75% 58%)',
					700: 'hsl(238 75% 52%)',
					800: 'hsl(238 75% 43%)',
					900: 'hsl(238 75% 36%)',
					950: 'hsl(238 75% 23%)'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: [...fontFamily.sans]
			}
		}
	}
};

export default config;
