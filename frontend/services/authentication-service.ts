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

	// Create the authentication request
	const request = new AuthSession.AuthRequest({
		clientId: CLIENT_ID,
		redirectUri,
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
		redirectUri,
		extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
	}).performAsync({ tokenEndpoint: discovery.tokenEndpoint });

	if (tokenResponse.idToken) {
		await SecureStore.setItemAsync("id_token", tokenResponse.idToken);
	}
	return tokenResponse;
}

export async function getIdToken() {
  	return SecureStore.getItemAsync("id_token");
}

export async function isAuthenticated(): Promise<boolean> {
	const token = await getIdToken();
	if (token === null || token === undefined) {
		return false;
	} else {
		return true;
	}
}

export async function signOut() {
 	await SecureStore.deleteItemAsync("id_token");
}

export async function getUserId(): Promise<string> {
	const idToken = await getIdToken();
	if (!idToken) {
		throw new Error('No ID token');
	}

	const tokenData: any = jwtDecode(idToken);
	return tokenData.sub;
}