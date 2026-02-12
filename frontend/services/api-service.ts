import axios, { AxiosInstance } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { getToken } from '@/services/authentication-service';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;

if (!API_URL) {
	throw new Error('API URL environment variable must be set');
}

export const apiService: AxiosInstance = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Add API token and user id to headers
apiService.interceptors.request.use(async (config) => {
	config.headers.Authorisation = API_TOKEN;
	const token = await getToken();
	if (token) {
		const decoded = jwtDecode<{ sub?: string }>(token);
		if (decoded.sub) {
				config.headers['User-Id'] = decoded.sub;
		}
	}
	return config;
});