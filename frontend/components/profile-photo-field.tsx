import { useCallback } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { ThemedText as Text } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Camera, User } from "lucide-react-native";

type Props = {
	displayUri: string | null;
	onPick: (uri: string) => void;
	onRemove: () => void;
	canRemove: boolean;
};

function alertNativeModuleMissing() {
	Alert.alert(
		"Photo picker not available",
		"This install is missing the native image-picker module (common with an older development build). Rebuild your dev client from the frontend folder: npx expo run:ios or npx expo run:android. If you do not have native projects yet, run npx expo prebuild first.",
	);
}

async function importImagePicker() {
	const mod = await import("expo-image-picker").catch(() => null);
	return mod;
}

export function ProfilePhotoField({ displayUri, onPick, onRemove, canRemove }: Props) {
	const accent = useThemeColor({}, "accent");
	const icon = useThemeColor({}, "icon");
	const border = useThemeColor({}, "backgroundTertiary");
	const backgroundSecondary = useThemeColor({}, "backgroundSecondary");

	const pickImage = useCallback(async () => {
		const ImagePicker = await importImagePicker();
		if (!ImagePicker) {
			alertNativeModuleMissing();
			return;
		}
		try {
			const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (!permission.granted) {
				Alert.alert("Permission needed", "Allow photo library access to choose a profile picture.");
				return;
			}
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ["images"],
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.85,
			});
			if (!result.canceled && result.assets[0]?.uri) {
				onPick(result.assets[0].uri);
			}
		} catch {
			alertNativeModuleMissing();
		}
	}, [onPick]);

	const takePhoto = useCallback(async () => {
		const ImagePicker = await importImagePicker();
		if (!ImagePicker) {
			alertNativeModuleMissing();
			return;
		}
		try {
			const permission = await ImagePicker.requestCameraPermissionsAsync();
			if (!permission.granted) {
				Alert.alert("Permission needed", "Allow camera access to take a profile picture.");
				return;
			}
			const result = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.85,
			});
			if (!result.canceled && result.assets[0]?.uri) {
				onPick(result.assets[0].uri);
			}
		} catch {
			alertNativeModuleMissing();
		}
	}, [onPick]);

	const chooseSource = useCallback(() => {
		Alert.alert("Profile photo", undefined, [
			{ text: "Photo library", onPress: () => void pickImage() },
			{ text: "Camera", onPress: () => void takePhoto() },
			{ text: "Cancel", style: "cancel" },
		]);
	}, [pickImage, takePhoto]);

	return (
		<View style={styles.wrap}>
			<Text type="caption" style={styles.label}>Photo</Text>
			<View style={styles.row}>
				{displayUri ? (
					<Image source={{ uri: displayUri }} style={styles.avatar} contentFit="cover" transition={200} />
				) : (
					<View style={[styles.avatar, styles.placeholder, { borderColor: border, backgroundColor: backgroundSecondary }]}>
						<User size={32} color={icon} />
					</View>
				)}
				<View style={styles.actions}>
					<Pressable
						onPress={chooseSource}
						style={({ pressed }) => [styles.actionBtn, { opacity: pressed ? 0.72 : 1 }]}
						accessibilityRole="button"
						accessibilityLabel="Add or change profile photo"
					>
						<Camera size={18} color={accent} style={styles.actionIcon} />
						<Text type="strong" style={{ color: accent }}>Choose photo</Text>
					</Pressable>
					{canRemove ? (
						<Pressable onPress={onRemove} accessibilityRole="button" accessibilityLabel="Remove profile photo">
							<Text style={{ color: icon }}>Remove</Text>
						</Pressable>
					) : null}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		gap: 8,
	},
	label: {
		marginBottom: 4,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
	avatar: {
		width: 88,
		height: 88,
		borderRadius: 44,
	},
	placeholder: {
		borderWidth: StyleSheet.hairlineWidth,
		alignItems: "center",
		justifyContent: "center",
	},
	actions: {
		flex: 1,
		gap: 10,
	},
	actionBtn: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	actionIcon: {
		marginTop: 1,
	},
});
