import * as vscode from 'vscode';
import { WorkspaceDto, WorkspaceRequest } from '../../api/interfaces';
import { WorkspaceItem, WorkspacesProvider } from './workspaces.provider';
import { providerStore } from '../stores';
import { getContext, setContext, ContextValue } from '../utils';
import { addWorkspace as apiAddWorkspace } from '../../api/actions/workspace';
import { ClientsProvider } from '../clients/clients.providers';

export function registerWorkspacesCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.workspaces.selection', selectWorkspace),
		vscode.commands.registerCommand('clockify.workspaces.add', addWorkspace),
		vscode.commands.registerCommand('clockify.workspaces.refresh', refreshWorkspaces)
	);
}

function selectWorkspace(workspace: WorkspaceDto): void {
	const context = getContext();
	const currentWorkspace = context.globalState.get<WorkspaceDto>('selectedWorkspace')!;

	if (currentWorkspace === workspace) {
		return;
	}

	//> Get Providers
	const workspacesProvider = providerStore.get<WorkspacesProvider>('workspaces');
	const clientsProvider = providerStore.get<ClientsProvider>('clients');

	//> Set context
	setContext(ContextValue.WorkspaceSelected, false);

	//> Empty selection to show 'Loading...'
	if (workspace) {
		context.globalState.update('selectedWorkspace', null);
	}

	//> Call refresh() on all providers
	workspacesProvider.refresh();
	clientsProvider.refresh();

	if (workspace) {
		setTimeout(() => {
			//> Update globalState
			context.globalState.update('selectedWorkspace', workspace);

			//> Call refresh() on all providers
			workspacesProvider.refresh();
			clientsProvider.refresh();
		}, 250);
	}
}

async function addWorkspace(): Promise<void> {
	try {
		const context = getContext();

		let newWorkspace: WorkspaceRequest = {} as WorkspaceRequest;
		newWorkspace.name = await vscode.window
			.showInputBox({
				ignoreFocusOut: true,
				placeHolder: 'Name of the workspace',
				prompt: 'Enter a name for your workspace'
			})
			.then((name) => {
				if (name === undefined) {
					throw new Error();
				}
				return name;
			});

		const workspace = await apiAddWorkspace(newWorkspace);
		if (workspace) {
			// const workspacesProvider = providerStore.get<WorkspacesProvider>('workspaces');
			// const clientsProvider = providerStore.get<ClientsProvider>('clients');
			// setContext(ContextValue.WorkspaceSelected, false);
			// context.globalState.update('selectedWorkspace', null);
			// workspacesProvider.refresh();
			// clientsProvider.refresh();

			// setTimeout(() => {
			// 	context.globalState.update('selectedWorkspace', workspace);
			// 	workspacesProvider.refresh();
			// 	clientsProvider.refresh();
			// }, 250);
			selectWorkspace(workspace);
			await vscode.window.showInformationMessage(`Workspace '${workspace.name}' added`);
		}
	} catch (err) {
		console.log(err);
	}
}

function refreshWorkspaces(element?: WorkspaceItem): void {
	const workspacesProvider = providerStore.get<WorkspacesProvider>('workspaces');
	workspacesProvider.refresh(element);
}
