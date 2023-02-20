import { window } from 'vscode';
import { Clockify } from '../../../../sdk';
import { Project } from './../../../../sdk/types/project';
import { Workspace } from '../../../../sdk/types/workspace';
import { Dialogs } from '../../../../util/dialogs';
import { GlobalState } from '../../../../util/global-state';
import { TreeView } from '../..';

export async function addTask(): Promise<void> {
	// get workspace
	const workspace =
		GlobalState.get<Workspace>('selectedWorkspace') || (await Dialogs.selectWorkspace());
	if (!workspace) {
		return;
	}

	// get project
	const project =
		GlobalState.get<Project>('selectedProject') || (await Dialogs.selectProject(workspace.id));
	if (!project) {
		return;
	}

	// get name
	const name = await Dialogs.getTaskName();
	if (!name) {
		return;
	}

	// add task
	const task = await Clockify.addTask(workspace.id, project.id, {
		name: name,
	});
	if (task) {
		TreeView.refreshTasks();
		window.showInformationMessage(`Task '${task.name}' added.`);
	}
}
