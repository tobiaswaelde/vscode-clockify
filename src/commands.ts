import * as vscode from 'vscode';
import { setApiKey } from './commands/setApiKey';
import { resetConfig } from './commands/resetConfig';
import { selectWorkspace } from './commands/selectWorkspace';
import { startTracking } from './commands/tracking/startTracking';
import { stopTracking } from './commands/tracking/stopTracking';
import { toggleTracking } from './commands/tracking/toggleTracking';
import { changeTimeEntry } from './commands/timeentry/changeTimeEntry';

export function registerClockifyCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.setApiKey', setApiKey),
		vscode.commands.registerCommand('clockify.resetConfig', resetConfig),
		vscode.commands.registerCommand('clockify.selectWorkspace', () => {
			selectWorkspace(context);
		}),
		vscode.commands.registerCommand('clockify.tracking.start', () => {
			startTracking(context);
		}),
		vscode.commands.registerCommand('clockify.tracking.stop', () => {
			stopTracking(context);
		}),
		vscode.commands.registerCommand('clockify.tracking.toggle', toggleTracking),
		vscode.commands.registerCommand('clockify.timeentry.change', changeTimeEntry)
	);
}
