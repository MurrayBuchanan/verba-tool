
import React, { useState } from "react";
import { StyleSheet, View, ScrollView, KeyboardAvoidingView } from "react-native";

import { BlockButton as Button } from "@/components/block-button";
import { ThemedText as Text } from "@/components/themed-text";
import { TextField } from "@/components/textfield";

export function LoginScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Login button pressed");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        
			<Text type='title'>Sign In</Text>
          <TextField
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            secureTextEntry={false}
          />
          <TextField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            keyboardType="default"
          />
          <Button
            title="Login"
            onPress={handleLogin}
          />

      </KeyboardAvoidingView>
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