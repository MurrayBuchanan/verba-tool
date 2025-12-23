import React from 'react';
import { Animated, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

import { ThemedText as Text } from '@/components/themed-text';
import { usePressedAnimation } from '@/hooks/use-pressed-animation';

export type ProfileButtonProps = {
    onPress: () => void;
    firstName: string;
    lastName: string;
    lastUpdated: string;
    style?: StyleProp<ViewStyle>;
};

export function ProfileButton({
    onPress,
    firstName,
    lastName,
    lastUpdated,
    style,
}: ProfileButtonProps) {
    const { scaleAnim, opacityAnim, handlePressIn, handlePressOut } = usePressedAnimation();

    return (
        <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1}>
            <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }, style as any ]}>
                <View style={styles.content}>
                    <Text type="button">{firstName} {lastName}</Text>
                    <Text type="caption">Last Updated: {lastUpdated}</Text>
                </View>
            </Animated.View>
        </TouchableOpacity>
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
    conditionalGap: {
        marginRight: 8,
    },
});