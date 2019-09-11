// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import http from './services/http.service';
import { resetConfig } from './commands/resetConfig';
import { setApiKey } from './commands/setApiKey';
import { selectWorkspace } from './commands/selectWorkspace';
import { startTracking } from './commands/startTracking';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const apiKey = context.globalState.get('apiKey', '');
	const workspaceId = context.globalState.get('workspaceId', '');

	if (!apiKey) {
		setApiKey(context);
	} else {
		http.authenticate(apiKey);
	}

	if (!workspaceId) {
		selectWorkspace(context);
	}

	context.subscriptions.push(
		vscode.commands.registerCommand('extension.resetConfig', () => resetConfig(context)),
		vscode.commands.registerCommand('extension.setApiKey', () => setApiKey(context)),
		vscode.commands.registerCommand('extension.selectWorkspace', () =>
			selectWorkspace(context)
		),
		vscode.commands.registerCommand('extension.startTracking', () =>
			startTracking(workspaceId)
		),
		vscode.commands.registerCommand('extension.stopTracking', () => selectWorkspace(context))
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
