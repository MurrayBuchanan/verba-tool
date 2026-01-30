import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getToken, signIn, signOut } from '@/services/authentication-service';

interface SessionContextType {
	signIn: () => Promise<void>;
	signOut: () => Promise<void>;
	session: string | null;
	isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getToken()
			.then(setSession)
			.catch((error: any) => {
				console.error("Cannot load session:", error);
				setSession(null);
			})
			.finally(() => setIsLoading(false));
	}, []);

	const handleSignIn = async () => {
		await signIn();
		const token = await getToken();
		setSession(token);
	};

	const handleSignOut = async () => {
		await signOut();
		setSession(null);
	};

	return (
		<SessionContext.Provider
			value={{
				signIn: handleSignIn,
				signOut: handleSignOut,
				session,
				isLoading,
			}}
		>
			{children}
		</SessionContext.Provider>
	);
}

export function useAuthentication() {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error("Requires wrapping component in a SessionProvider");
	}
	return context;
}