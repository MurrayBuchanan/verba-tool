import { TranscriptWithFeatures, TranscriptWithSegments } from '@/constants/transcript';
import { apiService } from '@/services/api-service';

export async function getTranscripts(userId: string): Promise<TranscriptWithFeatures[]> {
	try {
		const response = await apiService.get(`/transcripts/${userId}`);
		
		if (response.data && response.data.transcripts) {
			return response.data.transcripts;
		}
		return [];
	} catch (error) {
		throw error;
	}
}

export async function getTranscript(userId: string, transcriptId: number): Promise<TranscriptWithSegments> {
	try {
		const response = await apiService.get(`/transcripts/${userId}/${transcriptId}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}
