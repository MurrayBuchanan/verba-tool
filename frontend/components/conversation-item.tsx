import React from "react";
import { Animated, Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { usePressedAnimation } from "@/hooks/use-pressed-animation";
import { IconSymbol } from "@/components//ui/icon-symbol";

export type ConversationItemProps = {
    onPress: () => void;
	dateNumber: string;
	dateString: string;
	conversationId: string;
	conversationLength: string;
  	style?: StyleProp<ViewStyle>;
};

export function ConversationItem({ onPress, dateNumber, dateString, conversationId, conversationLength, style }: ConversationItemProps) {
  	const { scaleAnim, opacityAnim, handlePressIn, handlePressOut } = usePressedAnimation();

  	return (
    	<Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} hitSlop={8}>
      	<Animated.View style={[ styles.container, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }, style as any ]}>
			<View style={styles.row}>
				<View style={styles.leftContent}>
					<View lightColor="#B8CDF7" darkColor="#538BFA" style={styles.date}>
						<Text type="heading" style={styles.updated} numberOfLines={1}>{dateNumber}</Text>
						<Text type="caption" style={styles.updated} numberOfLines={1}>{dateString}</Text>
					</View>
					<Text type="default" style={styles.updated} numberOfLines={1}>{conversationLength}</Text>
				</View>
				<IconSymbol name="chevron.right" size={18} color="#666" />
			</View>
      	</Animated.View>
    </Pressable>
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