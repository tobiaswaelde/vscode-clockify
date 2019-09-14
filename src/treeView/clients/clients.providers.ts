import * as vscode from 'vscode';
import { getFilePath, messageTreeItem } from '../utils';
import { ClientDto, WorkspaceDto } from '../../api/interfaces';
import { getClients } from '../../api/actions/client';

export class ClientsProvider implements vscode.TreeDataProvider<ClientProviderItem> {
	private _onDidChangeTreeData = new vscode.EventEmitter<ClientProviderItem | undefined>();
	readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

	constructor(private context: vscode.ExtensionContext) {}

	refresh(element?: ClientProviderItem): void {
		this._onDidChangeTreeData.fire(element);
	}

	getTreeItem(element: ClientProviderItem): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: ClientProviderItem): Promise<ClientProviderItem[]> {
		const workspace = this.context.globalState.get<WorkspaceDto>('selectedWorkspace');
		if (!workspace) {
			return [messageTreeItem('Select workspace')];
		}

		if (!element) {
			try {
				const clients = await getClients(workspace.id);
				if (clients.length === 0) {
					return [messageTreeItem('No clients')];
				}
				return clients.map((client) => {
					return new ClientItem(client);
				});
			} catch (err) {
				return [messageTreeItem('Error', undefined, 'alert')];
			}
		} else if (element instanceof ClientItem) {
			return [];
		} else {
			console.error('Should not happen!', element);
			return [];
		}
	}
}

export type ClientProviderItem = ClientItem;

export class ClientItem extends vscode.TreeItem {
	contextValue = 'client';
	iconPath = getFilePath('assets', 'clockify', 'dark', 'clients.svg');

	constructor(public client: ClientDto) {
		super(client.name, vscode.TreeItemCollapsibleState.None);
	}

	get tooltip(): string {
		return this.client.id;
	}
}
