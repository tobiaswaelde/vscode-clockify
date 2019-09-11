import * as vscode from 'vscode';

let configuration = vscode.workspace.getConfiguration('clockify');

export function getConfiguration(): vscode.WorkspaceConfiguration {
	return configuration;
}
