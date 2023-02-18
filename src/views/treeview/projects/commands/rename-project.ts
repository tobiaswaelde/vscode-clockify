import { window } from 'vscode';
import { refreshTasks } from '../../tasks/commands/refresh-tasks';
import { refreshTimeentries } from '../../timeentries/commands/refresh-timeentries';
import { ProjectItem } from '../items/item';
import { refreshProjects } from './refresh-projects';

export async function renameProject(element: ProjectItem): Promise<void> {
	window.showErrorMessage('Not yet implemented.');
	refreshProjects();
	refreshTasks();
	refreshTimeentries();
}
