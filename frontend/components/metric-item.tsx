import React from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { usePressedAnimation } from "@/hooks/use-pressed-animation";
import { IconSymbol } from "@/components//ui/icon-symbol";

export type MetricItemProps = {
    metricId: string;
    metricName: string;
};

export function MetricItem({ metricId, metricName }: MetricItemProps) {
  	const { scaleAnim, opacityAnim, handlePressIn, handlePressOut } = usePressedAnimation();
    const router = useRouter();
    const onPress = () => { router.push(`/metricScreen/${metricId}`); };

  	return (
    	<Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} hitSlop={8}>
			<Animated.View style={[ styles.container, { transform: [{ scale: scaleAnim }], opacity: opacityAnim } ]}>
				<View style={styles.row}>
					<Text type="heading" style={styles.updated} numberOfLines={1}>{metricName}</Text>
					<IconSymbol name="chevron.right" size={18} color="#666" />
				</View>
			</Animated.View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
  	container: {
    	borderRadius: 12,
    	paddingVertical: 14,
    	paddingHorizontal: 16,
  	},
  	row: {
    	flexDirection: "row",
    	alignItems: "center",
    	justifyContent: "space-between",
  	},
  	leftContent: {
    	flexDirection: "row",
    	alignItems: "center",
    	gap: 18,
    	flex: 1,
  	},
  	updated: {
   		opacity: 0.75,
  	},
  	date: {
    	alignItems: "center",
		width: 50,
		height: 50,
		borderRadius: 10,
  	},
});