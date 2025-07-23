import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import flowbitePlugin from 'flowbite/plugin';

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	darkMode: 'selector',
	theme: {
		extend: {
			colors: {
				// flowbite-svelte
				primary: {
					50: '#F0F7FF',
					100: '#E0F0FF',
					200: '#C0E0FF',
					300: '#90C8FF',
					400: '#5AA3FF',
					500: '#0066CC',
					600: '#0052B3',
					700: '#003D99',
					800: '#002966',
					900: '#001433'
				}
			}
		}
	},
	plugins: [forms, flowbitePlugin]
} as Config;
