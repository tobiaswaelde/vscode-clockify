import * as vscode from 'vscode';
import { setApiKey } from './commands/setApiKey';
import { resetConfig } from './commands/resetConfig';
import { selectWorkspace } from './commands/selectWorkspace';
import { startTracking } from './commands/startTracking';
import { stopTracking } from './commands/stopTracking';
import { toggleTracking } from './commands/toggleTracking';

export function registerClockifyCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.setApiKey', setApiKey),
		vscode.commands.registerCommand('clockify.resetConfig', resetConfig),
		vscode.commands.registerCommand('clockify.selectWorkspace', selectWorkspace),
		vscode.commands.registerCommand('clockify.tracking.start', startTracking),
		vscode.commands.registerCommand('clockify.tracking.stop', stopTracking),
		vscode.commands.registerCommand('clockify.tracking.toggle', toggleTracking)
	);
}
