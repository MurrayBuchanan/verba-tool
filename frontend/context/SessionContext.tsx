import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { router } from 'expo-router';
import { getToken, signIn, signOut } from '@/services/authentication-service';

interface SessionContext {
	signIn: () => Promise<void>;
	signOut: () => Promise<void>;
	session: string | null;
	isLoading: boolean;
}

const SessionContext = createContext<SessionContext | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getToken()
			.then(setSession)
			.catch(() => {
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
		router.replace('/');
	};

	return (
		<SessionContext.Provider value={{ signIn: handleSignIn, signOut: handleSignOut, session, isLoading }}>
			{children}
		</SessionContext.Provider>
	);
}

export function useAuthentication() {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error('useAuthentication must be used within a SessionProvider');
	}
	return context;
}