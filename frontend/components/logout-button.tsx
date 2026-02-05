import { Alert, View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

import { useAuthentication } from '@/hooks/use-authentication';
import { IconButton } from '@/components/icon-button';
import { LogOut } from 'lucide-react-native';

export function LogoutButton() {
	const iconColour = useThemeColor({}, 'icon');
	const { signOut } = useAuthentication();

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
					onPress: () => {
						signOut();
					}
				}
			]
		);
	};
	return (
		<View style={styles.container}>
			<IconButton icon={<LogOut size={22} color={iconColour} />} onPress={handleLogout} accessibilityLabel='Logout' />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginRight: 16,
	},
});