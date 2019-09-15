import * as vscode from 'vscode';
import { getClients } from '../../api/actions/client';
import { ClientQuickPickItem } from '../../interfaces/customInterfaces';
import { ClientItem } from '../../treeView/clients/clients.providers';

export async function selectClient(workspaceId: string): Promise<string> {
	const clients = await getClients(workspaceId);

	let clientItems: ClientQuickPickItem[] = [];
	clients.forEach((client) => {
		let item: ClientQuickPickItem = {
			label: client.name,
			id: client.id
		};
		clientItems.push(item);
	});
	clientItems.push({
		label: 'No client',
		id: 'none'
	});

	const clientId = await vscode.window
		.showQuickPick(clientItems, { ignoreFocusOut: true, placeHolder: 'Select client' })
		.then((client) => {
			if (client === undefined) {
				throw new Error();
			}
			return client.id;
		});

	return clientId;
}
