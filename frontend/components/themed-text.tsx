import { StyleSheet, Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
	lightColor?: string;
	darkColor?: string;
	type?: 'default' | 'caption' | 'heading' | 'title' | 'button';
	align?: 'left' | 'center' | 'right';
};

export function ThemedText({style, lightColor, darkColor, type = 'default', align = 'left', ...rest}: ThemedTextProps) {
	const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

	return (
		<Text
		style={[
			{ color },
			type === 'default' ? styles.default : undefined,
			type === 'caption' ? styles.caption : undefined,
			type === 'heading' ? styles.heading : undefined,
			type === 'title' ? styles.title : undefined,
			type === 'button' ? styles.button : undefined,

			align === 'left' ? { textAlign: 'left' } : undefined,
			align === 'center' ? { textAlign: 'center' } : undefined,
			align === 'right' ? { textAlign: 'right' } : undefined,

			style,
		]}
		{...rest}
		/>
	);
}

const styles = StyleSheet.create({
	default: {
		fontSize: 18,
		lineHeight: 24,
		fontWeight: '400'
	},
	caption: {
		fontSize: 16,
		lineHeight: 20,
		fontWeight: '400'
	},
	heading: {  
		fontSize: 20,
		lineHeight: 24,
		fontWeight: '600',
	},
	title: {
		fontSize: 32,
		fontWeight: '600',
		lineHeight: 30,
	},
	button: {
		fontSize: 18,
		color: '#fff',
		fontWeight: '600',
	},
});