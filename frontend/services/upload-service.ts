import { apiService } from '@/services/api-service';

export async function uploadRecording(profileId: number, audioUri: string, createdAt: Date) {
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
				'Profile-Id': String(profileId),
				'Created-At': createdAt.toISOString(),
				'Content-Type': undefined,
			},
		});
		console.log('Upload successful:', response.data);
		return response.data;
	} catch (error: any) {
		console.error('Error: Cannot upload audio file', error.message);
		throw error;
	}
}