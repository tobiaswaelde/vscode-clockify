import { window } from 'vscode';
import { ProjectItem } from '../items/item';
import { refreshProjects } from './refresh-projects';

export async function renameProject(element: ProjectItem): Promise<void> {
	//TODO
	window.showErrorMessage('Not yet implemented.');
	refreshProjects();
}
