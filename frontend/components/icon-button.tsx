import { TouchableOpacity, StyleSheet, View } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedView } from "@/components/themed-view";

type Props = {
    icon: React.ReactNode;
    onPress: () => void;
    accessibilityLabel?: string;
};

export function IconButton({ icon, onPress, accessibilityLabel }: Props) {
    const activeColour = useThemeColor({}, "active");

    return (
        <TouchableOpacity onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
            <View style={styles.container}>
                <ThemedView lightColour={activeColour} darkColour={activeColour} style={styles.icon}>{icon}</ThemedView>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        minWidth: 40,
        minHeight: 40,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        padding: 8,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
});