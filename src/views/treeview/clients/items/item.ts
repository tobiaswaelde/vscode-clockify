import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { Commands } from '../../../../config/commands';
import { Client } from '../../../../sdk/types/client';
import { sensify } from '../../../../util/data';
import { getIconPath } from '../../../../util/icon';

export class ClientItem extends TreeItem {
	contextValue = 'client';

	constructor(public client: Client) {
		super(sensify(client.name), TreeItemCollapsibleState.Collapsed);

		this.command = {
			command: Commands.clientsSelection,
			title: '',
			arguments: [client],
		};

		this.iconPath = getIconPath('clients');
	}
}
