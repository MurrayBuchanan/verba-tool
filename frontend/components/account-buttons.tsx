import { Alert, View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

import { useAuthentication } from '@/context/SessionContext';
import { IconButton } from '@/components/icon-button';
import { LogOut, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export function ProfileButton() {
	const iconColour = useThemeColor({}, 'icon');
	const router = useRouter();
	
	return (
		<View style={styles.container}>
			<IconButton icon={<ArrowLeft size={22} color={iconColour} />} onPress={() => router.dismissTo('/profilesScreen')} accessibilityLabel='Back to Profiles Button' />
		</View>
	);
}

export function LogoutButton() {
	const iconColour = useThemeColor({}, 'warning');
	const { signOut } = useAuthentication();

	const handleLogout = () => {
		Alert.alert("Logout", "Are you sure you want to logout?", [
				{
					text: "Cancel",
					style: "cancel"
				},
				{ text: "Logout", style: "destructive", onPress: () => signOut() }
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