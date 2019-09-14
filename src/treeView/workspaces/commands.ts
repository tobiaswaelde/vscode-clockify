import * as vscode from 'vscode';
import { WorkspaceDto } from '../../api/interfaces';
import { WorkspaceItem, WorkspacesProvider } from './workspaces.provider';
import { providerStore } from '../stores';

export function registerWorkspacesCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.workspaces.refresh', refreshWorkspaces),
		vscode.commands.registerCommand('clockify.workspaces.add', addWorkspace),
		vscode.commands.registerCommand('clockify.workspaces.selection', selectWorkspace)
	);
}

function refreshWorkspaces(element?: WorkspaceItem): void {
	const workspacesProvider = providerStore.get<WorkspacesProvider>('workspaces');
	workspacesProvider.refresh(element);
}

async function addWorkspace(): Promise<void> {
	console.log('add workspace');
}

function selectWorkspace(workspace: WorkspaceDto): void {
	// const context = getContext();

	if (workspace) {
		vscode.window.showInformationMessage(`Workspace ${workspace.id} selected.`);
	}
}
