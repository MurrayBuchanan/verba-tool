import React from "react";
import { StyleSheet } from "react-native";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { Colors } from "@/constants/theme";

export type SpeakerSegmentProps = {
    speaker: string;
    text: string;
};

export function SpeakerSegment({ speaker, text }: SpeakerSegmentProps) {
    // If primary speaker (Guest-1) is speaking the message is left aligned, otherwise it is right aligned
    const isPrimarySpeaker = speaker === "Guest-1";
    
    return (
        <View style={[ styles.messageContainer, isPrimarySpeaker ? styles.isLeftAligned : styles.isRightAligned]}>
            { isPrimarySpeaker ? (
                <View lightColor="#ccc" darkColor="#333" style={styles.bubble}>
                    <Text lightColor="#0B1220" darkColor="#FFFFFF">{text}</Text>
                </View>
            ) : (
                <View lightColor={Colors.light.tint} darkColor={Colors.dark.tint} style={styles.bubble}>
                    <Text lightColor="#FFFFFF" darkColor="#0B1220">{text}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    messageContainer: {
        flexDirection: "row",
        marginVertical: 8,
        paddingHorizontal: 20,
    },
    isLeftAligned: {
        justifyContent: "flex-start",
    },
    isRightAligned: {
        justifyContent: "flex-end",
    },
    bubble: {
        maxWidth: "70%",
        borderRadius: 18,
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
});