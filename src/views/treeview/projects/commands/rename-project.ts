import { window } from 'vscode';
import { TreeView } from '../..';
import { Clockify } from '../../../../sdk';
import { Workspace } from '../../../../sdk/types/workspace';
import { showError } from '../../../../sdk/util';
import { Dialogs } from '../../../../util/dialogs';
import { GlobalState } from '../../../../util/global-state';
import { ProjectItem } from '../items/item';

export async function renameProject(element?: ProjectItem): Promise<void> {
	const workspace = GlobalState.get<Workspace>('selectedWorkspace');
	if (!workspace || !element?.project) {
		return showError('No workspace or project selected.');
	}

	const name = (await Dialogs.getProjectName(element.project.name))?.trim();
	if (!name) {
		return;
	}

	const updatedProject = await Clockify.updateProject(workspace.id, element.project.id, { name });
	if (!updatedProject) {
		return;
	}

	window.showInformationMessage(`Project '${updatedProject.name}' updated.`);
	TreeView.refreshProjects();
}
