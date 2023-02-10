import { ExtensionContext, commands } from 'vscode';
import { Commands } from '../config/commands';
import { refresh } from './refresh';
import { setApiKey } from './set-api-key';

/**
 * Register general commands
 * @param {ExtensionContext} ctx The extension context
 */
export async function registerCommands(ctx: ExtensionContext) {
	ctx.subscriptions.push(
		commands.registerCommand(Commands.setApiKey, () => setApiKey()),
		commands.registerCommand(Commands.refresh, () => refresh())
	);
	console.log('Commands registered.');
}
