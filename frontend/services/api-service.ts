import axios, { AxiosInstance } from 'axios';
import { getUserId } from '@/services/authentication-service';

const API_URL = process.env.EXPO_PUBLIC_API_URL || "";
const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN || "";

// Create an instance of axios with the API URL and default headers
export const apiService: AxiosInstance = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Add API token and user id to all headers
apiService.interceptors.request.use(async (config) => {
	config.headers.Authorisation = API_TOKEN;

	const userId = await getUserId();
	if (userId) {
		config.headers['User-Id'] = userId;
	}
	return config;
});