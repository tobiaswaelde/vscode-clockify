import { Config } from '../util/config';

export function apiKeySet(): boolean {
	const apiKey = Config.get<string>('apiKey');
	return apiKey !== undefined && apiKey !== '';
}
