import { window } from 'vscode';
import { TreeView } from '../..';
import { Clockify } from '../../../../sdk';
import { Workspace } from '../../../../sdk/types/workspace';
import { showError } from '../../../../sdk/util';
import { Dialogs } from '../../../../util/dialogs';
import { GlobalState } from '../../../../util/global-state';
import { ClientItem } from '../items/item';

export async function deleteClient(element: ClientItem): Promise<void> {
	// check if workspace exists
	const workspace = GlobalState.get<Workspace>('selectedWorkspace');
	if (!workspace || !element.client) {
		return showError('No workspace selected.');
	}

	// ask the user if he really wants to delete the client
	const res = await Dialogs.askForConfirmation('Do you really want to delete the selected client?');
	if (res !== 'Yes') {
		return;
	}

	// delete client
	const deletedClient = await Clockify.deleteClient(workspace.id, element.client.id);
	if (deletedClient) {
		window.showInformationMessage(`Client '${deletedClient.name}' deleted.`);
		TreeView.refreshClients();
	}
}
