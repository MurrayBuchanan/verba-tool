import React from "react";
import { StyleSheet } from "react-native";

import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";

export type SpeakerSegmentProps = {
    speaker: string;
    text: string;
};

export function SpeakerSegment({ speaker, text }: SpeakerSegmentProps) {
    // If speaker 1 -> left; else speaker 2 -> right
    const isSpeaker1 = speaker.endsWith("-1") || speaker === "Guest-1" || speaker === "Speaker-1";
    
    return (
        <View style={[ styles.messageContainer, isSpeaker1 ? styles.leftMessage : styles.rightMessage]}>
            <View lightColor="#B8CDF7" darkColor="#538BFA"style={[ styles.bubble]}>
                <Text type="default">{text}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    messageContainer: {
        flexDirection: "row",
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    leftMessage: {
        justifyContent: "flex-start",
    },
    rightMessage: {
        justifyContent: "flex-end",
    },
    bubble: {
        maxWidth: "70%",
        borderRadius: 18,
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
});