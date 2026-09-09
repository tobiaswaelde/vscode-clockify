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
import { checkDefaultWorkspace } from './functions/check-default-workspace';
import { ApiKey } from './util/api-key';
import { Pomodoro } from './helpers/pomodoro';

export async function activate(context: ExtensionContext) {
	console.log('[clockify-tracker] Activating extension...');
	Context.setObject(context);
	await Context.set('initialized', false);

	await ApiKey.migrateLegacyConfiguration();
	const hasApiKey = await checkApiKey();

	registerCommands(context);

	//#region tree view
	context.subscriptions.push(
		registerProvider('workspaces', new WorkspacesProvider(context)),
		registerProvider('clients', new ClientsProvider(context)),
		registerProvider('projects', new ProjectsProvider(context)),
		registerProvider('tasks', new TasksProvider(context)),
		registerProvider('tags', new TagsProvider(context)),
		registerProvider('timeentries', new TimeentriesProvider(context))
	);
	//#endregion

	//#region tracking
	if (hasApiKey) {
		await checkDefaultWorkspace();
		await Tracking.initialize();
	}
	const trackingInterval = setInterval(() => {
		void Tracking.update();
	}, 5000);
	context.subscriptions.push({ dispose: () => clearInterval(trackingInterval) });
	const pomodoroInterval = setInterval(() => {
		void Pomodoro.update();
	}, 1000);
	context.subscriptions.push({ dispose: () => clearInterval(pomodoroInterval) });
	await Pomodoro.update();
	//#endregion

	//#region status bar
	StatusBar.initialize(context);
	const statusBarInterval = setInterval(() => {
		StatusBar.update();
	}, 1000);
	context.subscriptions.push({ dispose: () => clearInterval(statusBarInterval) });
	//#endregion

	// refresh treeview when config changes
	context.subscriptions.push(
		workspace.onDidChangeConfiguration(async (e) => {
			// only listen for config changes in clockify config
			if (e.affectsConfiguration('clockify')) {
				await checkApiKey();
				TreeView.refresh();
				StatusBar.update();
			}
		})
	);
}

export async function deactivate() {
	await Tracking.dispose();
}
