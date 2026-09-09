import { Clockify } from '../sdk';
import { ApiKey } from '../util/api-key';
import { Context } from '../util/context';
import { GlobalState } from '../util/global-state';

/**
 * Check if API key is set.
 *
 * If API key is set, authenticate SKD, otherwise reset context & global state
 */
export async function checkApiKey(): Promise<boolean> {
	const apiKey = await ApiKey.get();
	const isConfigured = Boolean(apiKey);
	await Context.set('apiKeySet', isConfigured);

	if (!apiKey) {
		Clockify.authenticate(undefined);
		await Promise.all([
			Context.set('initialized', false),
			GlobalState.set('initialized', false),

			GlobalState.set('selectedWorkspace', null),
			GlobalState.set('selectedClient', null),
			GlobalState.set('selectedProject', null),
			Context.set('workspaces:selected', false),
			Context.set('clients:selected', false),
			Context.set('projects:selected', false),
		]);
		return false;
	}

	Clockify.authenticate(apiKey);
	await Promise.all([
		Context.set('initialized', true),
		GlobalState.set('initialized', true),
	]);
	return true;
}
