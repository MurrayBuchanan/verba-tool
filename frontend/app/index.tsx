
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, StyleSheet, View } from "react-native";

import { BlockButton as Button } from "@/components/block-button";
import { ThemedText as Text } from "@/components/themed-text";
import { getIdToken, signIn } from "@/services/authenticationService";
import { router } from "expo-router";

export default function LoginScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [checkingAuth, setCheckingAuth] = useState(true);

	// Check if the user is authenticated
	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				const token = await getIdToken();
				if (token) {
          // If token exists, user is authenticated
					router.replace("/homeScreen");
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
    setLoading(true);
    try {
        const result = await signIn();
        if (result) {
        	router.replace("/homeScreen");
        } else {
            Alert.alert("Login Unsuccessful", "Please try again.");
        }
	} catch (error) {
		Alert.alert("Login Unsuccessful", "An error occurred during login");
		console.error(error);
    } finally {
		setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
		{/* Avoid flashing login UI while checking auth */}
		{checkingAuth ? null : (
		<KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>

		<Text type='title'>Sign In</Text>
      <Button title="Secure Sign In" onPress={handleLogin} />
      
      </KeyboardAvoidingView>
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
});