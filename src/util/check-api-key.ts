import { Clockify } from '../sdk';
import { Config } from './config';
import { Context } from './context';
import { GlobalState } from './global-state';

/**
 * Check if API key is set.
 *
 * If API key is set, authenticate SKD, otherwise reset context & global state
 */
export function checkApiKey() {
	const apiKey = Config.get<string>('apiKey');

	if (!apiKey) {
		GlobalState.set('selectedWorkspace', null);
		GlobalState.set('selectedClient', null);
		GlobalState.set('selectedProject', null);
		Context.set('workspaces:selected', false);
		Context.set('clients:selected', false);
		Context.set('projects:selected', false);
	}

	Clockify.authenticate(apiKey);
}
