// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import http from './services/http.service';
import { resetConfig } from './commands/resetConfig';
import { setApiKey } from './commands/setApiKey';
import { selectWorkspace } from './commands/selectWorkspace';
import { startTracking } from './commands/startTracking';
import { stopTracking } from './commands/stopTracking';
import { getUser } from './actions/user';

let statusBarItem: vscode.StatusBarItem;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
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
		vscode.commands.registerCommand('extension.resetConfig', () => resetConfig(context)),
		vscode.commands.registerCommand('extension.setApiKey', () => setApiKey()),
		vscode.commands.registerCommand('extension.selectWorkspace', selectWorkspace),
		vscode.commands.registerCommand('extension.startTracking', () => startTracking()),
		vscode.commands.registerCommand('extension.stopTracking', () => stopTracking())
	);

	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.color = 'var(--vscode-gitDecoration-untrackedResourceForeground)';
	statusBarItem.text = 'Clockify';
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);
}

// this method is called when your extension is deactivated
export function deactivate() {}
