import * as React from 'react';
import { Platform } from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

type HapticFeedbackProps = React.PropsWithChildren<BottomTabBarButtonProps & {
    hapticsEnabled?: boolean;
}>;

export function HapticFeedback({ hapticsEnabled = true, onPressIn, ...rest }: HapticFeedbackProps) {
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