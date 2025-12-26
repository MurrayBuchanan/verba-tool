import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";

// Ensures the in-app browser is properly completed/closed
WebBrowser.maybeCompleteAuthSession();

// App registration identifiers from Microsoft Entra 
const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID || "";
const TENANT_ID = process.env.EXPO_PUBLIC_TENANT_ID || "";
const TENANT_DOMAIN = process.env.EXPO_PUBLIC_TENANT_DOMAIN || "";
const SCHEME = process.env.EXPO_PUBLIC_SCHEME || "";

// Authority URL for Microsoft Entra
const ISSUER = `https://${TENANT_DOMAIN}/${TENANT_ID}/v2.0`;

// Starts the sign-in process via the hosted Entra External ID user flow UI using Authorisation codes + PKCE 
export async function signIn() {
  const discovery = await AuthSession.fetchDiscoveryAsync(ISSUER);
  const redirectUri = AuthSession.makeRedirectUri({ scheme: SCHEME, path: "auth" });

  // Create the authentication request
  const request = new AuthSession.AuthRequest({
    clientId: CLIENT_ID,
    redirectUri,
    responseType: AuthSession.ResponseType.Code,
    usePKCE: true,
    scopes: ["openid", "profile", "email"],
  });

  // Launch system browser
  const result = await request.promptAsync(discovery);
  // Handle user cancellation
  if (result.type !== "success") {
    return null;
  }

  // Exchange the authorisation code for tokens
  const tokenResponse = await new AuthSession.AccessTokenRequest({
    clientId: CLIENT_ID,
    code: result.params.code, // Authorisation code
    redirectUri,
    extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
  }).performAsync({ tokenEndpoint: discovery.tokenEndpoint });

  // Store ID token securely for future authenticated requests
  if (tokenResponse.idToken) {
    await SecureStore.setItemAsync("id_token", tokenResponse.idToken);
  }
  return tokenResponse;
}

// Get stored ID token
export async function getIdToken() {
  return SecureStore.getItemAsync("id_token");
}