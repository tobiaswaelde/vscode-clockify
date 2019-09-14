import * as vscode from 'vscode';
import { ClientDto } from '../../api/interfaces';
import { ClientItem, ClientsProvider } from './clients.providers';
import { providerStore } from '../stores';

export function registerClientsCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.clients.add', addClient),
		vscode.commands.registerCommand('clockify.clients.refresh', refreshClients)
	);
}

async function addClient(): Promise<void> {
	try {
	} catch (err) {
		console.error(err);
	}
}

function refreshClients(element?: ClientItem): void {
	const clientsProvider = providerStore.get<ClientsProvider>('clients');
	clientsProvider.refresh(element);
}
