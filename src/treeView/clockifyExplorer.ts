import * as vscode from 'vscode';
import * as fs from 'fs';

export class ClockifyExplorerProvider implements vscode.TreeDataProvider<Workspace> {
	constructor(private workspaceRoot: string) {}

	getTreeItem(element: Workspace): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Workspace): Thenable<Workspace[]> {
		return Promise.resolve([]);
	}
}

export class Workspace extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	contextValue = 'workspace';
}
