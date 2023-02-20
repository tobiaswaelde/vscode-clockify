import { window } from 'vscode';
import { TreeView } from '../..';
import { ProjectItem } from '../items/item';

export async function deleteProject(element: ProjectItem): Promise<void> {
	window.showErrorMessage('Not yet implemented.');
	TreeView.refreshProjects();
	TreeView.refreshTasks();
	TreeView.refreshTimeentries();
}
