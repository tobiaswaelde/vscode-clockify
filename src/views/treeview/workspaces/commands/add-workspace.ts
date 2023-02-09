import { commands, window } from 'vscode';
import { Commands } from '../../../../config/commands';
import { Clockify } from '../../../../sdk';
import { selectWorkspace } from './select-workspace';

export async function addWorkspace(): Promise<void> {
	// get the name for the new workspace
	const name = await window.showInputBox({
		title: 'Enter a name for your workspace',
		placeHolder: 'Name of the workspace',
		ignoreFocusOut: true,
	});
	if (!name) {
		return;
	}

	// create new workspace
	const workspace = await Clockify.addWorkspace({ name });
	if (workspace) {
		selectWorkspace(workspace);
		commands.executeCommand(Commands.workspacesRefresh);
		window.showInformationMessage(`Workspace '${workspace.name}' added successfully.`);
	}
}
