export type LegacyApiKeyConfiguration = {
	globalValue?: string;
	workspaceValue?: string;
	workspaceFolderValue?: string;
};

export function getLegacyApiKey(configuration: LegacyApiKeyConfiguration): string | undefined {
	return (
		configuration.workspaceFolderValue ??
		configuration.workspaceValue ??
		configuration.globalValue
	);
}
