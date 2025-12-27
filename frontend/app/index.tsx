import { StyleSheet } from "react-native";
import { Image } from "expo-image";

import { BlockButton as Button } from "@/components/block-button";
import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as View } from "@/components/themed-view";
import { router } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
		<View lightColor="#AEAFF7" darkColor="#8F90DF">
			<Text type='title'>Here to help you monitor conversation!</Text>
			<Image
				source={require('../assets/images/conversation-placeholder.png')}
				style={styles.image}
				contentFit="contain"
				transition={1000}
			  />
			<Button title="Secure Sign In" onPress={() => router.replace("/(tabs)/metricsScreen")} />
		</View>
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