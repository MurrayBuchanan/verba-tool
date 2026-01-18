import { Intervention } from '@/constants/transcript';
import { apiService } from '@/services/api-service';

export async function getInterventions(userId: string): Promise<Intervention[]> {
	try {
		const response = await apiService.get(`/interventions/${userId}`);
		
		if (response.data && response.data.interventions) {
			return response.data.interventions;
		}
		return [];
	} catch (error) {
		throw error;
	}
}

export async function getIntervention(userId: string, interventionId: number): Promise<Intervention> {
	try {
		const response = await apiService.get(`/interventions/${userId}/${interventionId}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function createIntervention(userId: string, intervention: Intervention): Promise<Intervention> {
	try {
		const response = await apiService.post(`/interventions/${userId}`, intervention);
		return response.data;
	} catch (error) {
		throw error;
	}
}
