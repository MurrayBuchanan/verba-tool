import { useState, useRef } from 'react';
import { Animated } from 'react-native';

interface UsePressedAnimationProps {
  scaleTo?: number;
  opacityTo?: number;
  duration?: number;
}

export const usePressedAnimation = ({
  scaleTo = 0.95,
  opacityTo = 1,
  duration = 100
}: UsePressedAnimationProps = {}) => {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: scaleTo,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: opacityTo,
        duration,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      })
    ]).start();
  };

  return {
    isPressed,
    scaleAnim,
    opacityAnim,
    handlePressIn,
    handlePressOut,
  };
}; 