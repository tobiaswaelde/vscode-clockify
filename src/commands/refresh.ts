import { refreshClients } from '../views/treeview/clients/commands/refresh-clients';
import { refreshWorkspaces } from '../views/treeview/workspaces/commands/refresh-workspaces';

export function refresh() {
	refreshWorkspaces();
	refreshClients();
}
