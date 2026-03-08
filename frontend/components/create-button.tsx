import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { ThemedText as Text } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Plus } from "lucide-react-native";

type Props = {
    onPress: () => void;
    title?: string;
    lightColour?: string;
    darkColour?: string;
};

export function CreateButton({ onPress, title, lightColour, darkColour }: Props) {
    const background = useThemeColor({ light: lightColour, dark: darkColour }, "accent");

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[ styles.container, { backgroundColor: background }]}>
                <Plus size={24} color="#FFF" />
                <Text type="button" align="center" lightColour="#FFF" darkColour="#FFF">{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 56,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        gap: 12
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    }
});