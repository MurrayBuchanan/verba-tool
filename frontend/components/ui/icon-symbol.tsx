import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

// This file was generated and modified from the Expo boilerplate using 'npx create-expo-app'

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
	'chevron.left': 'chevron-left',
	'chevron.right': 'chevron-right',
	'record.circle': 'fiber-manual-record',
	'chart.bar': 'bar-chart',
	'clock': 'access-time',
	'plus': 'add',
	'trash': 'delete',
} as IconMapping;

export type IconSymbolProps = {
	name: IconSymbolName;
	size?: number;
	color: string | OpaqueColorValue;
	style?: StyleProp<TextStyle>;
	weight?: SymbolWeight;
};

export function IconSymbol({name, size = 24, color, style}: IconSymbolProps) {
	return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}