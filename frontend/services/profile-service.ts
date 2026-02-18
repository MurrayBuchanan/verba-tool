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

export async function getProfile(profileId: number): Promise<Profile> {
	const response = await apiService.get(`/profiles/${profileId}`);
	return response.data;
}

export async function createProfile(profile: Profile): Promise<Profile> {
	try {
		const response = await apiService.post(`/profiles`, profile);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function updateProfile(profileId: number, profile: Profile): Promise<Profile> {
	try {
		const response = await apiService.put(`/profiles/${profileId}`, profile);
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