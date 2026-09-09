import * as vscode from 'vscode';
import { ConfigurationKey } from '../config/config';

/**
 * Handles extensions config
 */
export class Config {
	/**
	 * Get the extensions workspace configuration
	 * @returns The configuration object
	 */
	private static getConfiguration(scope?: vscode.Uri): vscode.WorkspaceConfiguration {
		return vscode.workspace.getConfiguration('clockify', scope);
	}

	/**
	 * Gets the value for the given key in the extensions configuration
	 * @param {ConfigurationKey} key The key
	 * @returns The value
	 */
	public static get<T>(key: ConfigurationKey, scope?: vscode.Uri): T | undefined {
		const config = this.getConfiguration(scope);
		return config.get<T>(key);
	}

	/**
	 * Resolve the workspace folder whose resource-scoped tracking settings apply.
	 */
	public static getTrackingScope(): vscode.Uri | undefined {
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
			const activeFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
			if (activeFolder) {
				return activeFolder.uri;
			}
		}

		const folders = vscode.workspace.workspaceFolders ?? [];
		if (folders.length === 1) {
			return folders[0].uri;
		}

		const linkedFolders = folders.filter((folder) => {
			const configuration = this.getConfiguration(folder.uri);
			return (
				configuration.inspect<boolean>('tracking.autostart')?.workspaceFolderValue === true &&
				Boolean(configuration.inspect<string>('tracking.projectId')?.workspaceFolderValue)
			);
		});

		return linkedFolders.length === 1 ? linkedFolders[0].uri : undefined;
	}

	/**
	 * Update the value for the given key in the extensions configuration
	 * @param {ConfigurationKey} key The key
	 * @param {any} value The value
	 * @param {boolean|undefined} global The target of the configuration
	 *	- If `true` updates global settings.
	 *	- If `false` updates workspace.
	 *	- If `undefined` or `null` updates workspace folder settings
	 */
	public static async set(
		key: ConfigurationKey,
		value: unknown,
		target: vscode.ConfigurationTarget | boolean | null = null,
		scope?: vscode.Uri
	): Promise<void> {
		const config = this.getConfiguration(scope);
		await config.update(key, value, target);
	}
}
