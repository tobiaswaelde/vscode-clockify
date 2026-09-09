import { ApiKey } from '../util/api-key';

export async function apiKeySet(): Promise<boolean> {
	return Boolean(await ApiKey.get());
}
