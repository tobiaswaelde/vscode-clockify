import * as vscode from 'vscode';
import { getProjects } from '../helpers/workspace';

export async function startTracking(workspaceId: string) {
	const project = await selectProject(workspaceId);
	console.log('Selected project:', project);
}

async function selectProject(workspaceId: string) {
	const projectsRaw = await getProjects(workspaceId);
	let items = [];
	projectsRaw.forEach((project) => {
		let item = { label: project.name, detail: project.id, id: project.id };

		items.push(item);
	});
	return vscode.window
		.showQuickPick(items, { ignoreFocusOut: true, placeHolder: 'Select project' })
		.then((item) => {
			if (item) {
				return item.id;
			} else {
				return '';
			}
		});
}
