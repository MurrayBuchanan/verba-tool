import type { Profile } from "@/constants/interfaces";

export function profileDisplayName(profile: Pick<Profile, "first_name" | "last_name">): string {
	return [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim();
}
