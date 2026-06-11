import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Baby, Brain, BrainCircuit, HeartPulse, MessageCircle, Mic } from "lucide-react-native";
import { FOCUS_AREA_OPTIONS, type FocusAreaId } from "@/constants/focus-areas";
import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as Container } from "@/components/themed-view";
import { useFocusArea } from "@/context/FocusAreaContext";
import { useThemeColor } from "@/hooks/use-theme-color";

const ICONS: Record<FocusAreaId, typeof Brain> = {
	aphasia: Brain,
	child_language: Baby,
	concussion: HeartPulse,
	dementia_language: BrainCircuit,
	speech_practice: Mic,
	general: MessageCircle,
};

export function FocusAreaSelectionScreen() {
	const { setFocusAreaId } = useFocusArea();
	const backgroundSecondary = useThemeColor({}, "backgroundSecondary");
	const border = useThemeColor({}, "backgroundTertiary");
	const accent = useThemeColor({}, "accent");
	const iconColour = useThemeColor({}, "icon");

	const onSelect = async (id: FocusAreaId) => {
		try {
			await setFocusAreaId(id);
		} catch {
			Alert.alert("Could not save", "Check your connection and try again.");
		}
	};

	return (
		<Container style={styles.root}>
			<SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
				<ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
					<View style={styles.header}>
						<Text type="title" style={styles.heading}>
							What brings you here?
						</Text>
						<Text type="caption" align="center">
							Choose the focus that best matches how you plan to use the app.
						</Text>
					</View>
					<View style={styles.list}>
						{FOCUS_AREA_OPTIONS.map((option) => {
							const Icon = ICONS[option.id];
							return (
								<TouchableOpacity
									key={option.id}
									accessibilityRole="button"
									accessibilityLabel={`${option.title}. ${option.description}`}
									onPress={() => onSelect(option.id)}
									style={[styles.card, { backgroundColor: backgroundSecondary, borderColor: border }]}
									activeOpacity={0.85}
								>
									<View style={[styles.iconWrap, { backgroundColor: accent + "22" }]}>
										<Icon size={24} color={accent} accessibilityElementsHidden />
									</View>
									<View style={styles.cardBody}>
										<Text type="strong">{option.title}</Text>
										<Text type="caption" style={styles.desc}>
											{option.description}
										</Text>
									</View>
									<Text type="caption" style={{ color: iconColour }}>
										›
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				</ScrollView>
			</SafeAreaView>
		</Container>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
	safe: {
		flex: 1,
	},
	scroll: {
		paddingHorizontal: 20,
		paddingBottom: 24,
	},
	header: {
		paddingTop: 16,
		paddingBottom: 24,
		gap: 12,
		alignItems: "center",
	},
	heading: {
		textAlign: "center",
	},
	list: {
		gap: 12,
	},
	card: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		borderRadius: 16,
		borderWidth: StyleSheet.hairlineWidth,
		gap: 14,
	},
	iconWrap: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: "center",
		justifyContent: "center",
	},
	cardBody: {
		flex: 1,
		minWidth: 0,
		gap: 4,
	},
	desc: {
		marginTop: 2,
	},
});
