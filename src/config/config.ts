import * as vscode from 'vscode';

let configuration = vscode.workspace.getConfiguration('clockify');

export function getConfiguration(): vscode.WorkspaceConfiguration {
	return configuration;
}

export function getConfig(key: string) {
	return configuration.get(key);
}
export function updateConfig(key: string, value: any) {
	configuration.update(key, value, false);
}
