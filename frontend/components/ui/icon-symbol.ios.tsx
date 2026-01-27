import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

// This file was generated and modified from the Expo boilerplate using 'npx create-expo-app'

export type IconSymbolProps = {
	name: SymbolViewProps['name'];
	size?: number;
	color: string;
	style?: StyleProp<ViewStyle>;
	weight?: SymbolWeight;
};
export function IconSymbol({name, size = 24, color, style, weight = 'regular'}: IconSymbolProps) {
	return <SymbolView weight={weight} tintColor={color} resizeMode="scaleAspectFit" name={name} style={[{ width: size, height: size }, style ]} />;
}