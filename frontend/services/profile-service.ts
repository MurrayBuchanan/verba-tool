import { apiService } from "@/services/api-service";
import { getUserId } from "@/services/authentication-service";
import { Profile } from "@/constants/interfaces";

const API_URL = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");
const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN || "";

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

/** Uses fetch so multipart boundaries are set correctly in React Native. */
export async function uploadProfilePicture(profileId: number, localUri: string): Promise<Profile> {
	const userId = await getUserId();
	const formData = new FormData();
	const lower = localUri.toLowerCase();
	const name = lower.endsWith(".png") ? "photo.png" : lower.endsWith(".webp") ? "photo.webp" : "photo.jpg";
	const type = name.endsWith(".png") ? "image/png" : name.endsWith(".webp") ? "image/webp" : "image/jpeg";
	formData.append("file", { uri: localUri, name, type } as unknown as Blob);
	const headers: Record<string, string> = { Authorisation: API_TOKEN };
	if (userId) {
		headers.UserID = userId;
	}
	const res = await fetch(`${API_URL}/profiles/${profileId}/picture`, {
		method: "POST",
		headers,
		body: formData,
	});
	if (!res.ok) {
		throw new Error("Upload failed");
	}
	return res.json() as Promise<Profile>;
}

export async function deleteProfilePicture(profileId: number): Promise<Profile> {
	const userId = await getUserId();
	const headers: Record<string, string> = { Authorisation: API_TOKEN };
	if (userId) {
		headers.UserID = userId;
	}
	const res = await fetch(`${API_URL}/profiles/${profileId}/picture`, {
		method: "DELETE",
		headers,
	});
	if (!res.ok) {
		throw new Error("Delete picture failed");
	}
	return res.json() as Promise<Profile>;
}