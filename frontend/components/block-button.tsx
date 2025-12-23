import React from 'react';
import { Animated, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

import { ThemedText as Text } from '@/components/themed-text';
import { usePressedAnimation } from '@/hooks/use-pressed-animation';

export type BlockButtonProps = {
    onPress: () => void;
    title?: string;
    icon?: React.ReactNode;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
};

export function BlockButton({
    onPress,
    title,
    icon,
    color='white',
    backgroundColor='black',
    borderColor,
    fullWidth = true,
    style,
}: BlockButtonProps) {
    const { scaleAnim, opacityAnim, handlePressIn, handlePressOut } = usePressedAnimation();

    return (
        <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1}>
            <Animated.View
                style={[
                    styles.container,
                    {
                        width: fullWidth ? '100%' : 'auto',
                        marginVertical: fullWidth ? 5 : 0,
                        backgroundColor,
                        borderColor,
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                    },
                    style as any,
                ]}
            >
                <View style={styles.content}>
                    {icon}
                    {icon && title && <View style={styles.conditionalGap} />}
                    <Text type="button" lightColor={color} darkColor={color}>
                        {title}
                    </Text>
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