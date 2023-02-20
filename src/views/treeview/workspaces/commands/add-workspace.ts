import { window } from 'vscode';
import { TreeView } from '../..';
import { Clockify } from '../../../../sdk';
import { Dialogs } from '../../../../util/dialogs';
import { selectWorkspace } from './select-workspace';

export async function addWorkspace(): Promise<void> {
	// get the name for the new workspace
	const name = await Dialogs.getWorkspaceName();
	if (!name) {
		return;
	}

	// create new workspace
	const workspace = await Clockify.addWorkspace({ name });
	if (workspace) {
		selectWorkspace(workspace);
		TreeView.refreshWorkspaces();
		window.showInformationMessage(`Workspace '${workspace.name}' added successfully.`);
	}
}
