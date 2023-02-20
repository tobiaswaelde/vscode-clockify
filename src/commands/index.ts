import { ExtensionContext, commands } from 'vscode';
import { Commands } from '../config/commands';
import { Tracking } from '../helpers/tracking';
import { TreeView } from '../views/treeview';
import { setApiKey } from './set-api-key';

/**
 * Register general commands
 * @param {ExtensionContext} ctx The extension context
 */
export async function registerCommands(ctx: ExtensionContext) {
	ctx.subscriptions.push(
		commands.registerCommand(Commands.setApiKey, () => setApiKey()),
		commands.registerCommand(Commands.refresh, () => TreeView.refresh()),
		commands.registerCommand(Commands.trackingStart, () => Tracking.start()),
		commands.registerCommand(Commands.trackingStop, () => Tracking.stop())
	);
}
