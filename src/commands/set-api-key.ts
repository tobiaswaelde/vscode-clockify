import { Clockify } from '../sdk';
import { Config } from '../util/config';
import { Context } from '../util/context';
import { Dialogs } from '../util/dialogs';
import { refresh } from './refresh';

export async function setApiKey() {
	// ask user for the api key
	const apiKey = await Dialogs.askForApiKey();
	if (!apiKey) {
		Context.set('initialized', false);
		return;
	}

	// set API key in config
	Config.set('apiKey', apiKey, true);

	// authenticate the SDK
	Clockify.authenticate(apiKey);

	// refresh tree view providers
	refresh();

	Context.set('initialized', true);
}
