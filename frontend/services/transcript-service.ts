import { TranscriptWithFeatures, TranscriptWithSegments } from '@/constants/interfaces';
import { apiService } from '@/services/api-service';

export async function getTranscripts(profileId: number): Promise<TranscriptWithFeatures[]> {
	try {
		const response = await apiService.get(`/transcripts?profile_id=${profileId}`);
		
		if (response.data && response.data.transcripts) {
			return response.data.transcripts;
		}
		return [];
	} catch (error) {
		throw error;
	}
}

export async function getTranscript(transcriptId: number): Promise<TranscriptWithSegments> {
	try {
		const response = await apiService.get(`/transcripts/${transcriptId}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function deleteTranscript(transcriptId: number): Promise<void> {
	try {
		await apiService.delete(`/transcripts/${transcriptId}`);
	} catch (error) {
		throw error;
	}
}