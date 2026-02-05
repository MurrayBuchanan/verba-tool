import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { ChevronRight, Calendar } from 'lucide-react-native';
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
    onPress: () => void;
	name: string;
	dateRange: string;
};

export function InterventionItem({ onPress, name, dateRange }: Props) {
	const iconColour = useThemeColor({}, 'icon');
	
  	return (
    	<TouchableOpacity onPress={onPress} style={styles.container}>
			<View style={styles.row}>
				<View style={styles.left}>
					<View style={styles.content}>
						<Text type="strong">{name}</Text>
						<View style={styles.dateRow}>
							<Calendar size={14} color={iconColour} style={styles.icon}/>
							<Text type="caption">{dateRange}</Text>
						</View>
					</View>
				</View>
				<ChevronRight size={18} color={iconColour} />
			</View>
      	</TouchableOpacity>
  	);
}

const styles = StyleSheet.create({
  	container: {
    	borderRadius: 12,
    	paddingVertical: 10,
  	},
  	row: {
    	flexDirection: "row",
    	alignItems: "center",
    	justifyContent: "space-between",
  	},
	backgroundBox: {
		padding: 8,
		borderRadius: 8,
		marginRight: 12,
		width: 36,
		height: 36,
		alignItems: "center",
		justifyContent: "center",
	},
	left: {
    	flexDirection: "row",
		alignItems: "center",
		flex: 1,
  	},
	content: {
		flex: 1,
	},
	dateRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	icon: {
		marginRight: 6,
	},
});