import { StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuthentication } from '@/hooks/use-authentication';

export function LogoutButton() {
	const warningColour = useThemeColor({}, 'warning');
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
		<TouchableOpacity onPress={handleLogout} style={styles.button}>
			<IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color={warningColour} />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		padding: 10,
	},
});