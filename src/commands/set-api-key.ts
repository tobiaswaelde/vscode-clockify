import { Clockify } from '../sdk';
import { Context } from '../util/context';
import { ApiKey } from '../util/api-key';
import { Dialogs } from '../util/dialogs';
import { TreeView } from '../views/treeview';
import { checkDefaultWorkspace } from '../functions/check-default-workspace';
import { GlobalState } from '../util/global-state';

export async function setApiKey() {
	// ask user for the api key
	const apiKey = await Dialogs.askForApiKey(await ApiKey.get());
	if (!apiKey) {
		return;
	}

	// Store credentials outside user and workspace settings.
	await ApiKey.set(apiKey);

	// authenticate the SDK
	Clockify.authenticate(apiKey);
	await Promise.all([
		Context.set('apiKeySet', true),
		Context.set('initialized', true),
		GlobalState.set('initialized', true),
	]);
	await checkDefaultWorkspace();

	// refresh tree view providers
	TreeView.refresh();
}
