import { window } from 'vscode';
import { Clockify } from '../../../../sdk';
import { Workspace } from '../../../../sdk/types';
import { showError } from '../../../../sdk/util';
import { GlobalState } from '../../../../util/global-state';
import { ClientItem } from '../items/item';
import { refreshClients } from './refresh-clients';

export async function deleteClient(element: ClientItem): Promise<void> {
	// check if workspace exists
	const workspace = GlobalState.get('selectedWorkspace') as Workspace;
	if (!workspace || !element.client) {
		return showError('No workspace selected.');
	}

	// ask the user if he really wants to delete the client
	const res = await window.showErrorMessage(
		'Do you really want to delete the selected client?',
		'Yes',
		'No'
	);
	if (res !== 'Yes') {
		return;
	}

	// delete client
	const deletedClient = await Clockify.deleteClient(workspace.id, element.client.id);
	if (deletedClient) {
		window.showInformationMessage(`Client '${deletedClient.name}' deleted.`);
	}
	refreshClients();
}
