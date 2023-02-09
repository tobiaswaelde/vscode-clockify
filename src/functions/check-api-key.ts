import { Clockify } from '../sdk';
import { Config } from '../util/config';
import { Context } from '../util/context';
import { GlobalState } from '../util/global-state';

/**
 * Check if API key is set.
 *
 * If API key is set, authenticate SKD, otherwise reset context & global state
 */
export function checkApiKey() {
	const apiKey = Config.get<string>('apiKey');

	if (!apiKey || apiKey === '') {
		Context.set('initialized', false);
		GlobalState.set('initialized', false);

		GlobalState.set('selectedWorkspace', null);
		GlobalState.set('selectedClient', null);
		GlobalState.set('selectedProject', null);
		Context.set('workspaces:selected', false);
		Context.set('clients:selected', false);
		Context.set('projects:selected', false);
		return;
	}

	Context.set('apiKey', apiKey);
	Clockify.authenticate(apiKey);
	Context.set('initialized', true);
	GlobalState.set('initialized', true);
}
