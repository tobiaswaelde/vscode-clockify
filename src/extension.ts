import { Context } from './util/context';
import { registerCommands } from './commands';
import { checkApiKey } from './functions/check-api-key';
import { registerProvider } from './util/stores/register-provider';
import { WorkspacesProvider } from './views/treeview/workspaces';
import { ClientsProvider } from './views/treeview/clients';
import { ProjectsProvider } from './views/treeview/projects';
import { TasksProvider } from './views/treeview/tasks';
import { TagsProvider } from './views/treeview/tags';
import { TimeentriesProvider } from './views/treeview/timeentries';
import { StatusBar } from './views/statusbar';
import { Tracking } from './helpers/tracking';
import { ExtensionContext, workspace } from 'vscode';
import { TreeView } from './views/treeview';

export async function activate(context: ExtensionContext) {
	console.log('[clockify-tracker] Activating extension...');
	Context.setObject(context);
	Context.set('initialized', false);

	checkApiKey();

	registerCommands(context);

	//#region tracking
	Tracking.initialize();
	await Tracking.update();
	setInterval(() => {
		Tracking.update();
	}, 5000);
	//#endregion

	//#region tree view
	registerProvider('workspaces', new WorkspacesProvider(context));
	registerProvider('clients', new ClientsProvider(context));
	registerProvider('projects', new ProjectsProvider(context));
	registerProvider('tasks', new TasksProvider(context));
	registerProvider('tags', new TagsProvider(context));
	registerProvider('timeentries', new TimeentriesProvider(context));
	//#endregion

	//#region status bar
	await StatusBar.initialize(context);
	setInterval(() => {
		if (Tracking.isTracking) {
			StatusBar.update();
		}
	}, 1000);
	//#endregion

	// refresh treeview when config changes
	workspace.onDidChangeConfiguration((e) => {
		// only listen for config changes in clockify config
		if (e.affectsConfiguration('clockify')) {
			checkApiKey();
			TreeView.refresh();
		}
	});
}

export async function deactivate() {}
