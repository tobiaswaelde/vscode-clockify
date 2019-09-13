import * as vscode from 'vscode';

export interface ProjectQuickPickItem extends vscode.QuickPickItem {
	id: string;
}
export interface TaskQuickPickItem extends vscode.QuickPickItem {
	id: string;
}
export interface TagQuickPickItem extends vscode.QuickPickItem {
	id: string;
}
