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
			display: [
				'Inter',
				'ui-sans-serif',
				'system-ui',
				'sans-serif'
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
				'Fira Code',
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
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem',
				xl: '2.5rem',
				'2xl': '3rem',
			},
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px',
			},
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
					50: '#EFF6FF',
					100: '#DBEAFE',
					200: '#BFDBFE',
					300: '#93C5FD',
					400: '#60A5FA',
					500: '#3B82F6',
					600: '#2563EB',
					700: '#1D4ED8',
					800: '#1E40AF',
					900: '#1E3A8A',
					950: '#172554',
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
				sm: 'calc(var(--radius) - 4px)',
				xl: '1rem',
				'2xl': '1.5rem',
				'3xl': '2rem',
			},
			boxShadow: {
				'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
				'soft-md': '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
				'soft-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
				'soft-xl': '0 12px 32px 0 rgba(0, 0, 0, 0.14)',
				'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
				'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
				'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
			},
			animation: {
				'fade-in': 'fadeIn 0.3s ease-in-out',
				'fade-out': 'fadeOut 0.3s ease-in-out',
				'slide-in-up': 'slideInUp 0.4s ease-out',
				'slide-in-down': 'slideInDown 0.4s ease-out',
				'slide-in-left': 'slideInLeft 0.4s ease-out',
				'slide-in-right': 'slideInRight 0.4s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',
				'bounce-soft': 'bounceSoft 0.6s ease-in-out',
				'shimmer': 'shimmer 2s linear infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				fadeOut: {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' },
				},
				slideInUp: {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideInDown: {
					'0%': { transform: 'translateY(-20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideInLeft: {
					'0%': { transform: 'translateX(-20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				slideInRight: {
					'0%': { transform: 'translateX(20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				scaleIn: {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				bounceSoft: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				shimmer: {
					'0%': { backgroundPosition: '-1000px 0' },
					'100%': { backgroundPosition: '1000px 0' },
				},
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'100': '25rem',
				'112': '28rem',
				'128': '32rem',
			},
			maxWidth: {
				'8xl': '88rem',
				'9xl': '96rem',
			},
			zIndex: {
				'60': '60',
				'70': '70',
				'80': '80',
				'90': '90',
				'100': '100',
			},
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
		require("tailwindcss-animate")
	],
};
