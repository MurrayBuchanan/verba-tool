import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView as View } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Theme } from "@/constants/theme";

export type SpeakerSegmentProps = {
    speaker: string;
    text: string;
};

export function SpeakerSegment({ speaker, text }: SpeakerSegmentProps) {
    const backgroundColour = useThemeColor({}, 'backgroundSecondary');
    const textColour = useThemeColor({}, 'text');

    // If primary speaker (Guest-1) is speaking the message is left aligned, otherwise it is right aligned
    const isPrimarySpeaker = speaker === "Guest-1";
    
    return (
        <View style={[ styles.messageContainer, isPrimarySpeaker ? styles.isLeftAligned : styles.isRightAligned]}>
            { isPrimarySpeaker ? (
                <View lightColour={backgroundColour} darkColour={backgroundColour} style={styles.bubble}>
                    <Text lightColour={textColour} darkColour={textColour}>{text}</Text>
                </View>
            ) : (
                <View lightColour={backgroundColour} darkColour={backgroundColour} style={styles.bubble}>
                    <Text lightColour={Theme.light.text} darkColour={Theme.light.text}>{text}</Text>
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