import * as React from 'react';
import { Platform } from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

type HapticTabProps = React.PropsWithChildren<BottomTabBarButtonProps & {
  hapticsEnabled?: boolean;
}>;

export function HapticTab({
  hapticsEnabled = true,
  onPressIn,
  ...rest
}: HapticTabProps) {
  return (
    <PlatformPressable
      {...rest}
      onPressIn={(ev) => {
        if (hapticsEnabled && Platform.OS === 'ios') {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPressIn?.(ev);
      }}
    />
  );
}