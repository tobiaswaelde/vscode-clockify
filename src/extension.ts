// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import http from './services/http.service';
import { resetConfig } from './commands/resetConfig';
import { setApiKey } from './commands/setApiKey';
import { selectWorkspace } from './commands/selectWorkspace';
import { startTracking } from './commands/startTracking';
import { stopTracking } from './commands/stopTracking';
import { getUser } from './api/actions/user';
import { ClockifyExplorerProvider } from './treeView/clockifyExplorer';
import { treeViewStore, providerStore } from './treeView/stores';
import { WorkspacesProvider } from './treeView/workspaces/workspaces.provider';
import { registerWorkspacesCommands } from './treeView/workspaces/commands';
import { setContextObject } from './treeView/utils';
import { ClientsProvider } from './treeView/clients/clients.providers';
import { registerClientsCommands } from './treeView/clients/commands';
import { ProjectsProvider } from './treeView/projects/projects.provider';
import { registerProjectsCommands } from './treeView/projects/commands';

let statusBarItem: vscode.StatusBarItem;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	setContextObject(context);

	const config = vscode.workspace.getConfiguration('clockify');
	console.log('clockify-tracker: Clockify extension started.');

	//#region CHECK API KEY
	let apiKey = <string>config.get('apiKey');
	if (!apiKey) {
		setApiKey();
		apiKey = <string>config.get('apiKey');
		if (!apiKey) {
			return;
		}
	}
	//#endregion

	http.authenticate(apiKey);

	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.resetConfig', () => resetConfig(context)),
		vscode.commands.registerCommand('clockify.setApiKey', () => setApiKey()),
		vscode.commands.registerCommand('clockify.selectWorkspace', selectWorkspace),
		vscode.commands.registerCommand('clockify.startTracking', () => startTracking()),
		vscode.commands.registerCommand('clockify.stopTracking', () => stopTracking())
	);

	registerProvider('workspaces', new WorkspacesProvider(context));
	registerProvider('clients', new ClientsProvider(context));
	registerProvider('projects', new ProjectsProvider(context));
	registerWorkspacesCommands(context);
	registerClientsCommands(context);
	registerProjectsCommands(context);

	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.color = 'var(--vscode-gitDecoration-untrackedResourceForeground)';
	statusBarItem.text = 'Clockify';
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function registerProvider<T>(name: string, provider: vscode.TreeDataProvider<T>) {
	const treeView = vscode.window.createTreeView(`clockify-${name}`, {
		treeDataProvider: provider
	});
	treeViewStore.add(name, treeView);
	providerStore.add(name, provider);
}
