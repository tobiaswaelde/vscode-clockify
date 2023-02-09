import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { Client } from '../../../../sdk/types/client';
import { sensify } from '../../../../util/data';
import { getIconPath } from '../../../../util/icon';

export class ClientItem extends TreeItem {
	contextValue = 'client';

	constructor(public client: Client) {
		super(sensify(client.name), TreeItemCollapsibleState.None);

		this.command = {
			command: 'clockify.clients.selection',
			title: '',
			arguments: [client],
		};

		this.tooltip = client.id;

		this.iconPath = getIconPath('clients');
	}
}
