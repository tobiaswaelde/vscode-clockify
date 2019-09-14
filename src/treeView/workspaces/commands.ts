import * as vscode from 'vscode';
import { WorkspaceDto } from '../../api/interfaces';

export function registerWorkspacesCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.workspaces.add', () => {}),
		vscode.commands.registerCommand('clockify.workspaces.selection', selectWorkspace)
	);
}

function selectWorkspace(workspace: WorkspaceDto): void {
	const context = getContext();

	if (workspace) {
	}
}
