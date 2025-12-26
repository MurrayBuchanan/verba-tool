
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Image } from "expo-image";

import { BlockButton as Button } from "@/components/block-button";
import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as View } from "@/components/themed-view";
import { getIdToken, signIn } from "@/services/authentication-service";
import { router } from "expo-router";

export default function LoginScreen() {
	const [checkingAuth, setCheckingAuth] = useState(true);

	// Check if the user is authenticated
	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				const token = await getIdToken();
				if (token) {
          			// If token exists, user is authenticated
					router.replace("/userListScreen");
					return;
				}
			} catch (error) {
				console.error("Cannot authenticate user", error);
			} finally {
				setCheckingAuth(false);
			}
		};
		checkAuthStatus();
	}, []);

  const handleLogin = async () => {
    try {
        const result = await signIn();
        if (result) {
        	router.replace("/userListScreen");
        } else {
            Alert.alert("Login Unsuccessful", "Please try again.");
        }
	} catch (error) {
		Alert.alert("Login Unsuccessful", "An error occurred during login");
		console.error(error);
    }
  };

  return (
    <View style={styles.container}>
		{/* Avoid flashing login UI while checking auth */}
		{checkingAuth ? null : (
			<View lightColor="#AEAFF7" darkColor="#8F90DF">
				<Text type='title'>Here to help you monitor conversation!</Text>
				<Image
					source={require('../assets/images/conversation-placeholder.png')}
					style={styles.image}
					contentFit="contain"
					transition={1000}
				  />
				<Button title="Secure Sign In" onPress={handleLogin} />
			</View>
		)}
    </View>
  );
};

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
		padding: 20,
  	},
  	scrollContent: {
    	flexGrow: 1,
  	},
	image: {
		width: 220,
		height: 220,
		alignSelf: 'center',
		marginVertical: 20,
	},
});