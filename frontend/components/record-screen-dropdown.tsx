import { Check, ChevronDown } from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
	Dimensions,
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { Fonts } from "@/constants/theme";

const DROPDOWN_TRIGGER_BG = "#1E1E1E";
const MENU_SURFACE = "#252525";
const MENU_BORDER = "rgba(255,255,255,0.08)";
const SUBTITLE_COLOR = "#9CA3AF";
const DIVIDER = "rgba(255,255,255,0.1)";

type ModelId = "google" | "azure" | "llama" | "gpt-5.2" | "opus-4.6" | "llama-4";

const LLM_MODELS: { id: ModelId; label: string; description: string }[] = [
	{ id: "google", label: "Google", description: "Gemini models for fast, grounded answers" },
	{ id: "azure", label: "Azure", description: "Enterprise models via Azure OpenAI" },
	{ id: "llama", label: "Llama", description: "Open-weight Meta models" },
	{ id: "gpt-5.2", label: "GPT-5.2", description: "Latest GPT for complex reasoning" },
	{ id: "opus-4.6", label: "Opus 4.6", description: "Most capable for ambitious work" },
	{ id: "llama-4", label: "Llama 4", description: "Long-context open models" },
];

type AsrId = "google" | "azure" | "llama";

const ASR_MODELS: { id: AsrId; label: string; description: string }[] = [
	{ id: "google", label: "Google", description: "Cloud Speech-to-Text, strong accents" },
	{ id: "azure", label: "Azure", description: "Azure AI Speech transcription" },
	{ id: "llama", label: "Llama", description: "Lightweight or on-device ASR stacks" },
];

export function RecordScreenDropdown() {
	const defaultLlm = LLM_MODELS.find((m) => m.id === "opus-4.6") ?? LLM_MODELS[0];
	const [selectedLlmId, setSelectedLlmId] = useState<ModelId>(defaultLlm.id);
	const [selectedAsrId, setSelectedAsrId] = useState<AsrId>("google");
	const [open, setOpen] = useState(false);
	const anchorRef = useRef<View>(null);
	const [menuGeometry, setMenuGeometry] = useState({ top: 0, left: 0, width: 0 });

	const triggerLabel = useMemo(() => {
		const row = LLM_MODELS.find((m) => m.id === selectedLlmId);
		return row?.label ?? "Model";
	}, [selectedLlmId]);

	const measureOpen = useCallback(() => {
		const screenW = Dimensions.get("window").width;
		const menuWidth = Math.min(Math.max(screenW - 32, 280), 360);
		anchorRef.current?.measureInWindow((x, y, width, height) => {
			const left = Math.min(Math.max(16, x + width - menuWidth), screenW - menuWidth - 16);
			setMenuGeometry({
				top: y + height + 8,
				left,
				width: menuWidth,
			});
			setOpen(true);
		});
	}, []);

	const close = useCallback(() => setOpen(false), []);

	return (
		<>
			<View ref={anchorRef} collapsable={false}>
				<Pressable
					onPress={measureOpen}
					style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}
					hitSlop={8}
				>
					<Text style={styles.triggerLabel} numberOfLines={1}>
						{triggerLabel}
					</Text>
					<ChevronDown size={16} color="#FFFFFF" strokeWidth={2.25} />
				</Pressable>
			</View>

			<Modal visible={open} transparent animationType="fade" onRequestClose={close}>
				<View style={styles.modalRoot}>
					<Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityRole="button" />
					<View style={[styles.menuShell, { top: menuGeometry.top, left: menuGeometry.left, width: menuGeometry.width }]}>
						<ScrollView
							style={styles.menuScroll}
							contentContainerStyle={styles.menuScrollContent}
							keyboardShouldPersistTaps="handled"
							showsVerticalScrollIndicator={false}
						>
							<Text style={styles.sectionHeading}>Language model</Text>
							{LLM_MODELS.map((item) => (
								<ModelRow
									key={`llm-${item.id}`}
									label={item.label}
									description={item.description}
									selected={item.id === selectedLlmId}
									onPress={() => setSelectedLlmId(item.id)}
								/>
							))}
							<View style={styles.sectionDivider} />
							<Text style={styles.sectionHeading}>Speech to text</Text>
							{ASR_MODELS.map((item) => (
								<ModelRow
									key={`asr-${item.id}`}
									label={item.label}
									description={item.description}
									selected={item.id === selectedAsrId}
									onPress={() => setSelectedAsrId(item.id)}
								/>
							))}
						</ScrollView>
					</View>
				</View>
			</Modal>
		</>
	);
}

function ModelRow({
	label,
	description,
	selected,
	onPress,
}: {
	label: string;
	description: string;
	selected: boolean;
	onPress: () => void;
}) {
	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [styles.row, selected && styles.rowSelected, pressed && styles.rowPressed]}
		>
			<View style={styles.checkSlot}>
				{selected ? <Check size={18} color="#FFFFFF" strokeWidth={2.5} /> : null}
			</View>
			<View style={styles.rowText}>
				<Text style={styles.rowTitle}>{label}</Text>
				<Text style={styles.rowSubtitle}>{description}</Text>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	trigger: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 8,
		backgroundColor: DROPDOWN_TRIGGER_BG,
	},
	triggerPressed: {
		opacity: 0.85,
	},
	triggerLabel: {
		fontFamily: Fonts.uiMedium,
		fontSize: 15,
		lineHeight: 20,
		color: "#FFFFFF",
		maxWidth: 140,
	},
	modalRoot: {
		flex: 1,
	},
	menuShell: {
		position: "absolute",
		maxHeight: Dimensions.get("window").height * 0.72,
		backgroundColor: MENU_SURFACE,
		borderRadius: 20,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: MENU_BORDER,
		overflow: "hidden",
		elevation: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.35,
		shadowRadius: 16,
	},
	menuScroll: {
		maxHeight: Dimensions.get("window").height * 0.72,
	},
	menuScrollContent: {
		paddingVertical: 8,
		paddingBottom: 14,
	},
	sectionHeading: {
		fontFamily: Fonts.uiSemiBold,
		fontSize: 13,
		lineHeight: 18,
		color: "#FFFFFF",
		letterSpacing: 0.2,
		paddingHorizontal: 16,
		paddingTop: 12,
		paddingBottom: 6,
		opacity: 0.95,
	},
	sectionDivider: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: DIVIDER,
		marginVertical: 10,
		marginHorizontal: 12,
	},
	row: {
		flexDirection: "row",
		alignItems: "flex-start",
		paddingVertical: 12,
		paddingRight: 14,
		paddingLeft: 4,
	},
	rowSelected: {
		backgroundColor: "rgba(255,255,255,0.06)",
	},
	rowPressed: {
		backgroundColor: "rgba(255,255,255,0.1)",
	},
	checkSlot: {
		width: 36,
		alignItems: "center",
		paddingTop: 2,
	},
	rowText: {
		flex: 1,
		gap: 2,
	},
	rowTitle: {
		fontFamily: Fonts.uiMedium,
		fontSize: 16,
		lineHeight: 22,
		color: "#FFFFFF",
	},
	rowSubtitle: {
		fontFamily: Fonts.ui,
		fontSize: 13,
		lineHeight: 18,
		color: SUBTITLE_COLOR,
	},
});
