const tintColourLight = "#6FB6E9";
const tintColourDark = "#6FB6E9";

export const Theme = {
	light: {
		text: "#1C1B1F",
		textSecondary: "#49454F",
		background: "#FAFAFA",
		backgroundSecondary: "#F5F4F7",
		backgroundTertiary: "#EDECF0",
		active: "#E7E6EA",
		accent: tintColourLight,
		warning: "#BA1A1A",
		icon: "#49454F",
		tabIconDefault: "#79747E",
		tabIconSelected: tintColourLight,
		meanColour: "#43A047",
		standardDeviationColour: "rgba(100, 149, 237, 0.25)",
		interventionColour: "rgba(74, 144, 226, 0.15)"
	},

	dark: {
		text: "#E6E1E5",
		textSecondary: "#CAC4D0",
		background: "#121212",
		backgroundSecondary: "#1E1D21",
		backgroundTertiary: "#28272B",
		accent: tintColourDark,
		active: "#28272B",
		warning: "#F2B8B5",
		icon: "#CAC4D0",
		tabIconDefault: "#938F99",
		tabIconSelected: tintColourDark,
		meanColour: "#66BB6A",
		standardDeviationColour: "rgba(135, 179, 245, 0.35)",
		interventionColour: "rgba(107, 163, 216, 0.2)"
	},
};

export const Fonts = {
	sans: "Inter_400Regular",
	sansMedium: "Inter_500Medium",
	sansSemiBold: "Inter_600SemiBold",
	sansBold: "Inter_700Bold"
};