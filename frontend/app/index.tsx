
import { StyleSheet } from 'react-native';
import { ThemedView as View } from '@/components/themed-view';
import { ThemedText as Text } from '@/components/themed-text';

// Handles app loading and authentication state

export default function HomeScreen() {
  return (
    <View>
      <Text style={styles.container} type="title">Hello</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
});
