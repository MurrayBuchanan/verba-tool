import { Intervention } from "@/constants/interfaces";
import { apiService } from "@/services/api-service";

export async function getInterventions(profileId: number): Promise<Intervention[]> {
	try {
		const response = await apiService.get(`/interventions?profile_id=${profileId}`);
		
		if (response.data && response.data.interventions) {
			return response.data.interventions;
		}
		return [];
	} catch (error) {
		throw error;
	}
}

export async function getIntervention(interventionId: number): Promise<Intervention> {
	try {
		const response = await apiService.get(`/interventions/${interventionId}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function createIntervention(intervention: Intervention): Promise<Intervention> {
	try {
		const response = await apiService.post(`/interventions`, intervention);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function updateIntervention(interventionId: number, intervention: Intervention): Promise<Intervention> {
	try {
		const response = await apiService.put(`/interventions/${interventionId}`, intervention);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function deleteIntervention(interventionId: number): Promise<void> {
	try {
		await apiService.delete(`/interventions/${interventionId}`);
	} catch (error) {
		throw error;
	}
}