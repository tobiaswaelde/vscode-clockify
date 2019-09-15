import * as vscode from 'vscode';
import { ClientDto, ClientRequest, WorkspaceDto } from '../../api/interfaces';
import { ClientItem, ClientsProvider } from './clients.providers';
import { providerStore } from '../stores';
import { getContext, setContext, ContextValue } from '../utils';
import { addNewClientToWorkspace } from '../../api/actions/client';
import { ProjectsProvider } from '../projects/projects.provider';
import { TasksProvider } from '../tasks/tasks.provider';
import { getClientName } from '../../helpers/client/getName';

export function registerClientsCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.clients.selection', selectClient),
		vscode.commands.registerCommand('clockify.clients.add', addClient),
		vscode.commands.registerCommand('clockify.clients.refresh', refreshClients)
	);
}

async function selectClient(client: ClientDto): Promise<void> {
	const context = getContext();
	const currentClient = context.globalState.get<ClientDto>('selectedClient')!;
	if (currentClient && currentClient.id === client.id) {
		return;
	}

	//> Get Providers
	const projectsProvider = providerStore.get<ProjectsProvider>('projects');
	const tasksProvider = providerStore.get<TasksProvider>('tasks');

	//> Set context
	setContext(ContextValue.ProjectSelected, false);
	setContext(ContextValue.ClientSelected, false);

	//> Empty selection to show 'Loading...'
	if (client) {
		context.globalState.update('selectedProject', null);
		context.globalState.update('selectedClient', null);
	}

	//> Call refresh() on all providers
	projectsProvider.refresh();
	tasksProvider.refresh();

	if (client) {
		setTimeout(() => {
			//> Update globalState
			context.globalState.update('selectedClient', client);

			//> Call refresh() on all providers
			projectsProvider.refresh();
			tasksProvider.refresh();
		}, 50);
	}

	await vscode.window.showInformationMessage(`Client ${client.name} selected`);
}

async function addClient(): Promise<void> {
	const context = getContext();
	const workspace = context.globalState.get<WorkspaceDto>('selectedWorkspace')!;
	if (!workspace) {
		await vscode.window.showErrorMessage('No workspace selected');
		return;
	}

	try {
		let newClient: ClientRequest = {} as ClientRequest;

		const clientName = await getClientName();
		newClient.name = clientName;

		// Add client
		const client = await addNewClientToWorkspace(workspace.id, newClient);
		if (client) {
			const clientsProvider = providerStore.get<ClientsProvider>('clients');
			clientsProvider.refresh();
			await vscode.window.showInformationMessage(`Client '${client.name}' added`);
		}
	} catch (err) {
		// console.error(err);
	}
}

function refreshClients(element?: ClientItem): void {
	const context = getContext();
	context.globalState.update('selectedClient', null);

	const clientsProvider = providerStore.get<ClientsProvider>('clients');
	const projectPrivider = providerStore.get<ProjectsProvider>('projects');
	clientsProvider.refresh(element);
	projectPrivider.refresh();
}
