import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { BlockButton } from '@/components/block-button';
import { upload } from '@/services/upload-service';
import { useProfile } from '@/context/ProfileContext';
import { useThemeColor } from '@/hooks/use-theme-color';

export const RecordButton = () => {
	const { profileId } = useProfile();
	const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
	const recorderState = useAudioRecorderState(recorder);
	const [isProcessing, setIsProcessing] = useState(false);
	const [createdAt, setCreatedAt] = useState<Date | null>(null);
	const accentColour = useThemeColor({}, 'accent');
	const warningColour = useThemeColor({}, 'warning');
	const meanColour = useThemeColor({}, 'meanColour');

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
			setCreatedAt(new Date());
			console.log("Started recording!");
		} catch {
			Alert.alert("Failed to start recording");
		}
	};

	// Stop audio recording and upload
	const stopRecording = async () => {
		try {
			await recorder.stop();

			if (!recorder.uri || !createdAt) {
				throw new Error("Failed to get recording URI or timestamp");
			}

			setIsProcessing(true);
			await upload(profileId, recorder.uri, createdAt);
			setCreatedAt(null);
		} catch {
			console.log("Failed to upload recording");
		} finally {
			setIsProcessing(false);
		}
	};

	const onPress = () => {
		if (isProcessing) return;
		recorderState.isRecording ? stopRecording() : startRecording();
	};

	const getLabel = () => {
		if (isProcessing) return 'Processing';
		return recorderState.isRecording ? 'End Recording' : 'Start Recording';
	};

	const getButtonColour = () => {
		if (isProcessing) {
			return meanColour;
		}
		if (recorderState.isRecording) {
			return warningColour;
		}
		return accentColour;
	};
	
	const buttonColour = getButtonColour();

	return <BlockButton onPress={onPress} title={getLabel()} lightColour={buttonColour} darkColour={buttonColour} />
};
