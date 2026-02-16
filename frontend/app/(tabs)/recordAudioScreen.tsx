import { Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { RecordButton } from '@/components/record-button';
import { ThemedText as Text } from '@/components/themed-text';
import { ThemedView as View } from '@/components/themed-view';

export default function RecordAudioScreen() {
  	return (
   	<View style={styles.container}>
		<Image 
			source={require('../../assets/images/conversation-placeholder.png')} 
			style={styles.image}
			resizeMode="contain"
		/>	
		<View style={styles.tutorialTextContainer}>
			<Text type='title' align='center'>How to use</Text>
			<Text align='center'>The person asking questions should speak first and the person who's language is being analysed should speak second.</Text>
		</View>
	
		<View style={styles.button}>
			<RecordButton />
		</View>
	</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'center',
	},
	row: {
		flexDirection: 'row',
	},
	image: {
		width: 300,
		height: 200,
		alignSelf: 'center'
	},
	tutorialTextContainer: {
		padding: 40,
		alignSelf: 'center',
		marginBottom: 60,
	},
	button: {
		position: 'absolute',
		bottom: 20,
		left: 20,
		right: 20,
		width: '100%',
	},
});