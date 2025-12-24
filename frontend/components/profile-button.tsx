import React from "react";
import { Animated, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { ThemedText as Text } from "@/components/themed-text";
import { usePressedAnimation } from "@/hooks/use-pressed-animation";
import { IconSymbol } from "@/components//ui/icon-symbol";

export type ProfileButtonProps = {
    onPress: () => void;
  	firstName: string;
  	lastName: string;
  	lastUpdated: string;
  	style?: StyleProp<ViewStyle>;
};

export function ProfileButton({ onPress, firstName, lastName, lastUpdated, style }: ProfileButtonProps) {
  	const { scaleAnim, opacityAnim, handlePressIn, handlePressOut } = usePressedAnimation();

  	return (
    	<Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} hitSlop={8}>
      	<Animated.View style={[ styles.container, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }, style as any ]}>
			<View style={styles.row}>
				<View>
					<Text type="heading" style={styles.name} numberOfLines={1}>{firstName} {lastName}</Text>
					<Text type="default" style={styles.updated} numberOfLines={1}>Last Updated: {lastUpdated}</Text>
				</View>
				<IconSymbol name="chevron.right" size={18} color="#666" />
			</View>
      	</Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  	container: {
    	backgroundColor: "#f0f0f0",
    	borderRadius: 12,
    	paddingVertical: 14,
    	paddingHorizontal: 16,
  	},
  	row: {
    	flexDirection: "row",
    	alignItems: "center",
    	justifyContent: "space-between",
    	gap: 12,
  	},
  	name: {
    	marginBottom: 2,
  	},
  	updated: {
   		opacity: 0.75,
  	},
});