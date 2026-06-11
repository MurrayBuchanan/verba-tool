import React from "react";
import { ActivityIndicator, StyleSheet, View, TouchableOpacity, type StyleProp, type ViewStyle } from "react-native";
import { ThemedText as Text } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
    onPress: () => void;
    title?: string;
    lightColour?: string;
    darkColour?: string;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
};

export function BlockButton({ onPress, title, lightColour, darkColour, loading = false, style, contentStyle }: Props) {
    const background = useThemeColor({ light: lightColour, dark: darkColour }, "accent");

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.88}
            style={style}
            disabled={loading}
            accessibilityState={{ busy: loading, disabled: loading }}
        >
            <View style={[ styles.container, styles.content, { backgroundColor: background }, contentStyle ]}>
                {loading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text type="button" align="center" lightColour="#FFF" darkColour="#FFF">{title}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 48,
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 24,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});