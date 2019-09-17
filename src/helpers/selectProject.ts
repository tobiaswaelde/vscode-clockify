import * as vscode from 'vscode';
import { ProjectQuickPickItem } from '../interfaces/customInterfaces';
import { getProjects } from '../api/actions/project';
import { getClients } from '../api/actions/client';
import { getClientFromProject } from './getClient';

export async function selectProject(workspaceId: string, throwError = true): Promise<string> {
	const projects = await getProjects(workspaceId);
	const clients = await getClients(workspaceId);

	let projectItems: ProjectQuickPickItem[] = [];
	projects.forEach((project) => {
		let client = getClientFromProject(clients, project);
		let clientName = client ? client.name : 'none';

		let item = {
			label: project.name,
			detail: `Client ${clientName}`,
			id: project.id
		};
		projectItems.push(item);
	});

	// Select Project
	const projectId = await vscode.window
		.showQuickPick(projectItems, { ignoreFocusOut: true, placeHolder: 'Select project' })
		.then((project) => {
			if (project === undefined) {
				if (throwError) {
					throw new Error('No project selected');
				} else {
					return '';
				}
			}
			return project.id;
		});

	return projectId;
}
