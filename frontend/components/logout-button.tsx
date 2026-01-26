import { StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { signOut } from '@/services/authentication-service';
import { router } from 'expo-router';

export function LogoutButton() {
	const colorScheme = useColorScheme();

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
						try {
							await signOut();
							router.replace("/");
						} catch (error) {
							console.error("Error signing out:", error);
						}
					}
				}
			]
		);
	};
	return (
		<TouchableOpacity onPress={handleLogout} style={styles.button}>
			<IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color={Colors[colorScheme ?? 'light'].warning} />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		padding: 10,
	},
});