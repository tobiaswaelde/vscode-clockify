import { window } from 'vscode';
import { TreeView } from '../..';
import { Clockify } from '../../../../sdk';
import { Workspace } from '../../../../sdk/types/workspace';
import { showError } from '../../../../sdk/util';
import { Dialogs } from '../../../../util/dialogs';
import { GlobalState } from '../../../../util/global-state';
import { ProjectItem } from '../items/item';

export async function deleteProject(element?: ProjectItem): Promise<void> {
	const workspace = GlobalState.get<Workspace>('selectedWorkspace');
	if (!workspace || !element?.project) {
		return showError('No workspace or project selected.');
	}

	const confirmation = await Dialogs.askForConfirmation(
		`Do you really want to delete project '${element.project.name}'?`
	);
	if (confirmation !== 'Yes') {
		return;
	}

	const deletedProject = await Clockify.deleteProject(workspace.id, element.project.id);
	if (!deletedProject) {
		return;
	}

	window.showInformationMessage(`Project '${deletedProject.name}' deleted.`);
	TreeView.refreshProjects();
	TreeView.refreshTasks();
	TreeView.refreshTimeentries();
}
