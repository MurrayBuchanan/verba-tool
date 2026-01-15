import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { ThemedText as Text } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export type BlockButtonProps = {
    onPress: () => void;
    title?: string;
    lightBackgroundColor?: string;
    darkBackgroundColor?: string;
};

export function BlockButton({ onPress, title, lightBackgroundColor='#7F4178', darkBackgroundColor='#371B34' }: BlockButtonProps) {
    const background = useThemeColor({ light: lightBackgroundColor, dark: darkBackgroundColor, }, 'tint');
    const text = useThemeColor({ light: '#FFF', dark: '#0B1220' }, 'text');

    return (
        < TouchableOpacity onPress={onPress}>
            <View
                style={[ styles.container, { backgroundColor: background } ]}>
                    <Text type="button" style={{ color: text }}>{title}</Text>
            </View>
        </ TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});