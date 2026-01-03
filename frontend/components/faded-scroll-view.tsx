import { StyleSheet, ScrollView, ScrollViewProps, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

interface FadedScrollViewProps extends ScrollViewProps {
	children: React.ReactNode;
	showGradient?: boolean;
}

export function FadedScrollView({ children, style, contentContainerStyle, showGradient = true, ...props }: FadedScrollViewProps) {
	const colorScheme = useColorScheme() ?? 'light';
	const backgroundColor = Colors[colorScheme].background;
	const shadowColor = colorScheme === 'light' ? 'rgba(255, 255, 255, 0)' : 'rgba(21, 23, 24, 0)';

	return (
		<View style={[styles.container, style]}>
			<ScrollView 
				style={styles.scrollView}
				contentContainerStyle={[styles.scrollContent, contentContainerStyle]} 
				showsVerticalScrollIndicator={false}
				{...props}>
				{children}
			</ScrollView>
			{showGradient && (
				<LinearGradient
					colors={[backgroundColor, shadowColor]}
					style={styles.fadeGradient}
					pointerEvents="none"
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative',
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingTop: 12,
		paddingBottom: 20,
	},
	fadeGradient: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 4,
		zIndex: 1,
	},
});
