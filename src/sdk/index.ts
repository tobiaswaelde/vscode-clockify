import axios from 'axios';

export const http = axios.create({
	baseURL: 'https://api.clockify.me/api/v1',
});

/**
 * Authenticate using API key
 * @param {string} apiKey The API key, `undefined` to remove authentication
 */
export function authenticate(apiKey: string | undefined) {
	http.defaults.headers.common['X-Api-Key'] = apiKey;
}
