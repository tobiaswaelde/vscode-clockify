import { window } from 'vscode';
import { Clockify } from '../../../../sdk';
import { Workspace } from '../../../../sdk/types/workspace';
import { showError } from '../../../../sdk/util';
import { Dialogs } from '../../../../util/dialogs';
import { GlobalState } from '../../../../util/global-state';
import { ClientItem } from '../items/item';
import { refreshClients } from './refresh-clients';

export async function renameClient(element: ClientItem): Promise<void> {
	// check if workspace exists
	const workspace = GlobalState.get('selectedWorkspace') as Workspace;
	if (!workspace) {
		return showError('No workspace selected.');
	}

	// get the name for the new client
	const name = await Dialogs.getClientName(element.client.name);
	if (!name) {
		return;
	}

	// update client
	const updatedClient = await Clockify.updateClient(workspace.id, element.client.id, { name });
	if (updatedClient) {
		window.showInformationMessage('Client updated.');
	}
	refreshClients();
}
