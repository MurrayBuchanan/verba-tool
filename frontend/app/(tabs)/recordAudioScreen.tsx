import { RecordButton } from '@/components/record-button';
import { ThemedText as Text } from '@/components/themed-text';
import { ThemedView as View } from '@/components/themed-view';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

export default function RecordAudioScreen() {
  return (
   <View style={styles.container}>
    <View>
      <View style={styles.row}>
        <Text type='title' style={{fontWeight: '600'}}>Welcome back, </Text>
        <Text type='title' style={{fontWeight: '700'}}>Bob!</Text>
      </View>

    </View>

    <View>
      <Image
        source={require('../../assets/images/conversation-placeholder.png')}
        style={styles.image}
        contentFit="contain"
        transition={1000}
      />
      <View style={styles.tutorialTextContainer}>
        <Text type='subtitle' align='center'>How to Use</Text>
        <Text type='default' align='center'>Click start recording and we will listen for language patterns for your clinician.</Text>
      </View>
    </View>

    <RecordButton />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: 220,

    height: 220,
    
    alignSelf: 'center'
  },
  tutorialTextContainer: {
    width: '90%',
    alignSelf: 'center'
  }
});
