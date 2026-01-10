import axios from 'axios';
import { Transcript } from '@/constants/transcript';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;

export async function getTranscripts(userId: number): Promise<Transcript[]> {
	if (!API_URL || !API_TOKEN) {
		throw new Error('Error: Environment variables must be set for the API URL and token');
	}

	try {
		const endpoint = API_URL + `/transcripts/${userId}`;
		const response = await axios.get(endpoint, { headers: { Authorization: `Bearer ${API_TOKEN}` }});
		
		if (response.data && response.data.transcripts) {
			return response.data.transcripts;
		}
		return [];
	} catch (error) {
		throw error;
	}
}

export async function getTranscript(userId: number, transcriptId: number): Promise<Transcript> {
	if (!API_URL || !API_TOKEN) {
		throw new Error('Error: Environment variables must be set for the API URL and token');
	}

	try {
		const endpoint = API_URL + `/transcripts/${userId}/${transcriptId}`;
		const response = await axios.get(endpoint, { headers: { Authorization: `Bearer ${API_TOKEN}` }});
		return response.data;
	} catch (error) {
		throw error;
	}
}
