import { Context } from './util/context';
import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { checkApiKey } from './functions/check-api-key';
import { registerProvider } from './util/stores/register-provider';
import { WorkspacesProvider } from './views/treeview/workspaces';
import { ClientsProvider } from './views/treeview/clients';
import { refresh } from './commands/refresh';
import { ProjectsProvider } from './views/treeview/projects';
import { TasksProvider } from './views/treeview/tasks';
import { TagsProvider } from './views/treeview/tags';
import { TimeentriesProvider } from './views/treeview/timeentries';

export function activate(context: vscode.ExtensionContext) {
	console.log('[clockify-tracker] Activating extension...');
	Context.setObject(context);
	Context.set('initialized', false);

	checkApiKey();

	registerCommands(context);

	// tree view
	registerProvider('workspaces', new WorkspacesProvider(context));
	registerProvider('clients', new ClientsProvider(context));
	registerProvider('projects', new ProjectsProvider(context));
	registerProvider('tasks', new TasksProvider(context));
	registerProvider('tags', new TagsProvider(context));
	registerProvider('timeentries', new TimeentriesProvider(context));

	// refresh treeview when config changes
	vscode.workspace.onDidChangeConfiguration((e) => {
		// only listen for config changes in clockify config
		if (e.affectsConfiguration('clockify')) {
			checkApiKey();
			refresh();
		}
	});
}

export function deactivate() {}
