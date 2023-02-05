import * as vscode from 'vscode';

/**
 * Handles extensions config
 */
export class Config {
	/**
	 * Get the extensions workspace configuration
	 * @returns The configuration object
	 */
	private static getConfiguration(): vscode.WorkspaceConfiguration {
		return vscode.workspace.getConfiguration('clockify');
	}

	/**
	 * Gets the value for the given key in the extensions configuration
	 * @param {string} key The key
	 * @returns The value
	 */
	public static getConfig<T>(key: string): T | undefined {
		let config = this.getConfiguration();
		return config.get<T>(key);
	}

	/**
	 * Update the value for the given key in the extensions configuration
	 * @param {string} key The key
	 * @param {any} value The value
	 * @param {boolean|undefined} global The target of the configuration
	 *	- If `true` updates global settings.
	 *	- If `false` updates workspace.
	 *	- If `undefined` or `null` updates workspace folder settings
	 */
	public static setConfig(key: string, value: any, global: boolean | null = null) {
		let config = this.getConfiguration();
		config.update(key, value, global);
	}
}
