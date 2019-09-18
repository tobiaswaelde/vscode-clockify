import * as vscode from 'vscode';
import { TimeentryItem, TimeentriesProvider } from './timeentries.provider';
import { providerStore } from '../stores';

export function registerTimeentriesCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.timeentries.refresh', refreshTimeentries)
	);
}

function refreshTimeentries(element?: TimeentryItem): void {
	const timeentriesProvider = providerStore.get<TimeentriesProvider>('timeentries');
	timeentriesProvider.refresh(element);
}
