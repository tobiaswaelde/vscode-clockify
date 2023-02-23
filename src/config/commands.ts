/**
 * The extensions commands
 */
export enum Commands {
	// general
	setApiKey = 'clockify.setApiKey',
	refresh = 'clockify.refresh',
	copyToClipboard = 'clockify.copyToClipboard',
	// workspaces
	workspacesRefresh = 'clockify.workspaces.refresh',
	workspacesSelection = 'clockify.workspaces.selection',
	workspacesSetDefault = 'clockify.workspaces.setAsDefault',
	workspacesSetWorkspaceDefault = 'clockify.workspaces.setAsWorkspaceDefault',
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
	projectsSetDefault = 'clockify.projects.setAsDefault',
	projectsAdd = 'clockify.projects.add',
	projectsRename = 'clockify.projects.rename',
	projectsDelete = 'clockify.projects.delete',
	// tasks
	tasksRefresh = 'clockify.tasks.refresh',
	tasksSetDefault = 'clockify.tasks.setAsDefault',
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

	// tracking
	trackingStart = 'clockify.tracking.start',
	trackingStop = 'clockify.tracking.stop',
	trackingUpdateInformation = 'clockify.tracking.updateInformation',
}
