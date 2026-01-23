import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { jwtDecode } from "jwt-decode";

// Ensures the in-app browser is properly completed/closed
WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID || "";
const TENANT_ID = process.env.EXPO_PUBLIC_TENANT_ID || "";
const TENANT_DOMAIN = process.env.EXPO_PUBLIC_TENANT_DOMAIN || "";
const SCHEME = process.env.EXPO_PUBLIC_SCHEME || "";

const ISSUER = `https://${TENANT_DOMAIN}/${TENANT_ID}/v2.0`;

export async function signIn() {
	const discovery = await AuthSession.fetchDiscoveryAsync(ISSUER);
	const redirectUri = AuthSession.makeRedirectUri({ scheme: SCHEME, path: "auth" });

	const request = new AuthSession.AuthRequest({
		clientId: CLIENT_ID,
		redirectUri,
		responseType: AuthSession.ResponseType.Code,
		usePKCE: true,
		scopes: ["openid", "profile", "offline_access"],
	});

	// Launch system browser
	const result = await request.promptAsync(discovery);
	
	// Handle user cancellation
	if (result.type !== "success") {
		return null;
	}

	const tokenResponse = await new AuthSession.AccessTokenRequest({
		clientId: CLIENT_ID,
		code: result.params.code,
		redirectUri,
		extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
	}).performAsync({ tokenEndpoint: discovery.tokenEndpoint });

	if (tokenResponse.idToken) {
		await SecureStore.setItemAsync("token", tokenResponse.idToken);
	}
	if (tokenResponse.refreshToken) {
		await SecureStore.setItemAsync("refresh_token", tokenResponse.refreshToken);
	}
	return tokenResponse;
}

function hasExpired(token: string): boolean {
	const decoded: any = jwtDecode(token);
	const expirationTime = decoded.exp;
	const currentTime = Math.floor(Date.now() / 1000);
	return expirationTime < currentTime;
}

export async function getToken(): Promise<string | null> {
	const token = await SecureStore.getItemAsync("token");
	if (!token) {
		return null;
	}

	if (!hasExpired(token)) {
		return token;
	}

	// Refresh token since it expired
	const refreshToken = await SecureStore.getItemAsync("refresh_token");
	if (!refreshToken) {
		await SecureStore.deleteItemAsync("token");
		return null;
	}

	try {
		// Get token endpoint
		const discovery = await AuthSession.fetchDiscoveryAsync(ISSUER);
		if (!discovery.tokenEndpoint) {
			await SecureStore.deleteItemAsync("token");
			await SecureStore.deleteItemAsync("refresh_token");
			return null;
		}
		const redirectUri = AuthSession.makeRedirectUri({ scheme: SCHEME, path: "auth" });

		const formData = new URLSearchParams();
		formData.append("client_id", CLIENT_ID);
		formData.append("refresh_token", refreshToken);
		formData.append("grant_type", "refresh_token");
		formData.append("redirect_uri", redirectUri);

		// Get new token
		const response = await fetch(discovery.tokenEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: formData.toString(),
		});

		if (!response.ok) {
			await SecureStore.deleteItemAsync("token");
			await SecureStore.deleteItemAsync("refresh_token");
			return null;
		}

		const tokenResponse = await response.json();

		if (tokenResponse.id_token) {
			await SecureStore.setItemAsync("token", tokenResponse.id_token);
			if (tokenResponse.refresh_token) {
				await SecureStore.setItemAsync("refresh_token", tokenResponse.refresh_token);
			}
			return tokenResponse.id_token;
		}
		return null;
	} catch (error) {
		await SecureStore.deleteItemAsync("token");
		await SecureStore.deleteItemAsync("refresh_token");
		return null;
	}
}

export async function isAuthenticated(): Promise<boolean> {
	const token = await getToken();
	if (token) {
		return true;
	}
	return false;
}

export async function signOut() {
	await SecureStore.deleteItemAsync("token");
	await SecureStore.deleteItemAsync("refresh_token");
}