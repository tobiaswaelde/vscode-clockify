import { ConfigurationTarget, workspace } from 'vscode';
import { Context } from './context';
import { getLegacyApiKey } from './api-key-values';

const SECRET_KEY = 'clockify.apiKey';

export class ApiKey {
	public static get(): Thenable<string | undefined> {
		return Context.get().secrets.get(SECRET_KEY);
	}

	public static set(value: string): Thenable<void> {
		return Context.get().secrets.store(SECRET_KEY, value);
	}

	/**
	 * Move API keys saved by older releases from settings into VS Code SecretStorage.
	 */
	public static async migrateLegacyConfiguration(): Promise<void> {
		const configuration = workspace.getConfiguration('clockify');
		const legacy = configuration.inspect<string>('apiKey');
		if (!legacy) {
			return;
		}

		const configuredValue = getLegacyApiKey(legacy);
		if (!(await this.get()) && configuredValue) {
			await this.set(configuredValue);
		}

		const legacyTargets: Array<[string | undefined, ConfigurationTarget]> = [
			[legacy.workspaceFolderValue, ConfigurationTarget.WorkspaceFolder],
			[legacy.workspaceValue, ConfigurationTarget.Workspace],
			[legacy.globalValue, ConfigurationTarget.Global],
		];
		for (const [value, target] of legacyTargets) {
			if (value !== undefined) {
				await configuration.update('apiKey', undefined, target);
			}
		}
	}
}
