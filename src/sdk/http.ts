import axios, { AxiosInstance } from 'axios';

import { RateLimitError, showError } from './util';

/**
 * Create a cancellable Clockify client that rejects requests during rate-limit cooldowns.
 * Requests, including writes, are never automatically retried.
 * @param {AbortSignal} signal Cancels requests when credentials change.
 * @returns {AxiosInstance} The client with a shared cooldown for all endpoints.
 */
export function createHttpClient(signal: AbortSignal): AxiosInstance {
	const http = axios.create({ baseURL: 'https://api.clockify.me/api/v1', signal });
	let retryAt = 0;
	let failures = 0;

	http.interceptors.request.use((config) => {
		if (Date.now() < retryAt) {
			throw new RateLimitError();
		}
		return config;
	});
	http.interceptors.response.use(
		(response) => {
			if (Date.now() >= retryAt) {
				failures = 0;
			}
			return response;
		},
		(error: unknown) => {
			if (axios.isAxiosError(error) && error.response?.status === 429) {
				const now = Date.now();
				const alreadyPaused = now < retryAt;
				const header = error.response.headers['retry-after'];
				const value = typeof header === 'string' ? header.trim() : String(header ?? '');
				const seconds = /^\d+(?:\.\d+)?$/.test(value) ? Number(value) : NaN;
				const date = Number.isNaN(seconds) ? Date.parse(value) : NaN;
				const delay = Number.isFinite(seconds * 1000)
					? seconds * 1000
					: date > now
						? date - now
						: Math.min(30000 * 2 ** Math.min(failures, 4), 300000);
				failures++;
				retryAt = Math.max(retryAt, now + delay);
				if (!alreadyPaused) {
					showError('Clockify API rate limit reached. Requests are temporarily paused; tracking will sync automatically.');
				}
				throw new RateLimitError();
			}
			throw error;
		}
	);
	return http;
}
