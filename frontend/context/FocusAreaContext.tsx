import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { getAccount, updateAccountFocusArea } from "@/services/account-service";
import { useAuthentication } from "@/context/SessionContext";

type FocusAreaContextValue = {
	focusAreaId: string | null;
	setFocusAreaId: (id: string) => Promise<void>;
	isLoading: boolean;
};

const FocusAreaContext = createContext<FocusAreaContextValue | null>(null);

export function FocusAreaProvider({ children }: { children: ReactNode }) {
	const { session, isLoading: authLoading } = useAuthentication();
	const [focusAreaId, setFocusAreaIdState] = useState<string | null>(null);
	const [accountSyncing, setAccountSyncing] = useState(false);

	useEffect(() => {
		if (authLoading) {
			return;
		}
		if (!session) {
			setFocusAreaIdState(null);
			setAccountSyncing(false);
			return;
		}
		let cancelled = false;
		setAccountSyncing(true);
		getAccount()
			.then((acc) => {
				if (!cancelled) {
					setFocusAreaIdState(acc.focus_area_id ?? null);
				}
			})
			.catch(() => {
				if (!cancelled) {
					setFocusAreaIdState(null);
				}
			})
			.finally(() => {
				if (!cancelled) {
					setAccountSyncing(false);
				}
			});
		return () => {
			cancelled = true;
		};
	}, [session, authLoading]);

	const setFocusAreaId = useCallback(async (id: string) => {
		const acc = await updateAccountFocusArea(id);
		setFocusAreaIdState(acc.focus_area_id ?? null);
	}, []);

	const isLoading = authLoading || (!!session && accountSyncing);

	return (
		<FocusAreaContext.Provider value={{ focusAreaId, setFocusAreaId, isLoading }}>
			{children}
		</FocusAreaContext.Provider>
	);
}

export function useFocusArea() {
	const context = useContext(FocusAreaContext);
	if (!context) {
		throw new Error("useFocusArea must be used within a FocusAreaProvider");
	}
	return context;
}
