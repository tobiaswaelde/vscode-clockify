import * as vscode from 'vscode';
import { WorkspaceQuickPickItem } from '../interfaces/customInterfaces';
import { getWorkspaces } from '../api/actions/workspace';

export async function selectWorkspace(): Promise<string> {
	const config = vscode.workspace.getConfiguration('clockify');
	let workspaceId: string = config.get('workspaceId') || '';

	if (!workspaceId) {
		const workspaces = await getWorkspaces();
		let workspacesItems: WorkspaceQuickPickItem[] = [];
		workspaces.forEach((workspace) => {
			let item = {
				label: workspace.name,
				id: workspace.id
			};
			workspacesItems.push(item);
		});

		// Select Workspace
		workspaceId = await vscode.window
			.showQuickPick(workspacesItems, {
				ignoreFocusOut: true,
				placeHolder: 'Select workspace'
			})
			.then((workspace) => {
				if (workspace === undefined) {
					throw new Error('No workspace selected');
				}
				return workspace.id;
			});

		// Write workspaceId to configuration
		config.update('tracking.workspaceId', workspaceId, false);
	}

	return workspaceId;
}
