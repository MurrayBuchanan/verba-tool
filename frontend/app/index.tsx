import { useState } from "react";
import { StyleSheet, Alert, useWindowDimensions, View as PlainView } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText as Text } from "@/components/themed-text";
import { BlockButton as Button } from "@/components/block-button";
import { useAuthentication } from "@/context/SessionContext";
import { LaunchScreen, Theme } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const copyMaxWidth = 340;

export default function Index() {
	const { signIn } = useAuthentication();
	const colorScheme = useColorScheme() ?? "light";
	const launch = LaunchScreen[colorScheme];
	const { width: windowWidth, height: windowHeight } = useWindowDimensions();
	const insets = useSafeAreaInsets();
	const heroImageHeight = Math.max(windowHeight * 0.58, windowWidth * 0.98);
	const backdropCircleSize = Math.max(windowWidth * 1.3, windowHeight * 0.58);
	const captionMuted =
		colorScheme === "light" ? "rgba(73, 69, 79, 0.72)" : "rgba(202, 196, 208, 0.68)";
	const [signInLoading, setSignInLoading] = useState(false);

	const handleSignIn = async () => {
		setSignInLoading(true);
		try {
			await signIn();
		} catch {
			Alert.alert("Login Failed", "Please try again.");
		} finally {
			setSignInLoading(false);
		}
	};

	return (
		<PlainView style={[styles.screen, { backgroundColor: launch.background }]}>
			<PlainView style={[styles.header, { paddingTop: insets.top + 48 }]}>
				<PlainView style={[styles.headerCopy, { maxWidth: copyMaxWidth }]}>
					<Text
						type="title"
						align="center"
						lightColour={Theme.light.text}
						darkColour={Theme.dark.text}
					>
						More Insights
					</Text>
					<PlainView style={styles.headerGap} />
					<Text
						align="center"
						lightColour={Theme.light.textSecondary}
						darkColour={Theme.dark.textSecondary}
					>
						Monitor and understand changes in communication patterns over time in relation to rehabilitation strategies.
					</Text>
				</PlainView>
			</PlainView>

			<PlainView style={styles.bottomRegion}>
				<PlainView
					style={[
						styles.heroBackdropCircle,
						{
							backgroundColor: launch.heroCircle,
							width: backdropCircleSize,
							height: backdropCircleSize,
							borderRadius: backdropCircleSize / 2,
							left: -backdropCircleSize * 0.3,
							bottom: -windowHeight * 0.015,
						},
					]}
				/>
				<Image
					source={require("../assets/images/launch_placeholder.png")}
					style={[
						styles.heroImage,
						{
							width: windowWidth,
							height: heroImageHeight,
							opacity: colorScheme === "dark" ? 0.9 : 1,
						},
					]}
					contentFit="cover"
					contentPosition="bottom"
				/>
				<PlainView
					style={[
						styles.footer,
						{
							paddingBottom: Math.max(14, insets.bottom + 8),
							backgroundColor: launch.footerScrim,
							borderTopColor: launch.footerBorder,
						},
					]}
				>
					<Button
						title="Get Started"
						onPress={handleSignIn}
						loading={signInLoading}
						lightColour={LaunchScreen.light.ctaBackground}
						darkColour={LaunchScreen.dark.ctaBackground}
						style={styles.buttonWrap}
					/>
					<PlainView style={styles.footerCaptionGap} />
					<Text
						align="center"
						type="caption"
						style={[{ color: captionMuted }]}
					>
						Your data stays private and secure
					</Text>
				</PlainView>
			</PlainView>
		</PlainView>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	header: {
		paddingHorizontal: 28,
		paddingBottom: 4,
		backgroundColor: "transparent",
	},
	headerCopy: {
		width: "100%",
		alignSelf: "center",
	},
	headerGap: {
		height: 12,
	},
	bottomRegion: {
		flex: 1,
		position: "relative",
		justifyContent: "flex-end",
		overflow: "visible",
	},
	heroBackdropCircle: {
		position: "absolute",
		zIndex: 0,
	},
	heroImage: {
		position: "absolute",
		left: 0,
		bottom: 58,
		zIndex: 1,
	},
	footer: {
		width: "100%",
		paddingHorizontal: 28,
		paddingTop: 12,
		zIndex: 2,
		alignItems: "center",
		borderTopWidth: StyleSheet.hairlineWidth,
	},
	footerCaptionGap: {
		height: 6,
	},
	buttonWrap: {
		width: "100%",
		maxWidth: 400,
	},
});
