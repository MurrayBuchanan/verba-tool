import { apiService } from '@/services/api-service';
import { Profile } from '@/constants/interfaces';

export async function getProfiles(): Promise<Profile[]> {
	try {
		const response = await apiService.get(`/profiles`);

		if (response.data && response.data.profiles) {
			return response.data.profiles;
		}
		return [];
	} catch (error) {
		throw error;
	}
}

export async function createProfile(payload: Profile): Promise<Profile> {
	try {
		const response = await apiService.post(`/profiles`, payload);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function updateProfile(profileId: number, payload: Profile): Promise<Profile> {
	try {
		const response = await apiService.put(`/profiles/${profileId}`, payload);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function deleteProfile(profileId: number): Promise<void> {
	try {
		await apiService.delete(`/profiles/${profileId}`);
	} catch (error) {
		throw error;
	}
}