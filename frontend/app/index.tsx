import { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";

import { BlockButton as Button } from "@/components/block-button";
import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as View } from "@/components/themed-view";
import { signIn, isAuthenticated } from "@/services/authentication-service";
import { Colors } from "@/constants/theme";

export default function Index() {
	const [isAuthenticating, setIsAuthenticating] = useState(true);
	const [isSigningIn, setIsSigningIn] = useState(false);

	useEffect(() => { checkAuthentication(); }, []);

	const checkAuthentication = async () => {
		try {
			const authenticated = await isAuthenticated();
			if (authenticated) {
				router.replace("/(tabs)/recordAudioScreen");
			} else {
				setIsAuthenticating(false);
			}
		} catch (error) {
			console.error("Error checking authentication:", error);
			setIsAuthenticating(false);
		}
	};

	const handleSignIn = async () => {
		setIsSigningIn(true);
		try {
			const result = await signIn();
			if (result) {
				router.replace("/(tabs)/recordAudioScreen");
			} else {
				setIsSigningIn(false);
			}
		} catch (error) {
			console.error("Error during sign in:", error);
			setIsSigningIn(false);
		}
	};
	
	return (
		isAuthenticating ? (
			<View style={styles.container}>
				<ActivityIndicator size="large" color={Colors.light.tint} />
			</View>
		) : (
			<View style={styles.container}>
				<Text type='title' align='center'>Here to help you monitor conversation!</Text>
				<Image
					source={require('../assets/images/conversation-placeholder.png')}
					style={styles.image}
					contentFit="contain"
				/>
				<Button title={isSigningIn ? "Signing In" : "Secure Sign In"} onPress={handleSignIn} />
			</View>
		)
	);
};

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
		padding: 20,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 40,
  	},
	image: {
		width: 320,
		height: 320,
		objectFit: 'contain',
		alignSelf: 'center',
	},
});