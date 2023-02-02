// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import http from './services/http.service';
import { setContextObject, setContext, ContextValue, registerProvider } from './treeView/utils';
import { registerClockifyCommands, registerContextMenuCommands } from './commands';
import { autoStartTracking } from './commands/tracking/autoStartTracking';
import { autoStopTracking } from './commands/tracking/autoStopTracking';
import { WorkspacesProvider } from './treeView/workspaces/workspaces.provider';
import { ClientsProvider } from './treeView/clients/clients.providers';
import { ProjectsProvider } from './treeView/projects/projects.provider';
import { TasksProvider } from './treeView/tasks/tasks.provider';
import { TagsProvider } from './treeView/tags/tags.provider';
import { TimeentriesProvider } from './treeView/timeentries/timeentries.provider';
import { registerWorkspacesCommands } from './treeView/workspaces/commands';
import { registerClientsCommands } from './treeView/clients/commands';
import { registerProjectsCommands } from './treeView/projects/commands';
import { registerTasksCommands } from './treeView/tasks/commands';
import { registerTagsCommands } from './treeView/tags/commands';
import { registerTimeentriesCommands } from './treeView/timeentries/commands';
import { initStatusBarItem, updateStatusBarItem } from './statusbar/init';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('clockify-tracker: Clockify extension started.');

	setContextObject(context);
	const config = vscode.workspace.getConfiguration('clockify');

	//#region CHECK API KEY
	const apiKey = config.get<string>('apiKey')!;
	if (!apiKey) {
		context.globalState.update('selectedWorkspace', null);
		context.globalState.update('selectedClient', null);
		context.globalState.update('selectedProject', null);
		setContext(ContextValue.WorkspaceSelected, false);
		setContext(ContextValue.ClientSelected, false);
		setContext(ContextValue.ProjectSelected, false);
	} else {
		http.authenticate(apiKey);
	}
	//#endregion

	//#region AUTOSTART
	context.globalState.update('tracking:isTracking', false);
	const trackingAutoStart = config.get<boolean>('tracking.autostart')!;
	if (trackingAutoStart) {
		autoStartTracking(context);
	}
	//#endregion

	//#region COMMANDS
	registerClockifyCommands(context);
	registerContextMenuCommands(context);
	//#endregion
	//#region TREE VIEW
	registerProvider('workspaces', new WorkspacesProvider(context));
	registerProvider('clients', new ClientsProvider(context));
	registerProvider('projects', new ProjectsProvider(context));
	registerProvider('tasks', new TasksProvider(context));
	registerProvider('tags', new TagsProvider(context));
	registerProvider('timeentries', new TimeentriesProvider(context));
	registerWorkspacesCommands(context);
	registerClientsCommands(context);
	registerProjectsCommands(context);
	registerTasksCommands(context);
	registerTagsCommands(context);
	registerTimeentriesCommands(context);
	//#endregion
	//#region STATUS BAR ITEM
	initStatusBarItem(context);
	//#endregion

	setInterval(() => {
		updateStatusBarItem(context, false);
	}, 1000 * 5);
}

// this method is called when your extension is deactivated
export async function deactivate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('clockify');

	//#region AUTOSTOP
	const trackingAutoStop = config.get<boolean>('tracking.autostop');
	if (trackingAutoStop) {
		await autoStopTracking(context);
	}
	//#endregion
}
