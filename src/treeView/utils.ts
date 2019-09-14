import * as vscode from 'vscode';

let _context: vscode.ExtensionContext;

export function messageTreeItem(msg: string, tooltip?: string): any {
	const item = new vscode.TreeItem('', vscode.TreeItemCollapsibleState.None);
	item.tooltip = tooltip;
	item.description = msg;
	item.iconPath = undefined;
	return item;
}

export enum ContextValue {
	WorkspaceSelected = 'workspaces:selected'
}

export function setContext(key: ContextValue, value: any): void {
	vscode.commands.executeCommand('setContext', 'clockify:' + key, value);
}
export function setContextObject(context: vscode.ExtensionContext) {
	_context = context;
}
