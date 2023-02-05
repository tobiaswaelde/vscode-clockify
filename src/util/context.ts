import { ExtensionContext, commands } from 'vscode';
import { ContextValueKey } from '../config/context';

/**
 * Handles extension context
 */
export class Context {
	private static _context: ExtensionContext;

	/**
	 * Sets the extensions context object
	 * @param context The context object
	 */
	public static setObject(ctx: ExtensionContext) {
		this._context = ctx;
	}

	/**
	 * Get the extensions context object
	 * @returns The extensions context object
	 */
	public static get(): ExtensionContext {
		return this._context;
	}

	/**
	 * Set value in the extension context
	 * @param {ContextValue} key The key
	 * @param {any} value The value
	 */
	public static set(key: ContextValueKey, value: any) {
		commands.executeCommand('setContext', `clockify.${key}`, value);
	}
}
