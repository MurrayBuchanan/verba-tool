import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;

if (!API_URL || !API_TOKEN) {
	throw new Error('Error: Environment variables must be set for the API URL and token');
}

export const apiService = axios.create({
	baseURL: API_URL,
	headers: {
		Authorization: `Bearer ${API_TOKEN}`,
		'Content-Type': 'application/json',
	},
});
