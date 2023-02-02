import * as vscode from 'vscode';

let configuration = vscode.workspace.getConfiguration('clockify');

export function getConfiguration(): vscode.WorkspaceConfiguration {
	return configuration;
}

export function getConfig(key: string) {
	let configuration = vscode.workspace.getConfiguration('clockify');
	return configuration.get(key);
}
export function updateConfig(key: string, value: any) {
	let configuration = vscode.workspace.getConfiguration('clockify');
	configuration.update(key, value, false);
}
