import { window } from 'vscode';
import { TreeView } from '../..';
import { Clockify } from '../../../../sdk';
import { Project } from '../../../../sdk/types/project';
import { Workspace } from '../../../../sdk/types/workspace';
import { showError } from '../../../../sdk/util';
import { Dialogs } from '../../../../util/dialogs';
import { GlobalState } from '../../../../util/global-state';
import { TaskItem } from '../items/item';

export async function renameTask(element?: TaskItem): Promise<void> {
	const workspace = GlobalState.get<Workspace>('selectedWorkspace');
	const project = GlobalState.get<Project>('selectedProject');
	if (!workspace || !project || !element?.task) {
		return showError('No workspace, project, or task selected.');
	}

	const name = (await Dialogs.getTaskName(element.task.name))?.trim();
	if (!name) {
		return;
	}

	const updatedTask = await Clockify.updateTask(workspace.id, project.id, element.task.id, {
		name,
	});
	if (!updatedTask) {
		return;
	}

	window.showInformationMessage(`Task '${updatedTask.name}' updated.`);
	TreeView.refreshTasks();
	TreeView.refreshTimeentries();
}
