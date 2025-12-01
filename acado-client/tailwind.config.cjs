/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */

module.exports = {
	mode: 'jit',
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		'./safelist.txt'
	],
	darkMode: ['class'],
	theme: {
		fontFamily: {
			sans: [
				'Inter',
				'ui-sans-serif',
				'system-ui',
				'-apple-system',
				'BlinkMacSystemFont',
				'Segoe UI',
				'Roboto',
				'Helvetica Neue',
				'Arial',
				'Noto Sans',
				'sans-serif',
				'Apple Color Emoji',
				'Segoe UI Emoji',
				'Segoe UI Symbol',
				'Noto Color Emoji'
			],
			serif: [
				'ui-serif',
				'Georgia',
				'Cambria',
				'Times New Roman"',
				'Times',
				'serif'
			],
			mono: [
				'ui-monospace',
				'SFMono-Regular',
				'Menlo',
				'Monaco',
				'Consolas',
				'Liberation Mono"',
				'Courier New"',
				'monospace'
			]
		},
		screens: {
			xs: '576px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px'
		},
		extend: {
			colors: {
				dark: '#0b0b0b',
				light: '#FFFFFF',
				darkPrimary: '#BCF035',
				lightPrimary: '#7C57FC',
				textDark: '#FFFFFF',
				textLight: '#1D1D1D',
				textHover: '#7C57FC',
				primary: {
					DEFAULT: 'var(--primary)',
					foreground: 'var(--primary-foreground)'
				},
				'primary-deep': 'var(--primary-deep)',
				'primary-mild': 'var(--primary-mild)',
				'primary-subtle': 'var(--primary-subtle)',
				error: 'var(--error)',
				'error-subtle': 'var(--error-subtle)',
				success: 'var(--success)',
				'success-subtle': 'var(--success-subtle)',
				info: 'var(--info)',
				'info-subtle': 'var(--info-subtle)',
				warning: 'var(--warning)',
				'warning-subtle': 'var(--warning-subtle)',
				neutral: 'var(--neutral)',
				'gray-50': 'var(--gray-50)',
				'gray-100': 'var(--gray-100)',
				'gray-200': 'var(--gray-200)',
				'gray-300': 'var(--gray-300)',
				'gray-400': 'var(--gray-400)',
				'gray-500': 'var(--gray-500)',
				'gray-600': 'var(--gray-600)',
				'gray-700': 'var(--gray-700)',
				'gray-800': 'var(--gray-800)',
				'gray-900': 'var(--gray-900)',
				'gray-950': 'var(--gray-950)',
				'ac-dark': 'var(--ac-dark)',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						color: theme('colors.gray.500'),
						maxWidth: '65ch',
						fontFamily: theme('fontFamily.sans').join(', '),
					},
				},
				invert: {
					css: {
						color: theme('colors.gray.400'),
					},
				},
			}),
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
		require("tailwindcss-animate")
	],
};
