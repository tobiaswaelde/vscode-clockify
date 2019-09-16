import * as vscode from 'vscode';

export async function initStatusBarItem(context: vscode.ExtensionContext): Promise<void> {
	let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.color = 'var(--vscode-gitDecoration-untrackedResourceForeground)';
	statusBarItem.text = 'Clockify';
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);
}
