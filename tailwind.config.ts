
import type { Config } from "tailwindcss";

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
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'monospace'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
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
        accent: {
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
        }
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
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        'blur-in': {
          '0%': {
            opacity: '0',
            filter: 'blur(10px)'
          },
          '100%': {
            opacity: '1',
            filter: 'blur(0)'
          }
        },
        'slide-in-right': {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        'slide-in-left': {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        'floating': {
          '0%': {
            transform: 'translate(0, 0)'
          },
          '50%': {
            transform: 'translate(0, -10px)'
          },
          '100%': {
            transform: 'translate(0, 0)'
          }
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
          },
          '50%': {
            opacity: '0.7',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)'
          }
        },
        'holographic-shift': {
          '0%': {
            filter: 'hue-rotate(0deg) saturate(1)'
          },
          '50%': {
            filter: 'hue-rotate(30deg) saturate(1.2)'
          },
          '100%': {
            filter: 'hue-rotate(0deg) saturate(1)'
          }
        },
        'glitch': {
          '0%, 100%': {
            transform: 'translate(0)'
          },
          '20%': {
            transform: 'translate(-5px, 5px)'
          },
          '40%': {
            transform: 'translate(-5px, -5px)'
          },
          '60%': {
            transform: 'translate(5px, 5px)'
          },
          '80%': {
            transform: 'translate(5px, -5px)'
          }
        },
        'hacker-text': {
          '0%': {
            textShadow: '0 0 5px #3B82F6, 0 0 10px #3B82F6'
          },
          '50%': {
            textShadow: '0 0 10px #3B82F6, 0 0 20px #3B82F6'
          },
          '100%': {
            textShadow: '0 0 5px #3B82F6, 0 0 10px #3B82F6'
          }
        },
        'cyber-scan': {
          '0%': {
            backgroundPosition: '0% 0%'
          },
          '100%': {
            backgroundPosition: '0% 100%'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'blur-in': 'blur-in 0.8s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'floating': 'floating 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'holographic': 'holographic-shift 3s ease-in-out infinite',
        'glitch': 'glitch 0.5s ease-in-out infinite',
        'hacker-text': 'hacker-text 2s ease-in-out infinite',
        'cyber-scan': 'cyber-scan 2s linear infinite'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
