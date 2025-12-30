import React from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText as Text } from '@/components/themed-text';
import { usePressedAnimation } from '@/hooks/use-pressed-animation';

export type BlockButtonProps = {
    onPress: () => void;
    title?: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
};

export function BlockButton({ onPress, title, color='white', backgroundColor='black', borderColor='black' }: BlockButtonProps) {
    const { scaleAnim, opacityAnim, handlePressIn, handlePressOut } = usePressedAnimation();

    return (
        <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Animated.View
                style={[ styles.container, { backgroundColor, borderColor, transform: [{ scale: scaleAnim }], opacity: opacityAnim } ]}>
                <View style={styles.content}>
                    <Text type="button" lightColor={color} darkColor={color}>{title}</Text>
                </View>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderWidth: 0.5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});