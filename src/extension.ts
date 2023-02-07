import { Context } from './util/context';
import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { checkApiKey } from './functions/check-api-key';
import { registerProvider } from './util/stores/register-provider';
import { WorkspacesProvider } from './views/treeview/workspaces';
import { ProviderStore } from './util/stores/provider-store';
import { Commands } from './config/commands';
import { GlobalState } from './util/global-state';

export function activate(context: vscode.ExtensionContext) {
	console.log('[clockify-tracker] Activating extension...');
	Context.setObject(context);
	Context.set('initialized', false);

	checkApiKey();

	registerCommands(context);

	// tree view
	registerProvider('workspaces', new WorkspacesProvider(context));

	// refresh treeview when config changes
	vscode.workspace.onDidChangeConfiguration((e) => {
		// only listen for config changes in clockify config
		if (e.affectsConfiguration('clockify')) {
			checkApiKey();
			vscode.commands.executeCommand(Commands.workspacesRefresh);
		}
	});
}

export function deactivate() {}
