import { Workspace } from './../../../../sdk/types';
import { window, commands } from 'vscode';
import { Clockify } from '../../../../sdk';
import { GlobalState } from '../../../../util/global-state';
import { showError } from '../../../../sdk/util';
import { selectClient } from './select-client';
import { refreshClients } from './refresh-clients';

export async function addClient(): Promise<void> {
	// check if workspace exists
	const workspace = GlobalState.get('selectedWorkspace') as Workspace | undefined;
	if (!workspace) {
		return showError('No workspace selected.');
	}

	// get the name for the new client
	const name = await window.showInputBox({
		title: "Enter the client's name",
		placeHolder: "The client's name",
		ignoreFocusOut: true,
	});
	if (!name) {
		return;
	}

	// create new client
	const client = await Clockify.addClient(workspace.id, { name });
	if (client) {
		selectClient(client);
		refreshClients();
		window.showInformationMessage(`Client '${name}' added successfully.`);
	}
}
