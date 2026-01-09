import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import React, { useEffect, useState } from 'react';

import { BlockButton } from '@/components/block-button';
import { uploadRecording } from '@/services/upload-service';

export const RecordButton = () => {
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
			console.error("Error: Failed to start recording", error);
		}
	};

	// Stop audio recording and upload
	const stopRecording = async () => {
		try {
			await recorder.stop();
			console.log("Ended recording!");

			if (!recorder.uri) {
				throw new Error("Failed to retrieve recording URI");
			}

			setIsProcessing(true);
			await uploadRecording(recorder.uri);
		} catch (error) {
			console.error("Error: Failed to stop recording", error);
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
		return recorderState.isRecording ? 'Stop Recording' : 'Start Recording';
	};

	const isActive = recorderState.isRecording || isProcessing;

	return (
		<BlockButton 
			onPress={onPress} 
			title={getLabel()}
			lightBackgroundColor={isActive ? '#2458B8' : '#2F6FE4'}
			darkBackgroundColor={isActive ? '#3F6FE0' : '#5A8DFF'}
		/>
	);
};