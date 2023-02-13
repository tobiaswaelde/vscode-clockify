import { window } from 'vscode';
import { ProjectItem } from '../items/item';
import { refreshProjects } from './refresh-projects';

export async function deleteProject(element: ProjectItem): Promise<void> {
	//TODO
	window.showErrorMessage('Not yet implemented.');
	refreshProjects();
}
