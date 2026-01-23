import axios, { AxiosInstance } from 'axios';
import { getToken } from '@/services/authentication-service';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
	throw new Error('API URL environment variable must be set');
}

export const apiService: AxiosInstance = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Add token to headers
apiService.interceptors.request.use(async (config) => {
	const token = await getToken();
	if (token) {
		config.headers.Authorisation = `Bearer ${token}`;
	}
	return config;
});