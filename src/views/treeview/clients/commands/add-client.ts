import { Workspace } from '../../../../sdk/types/workspace';
import { window } from 'vscode';
import { Clockify } from '../../../../sdk';
import { GlobalState } from '../../../../util/global-state';
import { selectClient } from './select-client';
import { Dialogs } from '../../../../util/dialogs';
import { TreeView } from '../..';

export async function addClient(): Promise<void> {
	// get workspace
	const workspace =
		GlobalState.get<Workspace>('selectedWorkspace') || (await Dialogs.selectWorkspace());
	if (!workspace) {
		return;
	}

	// get the name for the new client
	const name = await Dialogs.getClientName();
	if (!name) {
		return;
	}

	// create new client
	const client = await Clockify.addClient(workspace.id, { name });
	if (client) {
		selectClient(client);
		TreeView.refreshClients();
		window.showInformationMessage(`Client '${name}' added successfully.`);
	}
}
