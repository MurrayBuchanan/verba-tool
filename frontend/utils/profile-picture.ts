const API_URL = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");

/** Turn API `picture_url` (e.g. /static/...) into a full URI for Image. */
export function resolveProfilePictureUrl(pictureUrl: string | null | undefined): string | null {
	if (!pictureUrl?.trim()) {
		return null;
	}
	if (pictureUrl.startsWith("http://") || pictureUrl.startsWith("https://")) {
		return pictureUrl;
	}
	const path = pictureUrl.startsWith("/") ? pictureUrl : `/${pictureUrl}`;
	return `${API_URL}${path}`;
}
