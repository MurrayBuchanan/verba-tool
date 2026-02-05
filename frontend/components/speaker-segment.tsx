import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

function calculateTimestamp(recordingStartedAt: string, offsetSeconds: number): string {
    const start = new Date(recordingStartedAt.replace("Z", "+00:00")).getTime();
    const timestamp = new Date(start + offsetSeconds * 1000);
    return timestamp.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true });
}

type Props = {
    speaker: string;
    text: string;
    createdAt?: string;
    offsetSeconds?: number;
};

export function SpeakerSegment({ speaker, text, createdAt, offsetSeconds }: Props) {
    const backgroundColour = useThemeColor({}, "backgroundSecondary");
    const activeColour = useThemeColor({}, "active");
    const textColour = useThemeColor({}, "text");
    const textSecondaryColour = useThemeColor({}, "textSecondary");

    const isPrimarySpeaker = speaker === "Guest-1";
    const timestamp = createdAt != null && offsetSeconds != null ? calculateTimestamp(createdAt, offsetSeconds) : null;

    const message = (
        <View>
            <Text lightColour={textColour} darkColour={textColour}>{text}</Text>
            { timestamp && (
                <View style={styles.timestamp}>
                    <Text type="caption" lightColour={textSecondaryColour} darkColour={textSecondaryColour}>{timestamp}</Text>
                </View>
            )}
        </View>
    );

    return (
        <ThemedView style={[styles.container, isPrimarySpeaker ? styles.left : styles.right]}>
            {isPrimarySpeaker ? (
                <ThemedView lightColour={activeColour} darkColour={activeColour} style={styles.bubble}>
                    {message}
                </ThemedView>
            ) : (
                <ThemedView lightColour={backgroundColour} darkColour={backgroundColour} style={styles.bubble}>
                    {message}
                </ThemedView>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginVertical: 8,
        paddingHorizontal: 20,
    },
    left: {
        justifyContent: "flex-start",
    },
    right: {
        justifyContent: "flex-end",
    },
    bubble: {
        maxWidth: "70%",
        borderRadius: 18,
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    timestamp: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 2,
    },
});