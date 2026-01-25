import { ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { List } from "@/components/list";
import { InterventionItem as Item } from "@/components/intervention-item";
import { getInterventions } from "@/services/intervention-service";
import { Intervention } from "@/constants/transcript";
import { formatDisplayDate } from "@/utils/date-formatting";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function InterventionScreen() {
	const router = useRouter();
	const [interventions, setInterventions] = useState<Intervention[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const hasInitiallyLoaded = useRef(false);
	const colorScheme = useColorScheme() ?? 'light';

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
					setError("Unable to load interventions");
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
					<ActivityIndicator size="large" color={Colors.light.tint} />
					<Text align="center">Loading...</Text>
				</View>
			) : error ? (
				<View style={styles.center}>
					<Text align="center" lightColor="#B00020" darkColor="#CF6679">{error}</Text>
				</View>
			) : interventions.length === 0 ? (
				<View style={styles.center}>
					<Text align="center">No interventions, try creating a new intervention!</Text>
				</View>
			) : (
				<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
					<List divider={true}>
						{interventions.map((intervention) => {
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
				<TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]} onPress={() => router.push("/interventionModal")}>
					<IconSymbol name="plus" size={28} color="#FFF"/>
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
		width: 70,
		height: 70,
		borderRadius: 35,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
	}
});