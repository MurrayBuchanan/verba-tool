import { Alert, View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

import { signOut } from '@/services/authentication-service';
import { IconButton } from '@/components/icon-button';
import { LogOut, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export function ProfileButton() {
	const iconColour = useThemeColor({}, 'icon');

	return (
		<View style={styles.container}>
			<IconButton icon={<ArrowLeft size={22} color={iconColour} />} onPress={() => router.back()} accessibilityLabel='Profile Button' />
		</View>
	);
}

export function LogoutButton() {
	const iconColour = useThemeColor({}, 'warning');

	const handleLogout = () => {
		Alert.alert(
			"Logout",
			"Are you sure you want to logout?",
			[
				{
					text: "Cancel",
					style: "cancel"
				},
				{
					text: "Logout",
					style: "destructive",
					onPress: async () => { 
						await signOut();
						router.replace('/');
					}
				}
			]
		);
	};
	return <IconButton icon={<LogOut size={22} color={iconColour} />} onPress={handleLogout} accessibilityLabel='Logout Button' />
	
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 16,
	},
});