// Theme colors from App.css
export const THEME_COLORS = {
  light: {
    bgPrimary: '#ffffff',
    bgSecondary: '#f5f5f5',
    bgTertiary: '#e8e8e8',
    textPrimary: '#1a1a1a',
    textSecondary: '#4a4a4a',
    border: '#d4d4d4',
    ratingAgain: '#c73e3e',
    ratingHard: '#d97706',
    ratingGood: '#4271c4',
    ratingEasy: '#3d9156',
  },
  dark: {
    bgPrimary: '#1a1a1a',
    bgSecondary: '#242424',
    bgTertiary: '#2a2a2a',
    bgQuaternary: '#3a3a3a',
    bgButton: '#323232',
    textPrimary: '#ffffff',
    textSecondary: '#a0a0a0',
    border: '#333333',
    ratingAgain: '#d14358',
    ratingHard: '#e88c3a',
    ratingGood: '#5b8fd9',
    ratingEasy: '#52b169',
  },
} as const;

export const RATING_COLORS = {
  'bg-red-600 hover:bg-red-700': {
    bg: THEME_COLORS.light.ratingAgain,
    hover: '#b13636',
    darkBg: THEME_COLORS.dark.ratingAgain,
    darkHover: '#c13a4f',
  },
  'bg-orange-600 hover:bg-orange-700': {
    bg: THEME_COLORS.light.ratingHard,
    hover: '#c26805',
    darkBg: THEME_COLORS.dark.ratingHard,
    darkHover: '#d97d2e',
  },
  'bg-green-600 hover:bg-green-700': {
    bg: THEME_COLORS.light.ratingGood,
    hover: '#3862b5',
    darkBg: THEME_COLORS.dark.ratingGood,
    darkHover: '#4c7ec8',
  },
  'bg-blue-600 hover:bg-blue-700': {
    bg: THEME_COLORS.light.ratingEasy,
    hover: '#35804a',
    darkBg: THEME_COLORS.dark.ratingEasy,
    darkHover: '#47a05d',
  },
} as const;

export const RATING_BUTTONS = [
  { rating: 1, label: 'Again', colorClass: 'bg-red-600 hover:bg-red-700' as const },
  { rating: 2, label: 'Hard', colorClass: 'bg-orange-600 hover:bg-orange-700' as const },
  { rating: 3, label: 'Good', colorClass: 'bg-green-600 hover:bg-green-700' as const },
  { rating: 4, label: 'Easy', colorClass: 'bg-blue-600 hover:bg-blue-700' as const },
];
