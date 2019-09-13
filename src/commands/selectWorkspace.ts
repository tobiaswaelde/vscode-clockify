import * as vscode from 'vscode';
import * as _ from 'lodash';
import { WorkspaceQuickPickItem } from '../interfaces/customInterfaces';
import { getWorkspaces } from '../actions/workspace';

export async function selectWorkspace() {
	try {
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
		const workspaceId = await vscode.window
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

		// Write workspaceId to workspace config
		const config = vscode.workspace.getConfiguration('clockify');
		config.update('workspaceId', workspaceId, false);
	} catch (err) {}
}
