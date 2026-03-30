import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { jwtDecode } from "jwt-decode";

/*
Authentication Service to authenticate users
• Documentation: https://github.com/expo/examples/blob/master/with-auth0
*/

// Ensures the in-app browser is properly completed/closed
WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID || "";
const TENANT_ID = process.env.EXPO_PUBLIC_TENANT_ID || "";
const TENANT_DOMAIN = process.env.EXPO_PUBLIC_TENANT_DOMAIN || "";
const SCHEME = process.env.EXPO_PUBLIC_SCHEME || "";

const domain = `https://${TENANT_DOMAIN}/${TENANT_ID}/v2.0`;

export async function signIn() {
	const discovery = await AuthSession.fetchDiscoveryAsync(domain);
	const redirectUrl = AuthSession.makeRedirectUri({ scheme: SCHEME, path: "auth" });

	const request = new AuthSession.AuthRequest({
		clientId: CLIENT_ID,
		redirectUri: redirectUrl,
		responseType: AuthSession.ResponseType.Code,
		usePKCE: true,
		scopes: ["openid", "profile"],
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
		redirectUri: redirectUrl,
		extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
	}).performAsync({ tokenEndpoint: discovery.tokenEndpoint });

	if (tokenResponse.idToken) {
		await SecureStore.setItemAsync("token", tokenResponse.idToken);
	}
	return tokenResponse;
}

export async function getToken(): Promise<string | null> {
	const token = await SecureStore.getItemAsync("token");
	if (!token) {
		return null;
	}
	return token;
}

export async function getUserId(): Promise<string | null> {
	const token = await getToken();
	if (!token) {
		return null;
	}
	const decoded = jwtDecode<{ sub?: string }>(token);
	return decoded.sub ?? null;
}

export async function signOut() {
	await SecureStore.deleteItemAsync("token");
}