import { window } from 'vscode';
import { TreeView } from '../..';
import { Clockify } from '../../../../sdk';
import { Project } from '../../../../sdk/types/project';
import { Workspace } from '../../../../sdk/types/workspace';
import { showError } from '../../../../sdk/util';
import { Dialogs } from '../../../../util/dialogs';
import { GlobalState } from '../../../../util/global-state';
import { TaskItem } from '../items/item';

export async function deleteTask(element?: TaskItem): Promise<void> {
	const workspace = GlobalState.get<Workspace>('selectedWorkspace');
	const project = GlobalState.get<Project>('selectedProject');
	if (!workspace || !project || !element?.task) {
		return showError('No workspace, project, or task selected.');
	}

	const confirmation = await Dialogs.askForConfirmation(
		`Do you really want to delete task '${element.task.name}'?`
	);
	if (confirmation !== 'Yes') {
		return;
	}

	const deletedTask = await Clockify.deleteTask(workspace.id, project.id, element.task.id);
	if (!deletedTask) {
		return;
	}

	window.showInformationMessage(`Task '${deletedTask.name}' deleted.`);
	TreeView.refreshTasks();
	TreeView.refreshTimeentries();
}
