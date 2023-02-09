/**
 * The extensions commands
 */
export enum Commands {
	// general
	setApiKey = 'clockify.setApiKey',
	// workspaces
	workspacesRefresh = 'clockify.workspaces.refresh',
	workspacesSelection = 'clockify.workspaces.selection',
	workspacesAdd = 'clockify.workspaces.add',
	// clients
	clientsRefresh = 'clockify.clients.refresh',
	clientsSelection = 'clockify.clients.selection',
	clientsAdd = 'clockify.clients.add',
	clientsEdit = 'clockify.clients.edit',
	clientsDelete = 'clockify.clients.delete',
}
