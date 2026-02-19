import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

function calculateTimestamp(recordingStartedAt: string, offsetSeconds: number): string {
    const startedAt = new Date(recordingStartedAt.replace("Z", "+00:00")).getTime();
    const timestamp = new Date(startedAt + offsetSeconds * 1000);
    return timestamp.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true });
}

type Props = {
    speaker: string;
    speakerTitle?: string;
    text: string;
    createdAt?: string;
    offsetSeconds?: number;
};

export function SpeakerSegment({ speaker, speakerTitle, text, createdAt, offsetSeconds }: Props) {
    const bubbleColour = useThemeColor({}, "backgroundSecondary");
    const textColour = useThemeColor({}, "text");
    const textSecondaryColour = useThemeColor({}, "textSecondary");

    const isLeft = speaker === "Guest-1";
    const timestamp = createdAt != null && offsetSeconds != null ? calculateTimestamp(createdAt, offsetSeconds) : null;

    return (
        <ThemedView style={[styles.container, isLeft ? styles.left : styles.right]}>
            <View style={styles.segmentColumn}>
                <Text type="caption" lightColour={textSecondaryColour} darkColour={textSecondaryColour} style={isLeft ? styles.titleLeft : styles.titleRight}>{speakerTitle}</Text>
                <ThemedView lightColour={bubbleColour} darkColour={bubbleColour} style={styles.bubble}>
                    <View>
                        <Text lightColour={textColour} darkColour={textColour}>{text}</Text>
                        { timestamp && (
                            <View style={styles.timestamp}>
                                <Text type="caption" lightColour={textSecondaryColour} darkColour={textSecondaryColour}>{timestamp}</Text>
                            </View>
                        )}
                    </View>
                </ThemedView>
            </View>
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
    segmentColumn: {
        maxWidth: "70%",
    },
    titleLeft: {
        marginBottom: 4,
        marginLeft: 4,
    },
    titleRight: {
        marginBottom: 4,
        marginRight: 4,
        textAlign: "right",
    },
    bubble: {
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