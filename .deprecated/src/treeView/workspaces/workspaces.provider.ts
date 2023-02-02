import * as vscode from 'vscode';
import {
	messageTreeItem,
	FieldValue,
	IconType,
	getFilePath,
	setContext,
	ContextValue
} from '../utils';
import { getWorkspaces } from '../../api/actions/workspace';
import { WorkspaceDto } from '../../api/interfaces';
import http from '../../services/http.service';

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
		const config = vscode.workspace.getConfiguration('clockify');
		const apiKey = config.get<string>('apiKey')!;
		if (!apiKey) {
			return [
				messageTreeItem('API key not set', 'Click to set API key', 'alert', {
					command: 'clockify.setApiKey',
					title: 'Set API key'
				})
			];
		}

		if (!element) {
			try {
				const workspaces = await getWorkspaces();
				if (workspaces.length === 0) {
					return [messageTreeItem('No workspaces')];
				}
				return workspaces
					.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)) // Sort A>Z
					.map((workspace) => {
						return new WorkspaceItem(workspace);
					});
			} catch (err) {
				return [messageTreeItem('Error', undefined, 'alert')];
			}
		} else if (element instanceof WorkspaceItem) {
			const workspace = element.workspace;
			let items: WorkspaceProviderItem[] = [];

			items.push(
				// new WorkspaceInfoItem({ name: 'ID', value: workspace.id }, IconType.Number),
				// new WorkspaceInfoItem({ name: 'Name', value: workspace.name }, IconType.String),
				new WorkspaceInfoItem(
					{
						name: 'Hourly Rate',
						value: `${Math.round((workspace.hourlyRate.amount / 100) * 100) / 100} ${
							workspace.hourlyRate.currency
						}`
					},
					IconType.Number
				)
			);

			return items;
		} else if (element instanceof WorkspaceInfoItem) {
			return [];
		} else {
			console.error('Should not happen!', element);
			return [];
		}
	}
}

export type WorkspaceProviderItem = WorkspaceItem | WorkspaceInfoItem;

export class WorkspaceItem extends vscode.TreeItem {
	contextValue = 'workspace';
	iconPath = getFilePath('assets', 'clockify', 'dark', 'workspaces.svg');

	constructor(public workspace: WorkspaceDto) {
		super(workspace.name, vscode.TreeItemCollapsibleState.Collapsed);
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

export class WorkspaceInfoItem extends vscode.TreeItem {
	contextValue = 'workspaces.info';
	iconPath: string;

	constructor(public fieldValue: FieldValue, public iconType: IconType) {
		super(fieldValue.name, vscode.TreeItemCollapsibleState.None);

		this.iconPath = getFilePath('assets', 'valuetype', `${iconType}.svg`);
		this.description = fieldValue.value;
	}

	get tooltip(): string {
		return this.fieldValue.value;
	}
}
