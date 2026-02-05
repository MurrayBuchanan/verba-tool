import { TouchableOpacity, StyleSheet } from "react-native";
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
        <TouchableOpacity style={styles.container} onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
            <ThemedView lightColour={activeColour} darkColour={activeColour} style={styles.container}>{icon}</ThemedView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 6,
        borderRadius: 100,
    },
});