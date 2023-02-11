import { window } from 'vscode';
import { Clockify } from './../../../../sdk/index';
import { Client } from '../../../../sdk/types/client';
import { Workspace } from '../../../../sdk/types/workspace';
import { Dialogs } from '../../../../util/dialogs';
import { GlobalState } from '../../../../util/global-state';
import { refreshProjects } from './refresh-projects';

export async function addProject(): Promise<void> {
	// get workspace
	const workspace =
		GlobalState.get<Workspace>('selectedWorkspace') || (await Dialogs.selectWorkspace());
	if (!workspace) {
		return;
	}

	// get client
	const client =
		GlobalState.get<Client>('selectedClient') || (await Dialogs.selectClient(workspace.id));
	if (client === undefined) {
		return;
	}

	const name = await Dialogs.getProjectName();
	if (!name) {
		return;
	}

	const color = await Dialogs.selectColor();
	if (!color) {
		return;
	}

	const isPublic = await Dialogs.getProjectVisibility();
	const isBillable = await Dialogs.getProjectBillable();

	// add project
	const project = await Clockify.addProject(workspace.id, {
		clientId: client?.id,
		name: name,
		color: color,
		isPublic: isPublic,
		billable: isBillable,
	});
	if (project) {
		refreshProjects();
		window.showInformationMessage(`Project '${project.name}' added.`);
	}
}
