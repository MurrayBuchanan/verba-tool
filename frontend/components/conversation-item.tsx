import React from "react";
import { Animated, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { ThemedText as Text } from "@/components/themed-text";
import { usePressedAnimation } from "@/hooks/use-pressed-animation";
import { IconSymbol } from "@/components//ui/icon-symbol";

export type ConversationItemProps = {
    onPress: () => void;
	dateNumber: string;
	dateString: string;
	conversationId: string;
	snippet: string;
  	style?: StyleProp<ViewStyle>;
};

export function ConversationItem({ onPress, dateNumber, dateString, conversationId, snippet, style }: ConversationItemProps) {
  	const { scaleAnim, opacityAnim, handlePressIn, handlePressOut } = usePressedAnimation();

  	return (
    	<Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} hitSlop={8}>
      	<Animated.View style={[ styles.container, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }, style as any ]}>
			<View style={styles.row}>
				<View style={styles.date}>
					<Text type="heading" style={styles.updated} numberOfLines={1}>{dateNumber}</Text>
					<Text type="caption" style={styles.updated} numberOfLines={1}>{dateString}</Text>
				</View>
				<View>
					<Text type="heading" style={styles.name} numberOfLines={1}>{conversationId}</Text>
					<Text type="default" style={styles.updated} numberOfLines={1}>{snippet}</Text>
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
  	date: {
    	alignItems: "center",
  	},
});