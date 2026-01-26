import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { ThemedText as Text } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type BlockButtonProps = {
    onPress: () => void;
    title?: string;
    lightBackgroundColour?: string;
    darkBackgroundColour?: string;
};

export function BlockButton({ onPress, title, lightBackgroundColour, darkBackgroundColour }: BlockButtonProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const background = useThemeColor({ light: lightBackgroundColour, dark: darkBackgroundColour, }, 'tint');
    
    const textColour = (lightBackgroundColour || darkBackgroundColour) ? Colors[colorScheme].text : '#FFF';

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[ styles.container, { backgroundColor: background } ]}>
                    <Text type="button" style={{ color: textColour }}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderRadius: 14,
        paddingVertical: 14,
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