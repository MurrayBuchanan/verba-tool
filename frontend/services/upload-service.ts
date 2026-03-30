import { getUserId } from "@/services/authentication-service";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "";
const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN || "";

export async function upload(profileId: number, audioUri: string, createdAt: Date) {
	const formData = new FormData();
	formData.append("file", {
		uri: audioUri,
		type: "audio/m4a",
		name: "conversation-recording.m4a"
	} as any);

	const headers: Record<string, string> = {
		Authorisation: API_TOKEN,
		"Profile-Id": String(profileId),
		"Created-At": createdAt.toISOString(),
	};
	const userId = await getUserId();
	if (userId) {
		headers["UserID"] = userId;
	}

	const response = await fetch(`${API_URL}/upload`, { method: "POST", headers, body: formData });
	const data: Record<string, unknown> = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(String(data.detail ?? `Upload failed (${response.status})`));
	}

	return data;
}