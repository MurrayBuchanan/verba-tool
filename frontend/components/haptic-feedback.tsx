import { Platform } from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

// This file was generated and modified from the Expo boilerplate using 'npx create-expo-app'

type Props = BottomTabBarButtonProps & {
	hapticsEnabled?: boolean;
};

export function HapticFeedback({ hapticsEnabled = true, onPressIn, ...rest }: Props) {
  	return (
    	<PlatformPressable
      	{...rest}
      	onPressIn={(ev) => {
        	if (hapticsEnabled && Platform.OS === 'ios') {
          		void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        	}
        	onPressIn?.(ev);
      	}}/>
  	);
}