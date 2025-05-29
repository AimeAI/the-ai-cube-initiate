
import type { Config } from "tailwindcss";
import { MythTechTheme } from "./src/styles/theme"; // Import the theme

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				heading: [MythTechTheme.fonts.display, 'sans-serif'],
				body: ["'Inter'", 'sans-serif'], // Assuming Inter remains for body, or replace with MythTechTheme.fonts.mono or display
				orbitron: [MythTechTheme.fonts.display, 'sans-serif'],
				mono: [MythTechTheme.fonts.mono, 'monospace'],
			},
			colors: {
				// MythTechTheme colors
				myth: MythTechTheme.colors,
				// Original colors - decide if these are still needed or should be mapped/removed
				// For now, we keep them to avoid breaking existing styles, but they should be phased out.
				electricCyan: '#00FFFF',
				deepViolet: '#301934',
				neonMint: '#39FF14',
				obsidianBlack: '#0D0D0D',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: { // Note: MythTechTheme also has a 'secondary'
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: { // Note: MythTechTheme also has an 'accent'
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				cube: {
					dark: '#000000',
					blue: '#0EA5E9',
					violet: '#8B5CF6',
					gold: '#F97316',
				}
			},
			spacing: {
        		base: MythTechTheme.spacing.base,
      		},
			boxShadow: {
			     		glow: MythTechTheme.colors.glow,
			   		},
      		borderRadius: {
      			lg: 'var(--radius)',
      			md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'cube-rotate': {
					'0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
					'100%': { transform: 'rotateX(360deg) rotateY(360deg)' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				'glow-pulse': {
					'0%, 100%': { opacity: '0.7', boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)' },
					'50%': { opacity: '1', boxShadow: '0 0 30px rgba(14, 165, 233, 0.8)' },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fragment-orbit': {
					'0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
					'100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' }
				},
				'nav-fade-in': {
					'0%': { opacity: '0', transform: 'translateY(-10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'cube-rotate': 'cube-rotate 20s linear infinite',
				'float': 'float 6s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
				'fade-in': 'fade-in 0.8s ease-out forwards',
				'fragment-orbit': 'fragment-orbit 15s linear infinite',
				'nav-fade-in': 'nav-fade-in 0.5s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
