import { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileContextType {
	profileId: number;
	setProfileId: (id: number) => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
	const [profileId, setProfileId] = useState<number>(0);

	return (
		<ProfileContext.Provider value={{ profileId, setProfileId }}>
			{children}
		</ProfileContext.Provider>
	);
}

export function useProfile() {
	const context = useContext(ProfileContext);
	if (!context) {
		throw new Error('useProfile must be used within a ProfileProvider');
	}
	return context;
}
