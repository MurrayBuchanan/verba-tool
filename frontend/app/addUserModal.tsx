import { StyleSheet } from "react-native";
import { useState } from "react";

import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as View } from "@/components/themed-view";
import { TextField } from "@/components/textfield";
import { BlockButton } from "@/components/block-button";

const addUser = () => {
	
}

export default function AddUserModal() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");

	return (
		<View style={styles.container}>
			<Text type="title">Add User</Text>
			<TextField label="First Name" placeholder="Enter first name" value={firstName} onChangeText={setFirstName} />
			<TextField label="Last Name" placeholder="Enter last name" value={lastName} onChangeText={setLastName} />
			<TextField label="Email" placeholder="Enter email address" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
			<BlockButton title="Add User" onPress={() => { addUser() }} />
		</View>
	);
}

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
    	alignItems: "center",
    	justifyContent: "center",
    	padding: 20,
  	},
  	link: {
		marginTop: 15,
    	paddingVertical: 15,
  	},
});
