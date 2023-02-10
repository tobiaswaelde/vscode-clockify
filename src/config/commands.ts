/**
 * The extensions commands
 */
export enum Commands {
	// general
	setApiKey = 'clockify.setApiKey',
	refresh = 'clockify.refresh',
	// workspaces
	workspacesRefresh = 'clockify.workspaces.refresh',
	workspacesSelection = 'clockify.workspaces.selection',
	workspacesAdd = 'clockify.workspaces.add',
	// clients
	clientsRefresh = 'clockify.clients.refresh',
	clientsSelection = 'clockify.clients.selection',
	clientsAdd = 'clockify.clients.add',
	clientsRename = 'clockify.clients.rename',
	clientsDelete = 'clockify.clients.delete',
	// projects
	projectsRefresh = 'clockify.projects.refresh',
	projectsSelection = 'clockify.projects.selection',
	projectsAdd = 'clockify.projects.add',
	projectsRename = 'clockify.projects.rename',
	projectsDelete = 'clockify.projects.delete',
}
