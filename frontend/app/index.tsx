import { StyleSheet } from "react-native";
import { Image } from "expo-image";

import { BlockButton as Button } from "@/components/block-button";
import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as View } from "@/components/themed-view";
import { router } from "expo-router";

export default function Index() {
  return (
    <View lightColor="#AEAFF7" darkColor="#8F90DF" style={styles.container}>
		<Text type='title' align='center'>Here to help you monitor conversation!</Text>
		<Image
			source={require('../assets/images/conversation-placeholder.png')}
			style={styles.image}
			contentFit="contain"
			transition={1000}
		/>
		<Button color="white" backgroundColor="#371B34" title="Secure Sign In" onPress={() => router.replace("/(tabs)/metricsScreen")} />
    </View>
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