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
	// tasks
	tasksRefresh = 'clockify.tasks.refresh',
	tasksAdd = 'clockify.tasks.add',
	// tags
	tagsRefresh = 'clockify.tags.refresh',
	tagsAdd = 'clockify.tags.add',
	tagsRename = 'clockify.tags.rename',
	tagsDelete = 'clockify.tags.delete',
	tagsArchive = 'clockify.tags.archive',
	tagsUnarchive = 'clockify.tags.unarchive',
	// timeentries
	timeentriesRefresh = 'clockify.timeentries.refresh',
}
