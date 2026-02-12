import { StyleSheet, Alert } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { BlockButton as Button } from "@/components/block-button";
import { useAuthentication } from "@/context/SessionContext";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function Index() {
	const { signIn } = useAuthentication();
	const textColour = useThemeColor({}, 'textSecondary');

	const handleSignIn = async () => {
		try {
			await signIn();
		} catch (error) {
			Alert.alert("Login Failed", "Please try again.");
		}
	};
	
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Image
					source={require('../assets/images/conversation-placeholder.png')}
					style={styles.image}
					contentFit="contain"
				/>
				<Text type='title' align='center' style={styles.title}>Conversation Insights</Text>
				<Text align='center'>Monitor and understand changes in communication patterns over time</Text>
			</View>

			<View style={styles.footer}>
				<Button title="Get Started" onPress={handleSignIn} />
				<Text align='center' type='caption' style={{color: textColour}}>Your data stays private and secure</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
		padding: 20,
		justifyContent: 'space-between',
	},
	content: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 40,
	},
	title: {
		marginTop: 24,
		marginBottom: 12,
	},
	image: {
		width: 280,
		height: 280,
		objectFit: 'contain',
	},
	footer: {
		width: '100%',
		paddingBottom: 20,
		gap: 12,
	},
});