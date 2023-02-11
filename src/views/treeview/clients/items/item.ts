import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { Commands } from '../../../../config/commands';
import { Client } from '../../../../sdk/types/client';
import { sensify } from '../../../../util/data';
import { GlobalState } from '../../../../util/global-state';

export class ClientItem extends TreeItem {
	contextValue = 'client';

	constructor(public client: Client) {
		const selectedClient = GlobalState.get<Client>('selectedClient');
		const selected = client.id === selectedClient?.id;

		super(sensify(client.name), TreeItemCollapsibleState.Collapsed);

		this.command = {
			command: Commands.clientsSelection,
			title: '',
			arguments: [client],
		};

		this.iconPath = new ThemeIcon(selected ? 'circle-filled' : 'circle-outline');
	}
}
