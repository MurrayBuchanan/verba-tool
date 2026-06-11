import { apiService } from "@/services/api-service";

export type Account = {
	focus_area_id: string | null;
};

export async function getAccount(): Promise<Account> {
	const response = await apiService.get<Account>("/account");
	return response.data;
}

export async function updateAccountFocusArea(focusAreaId: string): Promise<Account> {
	const response = await apiService.patch<Account>("/account", { focus_area_id: focusAreaId });
	return response.data;
}
