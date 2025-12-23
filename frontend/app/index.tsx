import { StyleSheet } from "react-native";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { List } from "@/components/list";
import { ProfileButton } from "@/components/profile-button";
import { useRouter } from "expo-router";

// Handles app loading and authentication state

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text type="title">List of Profiles</Text>
        <IconSymbol name="person.crop.circle.fill" size={40} color="black" />
      </View>

        <List>
          <ProfileButton
            firstName="John"
            lastName="Doe"
            lastUpdated="2024-06-01"
            onPress={() => {
              router.push("/dashboard/(tabs)/recordAudioScreen");
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
