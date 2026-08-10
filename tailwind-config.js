try {
    tailwind.config = {
        darkMode: "class",
        theme: {
            extend: {
                "colors": {
                    "primary": "#17223B",
                    "primary-dark": "#020B24",
                    "brand-gold": "#B9862F",
                    "brand-gold-dark": "#805600",
                    "background": "#EAEDE2",
                    "surface": "#FBFAF5",
                    "on-surface": "#1B1B1D",
                    "on-surface-variant": "#45464D",
                    "outline-variant": "#C6C6CE",
                    "role-student": "#B9862F",
                    "role-teacher": "#17223B",
                    "role-parent": "#45464D",
                    "error": "#ba1a1a"
                },
                "fontFamily": {
                    "serif": ["'Source Serif 4'", "serif"],
                    "sans": ["'Libre Franklin'", "sans-serif"],
                    "mono": ["'JetBrains Mono'", "monospace"],
                    "display-lg": ["'Source Serif 4'", "serif"],
                    "headline-md": ["'Source Serif 4'", "serif"],
                    "body-md": ["'Libre Franklin'", "sans-serif"],
                    "label-caps": ["'Libre Franklin'", "sans-serif"],
                    "stats-lg": ["'JetBrains Mono'", "monospace"],
                    "stats-sm": ["'JetBrains Mono'", "monospace"]
                },
                "boxShadow": {
                    "hard": "4px 4px 0px 0px rgba(23, 34, 59, 1)",
                    "premium": "0 10px 30px -10px rgba(23, 34, 59, 0.1)",
                    "hover-lift": "0 20px 40px -15px rgba(23, 34, 59, 0.15)"
                },
                "keyframes": {
                    "fade-in-up": {
                        "0%": { opacity: 0, transform: "translateY(20px)" },
                        "100%": { opacity: 1, transform: "translateY(0)" }
                    },
                    "pulse-soft": {
                        "0%, 100%": { transform: "scale(1)", opacity: 1 },
                        "50%": { transform: "scale(1.05)", opacity: 0.8 }
                    },
                    "float": {
                        "0%, 100%": { transform: "translateY(0)" },
                        "50%": { transform: "translateY(-10px)" }
                    },
                    "slide-right": {
                        "0%": { opacity: 0, transform: "translateX(-15px)" },
                        "100%": { opacity: 1, transform: "translateX(0)" }
                    }
                },
                "animation": {
                    "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
                    "pulse-soft": "pulse-soft 2s infinite ease-in-out",
                    "float": "float 4s infinite ease-in-out",
                    "slide-right": "slide-right 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards"
                }
            }
        }
    }
} catch (_e) { }
