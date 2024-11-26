import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default {
    content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    sm: '3rem',
                    lg: '5rem',
                    xl: '9rem',
                    '2xl': '16rem',
                },
            },
            colors: {
                appBackground: colors.gray[50],
                appBackgroundDark: colors.gray[800],
                appAccent: colors.blue[500],
                appTextStrong: colors.gray[900],
                appTextNormal: colors.gray[700],
                appTextWeak: colors.gray[500],
                appTextStrongDark: colors.gray[50],
                appTextNormalDark: colors.gray[100],
                appTextWeakDark: colors.gray[300],
                appRowDivider: colors.gray[100],
            },
            fontFamily: {
                sans: [
                    'Inter',
                    'ui-sans-serif',
                    'system-ui',
                    'sans-serif',
                    'Apple Color Emoji',
                    'Segoe UI Emoji',
                    'Segoe UI Symbol',
                    'Noto Color Emoji',
                ],
            },
        },
    },
    plugins: [],
} satisfies Config
