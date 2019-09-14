import * as vscode from 'vscode';
import { ClientDto, ClientRequest, WorkspaceDto } from '../../api/interfaces';
import { ClientItem, ClientsProvider } from './clients.providers';
import { providerStore } from '../stores';
import { getContext, setContext, ContextValue } from '../utils';
import { addNewClientToWorkspace } from '../../api/actions/client';

export function registerClientsCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.clients.add', addClient),
		vscode.commands.registerCommand('clockify.clients.refresh', refreshClients)
	);
}

async function addClient(): Promise<void> {
	const context = getContext();
	const currentWorkspace = context.globalState.get<WorkspaceDto>('selectedWorkspace')!;
	try {
		let newClient: ClientRequest = {} as ClientRequest;
		newClient.name = await vscode.window
			.showInputBox({
				ignoreFocusOut: true,
				placeHolder: 'Name of the client',
				prompt: 'Enter a name for your client'
			})
			.then((name) => {
				if (name === undefined) {
					throw new Error();
				}
				return name;
			});

		const client = await addNewClientToWorkspace(currentWorkspace.id, newClient);
		if (client) {
			const clientsProvider = providerStore.get<ClientsProvider>('clients');
			clientsProvider.refresh();
			await vscode.window.showInformationMessage(`Client '${client.name}' added`);
		}
	} catch (err) {
		console.error(err);
	}
}

function refreshClients(element?: ClientItem): void {
	const clientsProvider = providerStore.get<ClientsProvider>('clients');
	clientsProvider.refresh(element);
}
