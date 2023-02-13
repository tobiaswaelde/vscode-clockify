import { refreshClients } from '../views/treeview/clients/commands/refresh-clients';
import { refreshProjects } from '../views/treeview/projects/commands/refresh-projects';
import { refreshTasks } from '../views/treeview/tasks/commands/refresh-tasks';
import { refreshWorkspaces } from '../views/treeview/workspaces/commands/refresh-workspaces';

export function refresh() {
	refreshWorkspaces();
	refreshClients();
	refreshProjects();
	refreshTasks();
}
