import { apiService } from '@/services/api-service';

export async function uploadRecording(profileId: number, audioUri: string, createdAt: Date) {
	
	// Send audio as a FormData object
	const formData = new FormData();
	formData.append('file', {
		uri: audioUri,
		type: 'audio/m4a',
		name: 'conversation-recording.m4a'
	} as any);

	// Upload recording to API
	const response = await apiService.post('/upload', formData, {
		timeout: 1000 * 60 * 10,
		headers: {
			'Profile-Id': String(profileId),
			'Created-At': createdAt.toISOString(),
			'Content-Type': undefined
		}
	});
	return response.data;
}