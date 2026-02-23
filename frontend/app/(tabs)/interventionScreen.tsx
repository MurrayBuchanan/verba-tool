import { StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { AlertCircle, Calendar, Check, ClipboardList, Lightbulb, Plus } from 'lucide-react-native';
import { List } from "@/components/list";
import { Item } from "@/components/list-item";
import { Intervention } from "@/constants/interfaces";
import { getInterventions } from "@/services/intervention-service";
import { formatDisplayDate } from "@/utils/datetime-formatting";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProfile } from "@/context/ProfileContext";

export default function InterventionScreen() {
	const router = useRouter();
	const { profileId } = useProfile();
	const [interventions, setInterventions] = useState<Intervention[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const hasInitiallyLoaded = useRef(false);
	const warningColour = useThemeColor({}, 'warning');
	const iconColour = useThemeColor({}, 'icon');
	const accentColour = useThemeColor({}, 'accent');
	const textSecondary = useThemeColor({}, 'textSecondary');
	const backgroundSecondary = useThemeColor({}, 'backgroundSecondary');

	useFocusEffect(
		useCallback(() => {
			async function fetchInterventions() {
				try {
					if (!hasInitiallyLoaded.current) {
						setLoading(true);
					}
					
					const data = await getInterventions(profileId);
					setInterventions(data);
					setError(null);
					hasInitiallyLoaded.current = true;
				} catch {
					setError("Unable to load interventions");
				} finally {
					setLoading(false);
				}
			}
			fetchInterventions();
			return () => {};
		}, [profileId])
	);

	return (
		<View style={styles.container}>
			{loading ? (
				<View style={styles.center}>
					<ActivityIndicator size="large" color={iconColour} />
				</View>
			) : error ? (
				<View style={styles.center}>
					<AlertCircle size={36} color={warningColour} style={styles.placeholder} />
					<Text align="center" style={{ color: warningColour }}>{error}</Text>
				</View>
			) : interventions.length === 0 ? (
				<View style={styles.center}>
					<ClipboardList size={36} color={iconColour} style={styles.placeholder} />
					<Text align="center">No interventions, try creating a new intervention!</Text>
				</View>
			) : (
				<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
					<View style={[styles.explainationContainer, { backgroundColor: backgroundSecondary }]} lightColour={backgroundSecondary} darkColour={backgroundSecondary}>
						<View style={styles.explaination} lightColour={backgroundSecondary} darkColour={backgroundSecondary}>
							<Lightbulb size={18} color={textSecondary} />
							<Text type="caption">About this</Text>
						</View>
						<Text>Interventions are used to document and visualise strategies that support language recovery.</Text>
					</View>
					<List divider={true}>
						{ interventions.map((intervention) => (
							<Item
								key={intervention.id}
								name={intervention.name}
								icon={intervention.success ? <Check size={14} color={accentColour} /> : <Calendar size={14} color={iconColour} />}
								subtitle={`${formatDisplayDate(intervention.start_date)} - ${formatDisplayDate(intervention.end_date)}${intervention.success ? " · Success" : ""}`}
								onPress={() => router.push(`/interventionScreen/${intervention.id}`)}
							/>
						))}
					</List>
				</ScrollView>
			)}
			{!loading && !error && (
				<TouchableOpacity style={[styles.button, { backgroundColor: accentColour }]} onPress={() => router.push("/createInterventionModal")}>
					<Plus size={32} color="#FFF"/>
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
	explainationContainer: {
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		marginBottom: 20,
	},
	explaination: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 8,
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
	}
});