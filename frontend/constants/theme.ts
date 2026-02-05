const tintColourLight = '#4A90E2';
const tintColourDark = '#80CFFF';

export const Theme = {
	light: {
		text: '#1A1A1A',
		textSecondary: '#757575',
		background: '#F5F5F5',
		backgroundSecondary: '#FFF',
		backgroundTertiary: 'rgba(26, 26, 26, 0.3)',

		active: '#E0E0E0',
		accent: tintColourLight,
		warning: '#D32F2F',
		icon: '#757575',

		tabIconDefault: '#9AA0A6',
		tabIconSelected: tintColourLight,

		standardDeviationColour: 'rgba(74, 144, 226, 0.2)',
		meanColour: '#43A047',
		interventionColour: 'rgba(74, 144, 226, 0.15)',
	},
	dark: {
		text: '#E8EAED',
		textSecondary: '#999999',
		background: '#131313',
		backgroundSecondary: '#212121',
		backgroundTertiary: '#616161',

		accent: tintColourDark,
		active: '#424242',
		warning: '#EF5350',
		icon: '#9E9E9E',

		tabIconDefault: '#9E9E9E',
		tabIconSelected: tintColourDark,

		meanColour: '#66BB6A',
		standardDeviationColour: 'rgba(107, 163, 216, 0.25)',
		interventionColour: 'rgba(107, 163, 216, 0.2)',
	},
};

export const Fonts = {
	sans: 'Inter_400Regular',
	sansMedium: 'Inter_500Medium',
	sansSemiBold: 'Inter_600SemiBold',
	sansBold: 'Inter_700Bold'
};