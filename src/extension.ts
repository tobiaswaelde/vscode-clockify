import { Context } from './util/context';
import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { checkApiKey } from './util/check-api-key';

export function activate(context: vscode.ExtensionContext) {
	console.log('[clockify-tracker] Activating extension...');
	Context.setObject(context);

	checkApiKey();

	registerCommands(context);
}

export function deactivate() {}
