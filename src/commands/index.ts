import { ExtensionContext, commands } from 'vscode';
import { Commands } from '../config/commands';
import { setApiKey } from './set-api-key';

/**
 * Register general commands
 * @param {ExtensionContext} ctx The extension context
 */
export async function registerCommands(ctx: ExtensionContext) {
	ctx.subscriptions.push(commands.registerCommand(Commands.setApiKey, setApiKey));
}
