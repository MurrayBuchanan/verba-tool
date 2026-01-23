import { apiService } from '@/services/api-service';

export async function uploadRecording(audioUri: string, createdAt: Date) {
	const formData = new FormData();
	formData.append('file', {
		uri: audioUri,
		type: 'audio/m4a',
		name: 'conversation-recording.m4a',
	} as any);

	try {
		const response = await apiService.post('/upload', formData, {
			timeout: 1000 * 60 * 10,
			headers: {
				'Content-Type': undefined,
				'Created-At': createdAt.toISOString(),
			},
		});
		console.log('Upload successful:', response.data);
		return response.data;
	} catch (error: any) {
		console.error('Error: Cannot upload audio file', error.message);
		throw error;
	}
}