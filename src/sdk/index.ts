import axios, { AxiosInstance } from 'axios';

export class BaseApi {
	protected static http: AxiosInstance = axios.create({
		baseURL: 'https://api.clockify.me/api/v1',
	});

	public static authenticate(apiKey: string | null) {
		this.http.defaults.headers.common['X-Api-Key'] = apiKey;
	}
}
