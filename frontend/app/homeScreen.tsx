import { List } from "@/components/list";
import { ProfileButton } from "@/components/profile-button";
import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as View } from "@/components/themed-view";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

// Handles app loading and authentication state

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text type="title">Homepage</Text>
    
      <Text type="subtitle">List of Profiles</Text>

        <List>
          <ProfileButton
            firstName="Bob"
            lastName="Marley"
            lastUpdated="2025-12-01"
            onPress={() => {
              router.push("/(tabs)/recordAudioScreen");
            }}
          />
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
