import * as vscode from 'vscode';

export function showError(message: string, error?: any) {
	vscode.window.showErrorMessage(message);

	if (error) {
		console.error(message, error);
	}
}
