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
	console.log(workspace.name);

	if (currentWorkspace === workspace) {
		return;
	}

	//> Get Providers
	const clientsProvider = providerStore.get<ClientsProvider>('clients');

	//> Set context
	setContext(ContextValue.WorkspaceSelected, false);

	//> Empty selection to show 'Loading...'
	if (workspace) {
		context.globalState.update('selectedWorkspace', null);
	}

	//> Call refresh() on all providers
	clientsProvider.refresh();

	if (workspace) {
		setTimeout(() => {
			//> Update globalState
			context.globalState.update('selectedWorkspace', workspace);

			//> Call refresh() on all providers
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
			await vscode.window.showInformationMessage('Workspace added');
		}

		const workspacesProvider = providerStore.get<WorkspacesProvider>('workspaces');
		setContext(ContextValue.WorkspaceSelected, false);
		if (workspace) {
			context.globalState.update('selectedWorkspace', null);
		}
		workspacesProvider.refresh();
		if (workspace) {
			setTimeout(() => {
				context.globalState.update('selectedWorkspace', workspace);
				workspacesProvider.refresh();

				setContext(ContextValue.WorkspaceSelected, !!workspace);
			}, 250);
		}
	} catch (err) {}
}

function refreshWorkspaces(element?: WorkspaceItem): void {
	const workspacesProvider = providerStore.get<WorkspacesProvider>('workspaces');
	workspacesProvider.refresh(element);
}
