import React from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText as Text } from '@/components/themed-text';
import { usePressedAnimation } from '@/hooks/use-pressed-animation';
import { useThemeColor } from '@/hooks/use-theme-color';

export type BlockButtonProps = {
    onPress: () => void;
    title?: string;
    disabled?: boolean;
    lightTextColor?: string;
    darkTextColor?: string;
    lightBackgroundColor?: string;
    darkBackgroundColor?: string;
    lightBorderColor?: string;
    darkBorderColor?: string;
};

export function BlockButton({
    onPress,
    title,
    disabled=false,
    lightTextColor = '#FFF',
    darkTextColor = '#FFF',
    lightBackgroundColor='#7F4178',
    darkBackgroundColor='#371B34',
    lightBorderColor='#371B34',
    darkBorderColor='#7F4178',
}: BlockButtonProps) {
    const { scaleAnim, opacityAnim, handlePressIn, handlePressOut } = usePressedAnimation();

    const background = useThemeColor({ light: lightBackgroundColor, dark: darkBackgroundColor, }, 'tint');
    const border = useThemeColor({ light: lightBorderColor, dark: darkBorderColor }, 'tint');
    const text = useThemeColor({ light: lightTextColor, dark: darkTextColor }, 'text');

    return (
        <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={disabled}>
            <Animated.View
                style={[ styles.container, 
                    { 
                        backgroundColor: background, 
                        borderColor: border, 
                        transform: [{ scale: scaleAnim }], 
                        opacity: disabled ? 0.5 : opacityAnim 
                    } 
                ]}>
                <View style={styles.content}>
                    <Text type="button" lightColor={text} darkColor={text}>{title}</Text>
                </View>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderRadius: 30,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderWidth: 1,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});