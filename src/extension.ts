import { Context } from './util/context';
import * as vscode from 'vscode';
import { registerCommands } from './commands';

export function activate(context: vscode.ExtensionContext) {
	console.log('[clockify-tracker] Activating extension...');
	Context.setObject(context);

	registerCommands(context);
}

export function deactivate() {}
