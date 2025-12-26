import React from "react";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

import { List } from "@/components/list";
import { ProfileItem as Item } from "@/components/profile-item";
import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as View } from "@/components/themed-view";
import { BlockButton } from "@/components/block-button";

export default function HomeScreen() {
	const router = useRouter();
  	return (
    	<View style={styles.container}>
      		<Text type="title">Homepage</Text>
    
      		<Text type="subtitle">List of Profiles</Text>

        	<List>
          		<Item
            		firstName="Bob"
            		lastName="Marley"
            		lastUpdated="2025-12-01"
            		onPress={() => {
              			router.push("/(tabs)/recordAudioScreen");
            		}}
          		/>
          	<BlockButton 
            	title="Add New Profile"
            	onPress={() => {
              	router.push("/addUserModal");
            }}/>
        </List>
    </View>
  );
}

const styles = StyleSheet.create({
	container: {
    	flex: 1,
    	padding: 20,
  	},
  	row: {
	    flexDirection: "row",
    	justifyContent: "space-between",
    	alignItems: "center",
  	},
});
