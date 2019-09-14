import * as vscode from 'vscode';
import { messageTreeItem } from '../utils';
import { getWorkspaces } from '../../api/workspace';
import { WorkspaceDto } from '../../api/interfaces';

export class WorkspacesProvider implements vscode.TreeDataProvider<WorkspaceProviderItem> {
	private _onDidChangeTreeData = new vscode.EventEmitter<WorkspaceProviderItem | undefined>();
	readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

	constructor(private context: vscode.ExtensionContext) {}

	refresh(element?: WorkspaceProviderItem): void {
		this._onDidChangeTreeData.fire(element);
	}

	getTreeItem(element: WorkspaceProviderItem): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: WorkspaceProviderItem): Promise<WorkspaceProviderItem[]> {
		if (!element) {
			try {
				const workspaces = await getWorkspaces();
				return workspaces.map((workspace) => {
					return new WorkspaceItem(workspace);
				});
			} catch (err) {
				return [messageTreeItem('No workspaces')];
			}
		} else {
			console.error('Should not happen!', element);
			return [];
		}
	}
}

export type WorkspaceProviderItem = WorkspaceItem;

export class WorkspaceItem extends vscode.TreeItem {
	contextValue = 'workspace';

	constructor(public workspace: WorkspaceDto) {
		super(workspace.name, vscode.TreeItemCollapsibleState.None);
	}

	readonly command: vscode.Command = {
		command: 'clockify.workspaces.selection',
		title: '',
		arguments: [this.workspace]
	};

	get tooltip(): string {
		return this.workspace.id;
	}
}
