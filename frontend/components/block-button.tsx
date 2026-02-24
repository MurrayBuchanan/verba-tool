import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { ThemedText as Text } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
    onPress: () => void;
    title?: string;
    lightColour?: string;
    darkColour?: string;
};

export function BlockButton({ onPress, title, lightColour, darkColour }: Props) {
    const background = useThemeColor({ light: lightColour, dark: darkColour }, "accent");

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[ styles.container, { backgroundColor: background }]}>
                <Text type="button" align="center" lightColour="#FFF" darkColour="#FFF">{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    }
});