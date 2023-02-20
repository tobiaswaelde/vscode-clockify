import { Clockify } from '../sdk';
import { Config } from '../util/config';
import { Context } from '../util/context';
import { Dialogs } from '../util/dialogs';
import { TreeView } from '../views/treeview';

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
	TreeView.refresh();

	Context.set('initialized', true);
}
