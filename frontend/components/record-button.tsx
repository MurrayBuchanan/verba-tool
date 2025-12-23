import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/haptic-feedback';
import { ThemedText as Text } from '@/components/themed-text';
import { usePressedAnimation } from '@/hooks/use-pressed-animation';
import { uploadRecording } from '@/services/upload-service';

export const RecordButton = () => {
  const { scaleAnim, opacityAnim, handlePressIn, handlePressOut } = usePressedAnimation();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const [isProcessing, setIsProcessing] = useState(false);

  // Request microphone permission
  useEffect(() => {
    (async () => {
      const { status } = await AudioModule.requestRecordingPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access microphone denied");
        return;
      }
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
    })();
  }, []);

  // Start audio recording
  const startRecording = async () => {
    if (isProcessing) return;

    try {
      await recorder.prepareToRecordAsync();
      recorder.record();
      console.log("Started recording!");
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  // Stop audio recording and upload
  const stopRecording = async () => {
    try {
      await recorder.stop();
      console.log("Ended recording!");

      if (recorder.uri) {
        setIsProcessing(true);
        await uploadRecording(recorder.uri);
        setIsProcessing(false);
      } else {
        console.error("Failed to retrieve recording URI");
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const onPress = () => {
    if (isProcessing) return;
    recorderState.isRecording ? stopRecording() : startRecording();
  };

  const getLabel = () => {
    if (isProcessing) return 'Processing';
    return recorderState.isRecording ? 'Tap to stop' : 'Tap to start';
  };

  return (
    <HapticTab
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.container,
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.label}>{getLabel()}</Text>
        </View>
      </Animated.View>
    </HapticTab>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#371B34',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});