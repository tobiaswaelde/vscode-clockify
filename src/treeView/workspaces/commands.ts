import * as vscode from 'vscode';
import { WorkspaceDto, WorkspaceRequest } from '../../api/interfaces';
import { WorkspaceItem, WorkspacesProvider } from './workspaces.provider';
import { providerStore } from '../stores';
import { getContext, setContext, ContextValue } from '../utils';
import { addWorkspace as apiAddWorkspace } from '../../api/actions/workspace';
import { ClientsProvider } from '../clients/clients.providers';
import { ProjectsProvider } from '../projects/projects.provider';
import { TasksProvider } from '../tasks/tasks.provider';
import { getWorkspaceName } from '../../helpers/treeview/workspace/getWorkspaceName';
import { TagsProvider } from '../tags/tags.provider';

export function registerWorkspacesCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.workspaces.selection', selectWorkspace),
		vscode.commands.registerCommand('clockify.workspaces.add', addWorkspace),
		vscode.commands.registerCommand('clockify.workspaces.refresh', refreshWorkspaces)
	);
}

async function selectWorkspace(workspace: WorkspaceDto): Promise<void> {
	const context = getContext();
	const currentWorkspace = context.globalState.get<WorkspaceDto>('selectedWorkspace')!;

	if (currentWorkspace && currentWorkspace.id === workspace.id) {
		return;
	}

	//> Get Providers
	const workspacesProvider = providerStore.get<WorkspacesProvider>('workspaces');
	const clientsProvider = providerStore.get<ClientsProvider>('clients');
	const projectsProvider = providerStore.get<ProjectsProvider>('projects');
	const tasksProvider = providerStore.get<TasksProvider>('tasks');
	const tagsProvider = providerStore.get<TagsProvider>('tags');

	//> Set context
	setContext(ContextValue.WorkspaceSelected, false);
	setContext(ContextValue.ClientSelected, false);
	setContext(ContextValue.ProjectSelected, false);

	//> Empty selection to show 'Loading...'
	if (workspace) {
		context.globalState.update('selectedWorkspace', null);
		context.globalState.update('selectedClient', null);
		context.globalState.update('selectedProject', null);
	}

	//> Call refresh() on all providers
	workspacesProvider.refresh();
	clientsProvider.refresh();
	projectsProvider.refresh();
	tasksProvider.refresh();
	tagsProvider.refresh();

	if (workspace) {
		setTimeout(() => {
			//> Update globalState
			context.globalState.update('selectedWorkspace', workspace);

			//> Call refresh() on all providers
			workspacesProvider.refresh();
			clientsProvider.refresh();
			projectsProvider.refresh();
			tasksProvider.refresh();
			tagsProvider.refresh();
		}, 50);
	}

	await vscode.window.showInformationMessage(`Workspace '${workspace.name}' selected`);
}

async function addWorkspace(): Promise<void> {
	const context = getContext();

	try {
		let newWorkspace: WorkspaceRequest = {} as WorkspaceRequest;

		const workspaceName = await getWorkspaceName();
		newWorkspace.name = workspaceName;

		// Add workspace
		const workspace = await apiAddWorkspace(newWorkspace);
		if (workspace) {
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
