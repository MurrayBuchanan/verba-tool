import { StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { Plus, AlertCircle } from 'lucide-react-native';
import { List } from "@/components/list";
import { InterventionItem as Item } from "@/components/intervention-item";
import { Intervention } from "@/constants/transcript";
import { getInterventions } from "@/services/intervention-service";
import { formatDisplayDate } from "@/utils/datetime-formatting";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Explaination } from "@/components/explaination";

export default function InterventionScreen() {
	const router = useRouter();
	const [interventions, setInterventions] = useState<Intervention[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const hasInitiallyLoaded = useRef(false);
	const warningColour = useThemeColor({}, 'warning');
	const accentColour = useThemeColor({}, 'accent');

	useFocusEffect(
		useCallback(() => {
			async function fetchInterventions() {
				try {
					if (!hasInitiallyLoaded.current) {
						setLoading(true);
					}
					
					const data = await getInterventions();
					setInterventions(data);
					setError(null);
					hasInitiallyLoaded.current = true;
				} catch (error) {
					setError("Unable to load annotations");
				} finally {
					setLoading(false);
				}
			}
			fetchInterventions();
			return () => {};
		}, [])
	);

	return (
		<View style={styles.container}>
			{loading ? (
				<View style={styles.center}>
					<ActivityIndicator size="large" color={accentColour} />
					<Text align="center">Loading...</Text>
				</View>
			) : error ? (
				<View style={styles.center}>
					<AlertCircle size={36} color={warningColour} style={styles.placeholder} />
					<Text align="center" style={{ color: warningColour }}>{error}</Text>
				</View>
			) : interventions.length === 0 ? (
				<View style={styles.center}>
					<Text align="center">No annotations, try creating a new annotation!</Text>
				</View>
			) : (
				<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
					
					<Explaination text="Annotations are used to document and view changes to language over set periods of time." />
					
					<List divider={true}>
						{ interventions.map((intervention) => {
							return (
								<Item
									key={intervention.id}
									onPress={() => router.push(`/interventionScreen/${intervention.id}`)}
									name={intervention.name}
									dateRange={`${formatDisplayDate(intervention.start_date)} - ${formatDisplayDate(intervention.end_date)}`}
								/>
							);
						})}
					</List>
				</ScrollView>
			)}
			{!loading && !error && (
				<TouchableOpacity style={[styles.button, { backgroundColor: accentColour }]} onPress={() => router.push("/interventionModal")}>
					<Plus size={28} color="#FFF"/>
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
		paddingHorizontal: 20,
  	},
	content: {
		paddingVertical: 20,
		flexGrow: 1,
	},
	button: {
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		right: 20,
		bottom: 20,
		width: 68,
		height: 68,
		borderRadius: 34,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
	},
	placeholder: {
		marginBottom: 16,
	},
});