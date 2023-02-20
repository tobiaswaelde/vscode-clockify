import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { ClientTreeItem } from '.';
import { Commands } from '../../../../config/commands';
import { Client } from '../../../../sdk/types/client';
import { Config } from '../../../../util/config';
import { sensify } from '../../../../util/data';
import { GlobalState } from '../../../../util/global-state';
import { FieldValueItem } from '../../../../util/treeview/field-value-item';
import { IdValueItem } from '../../../../util/treeview/id-value-item';

export class ClientItem extends TreeItem {
	contextValue = 'client';

	constructor(public client: Client) {
		const selectedClient = GlobalState.get<Client>('selectedClient');
		const isSelected = client.id === selectedClient?.id;

		super(sensify(client.name), TreeItemCollapsibleState.Collapsed);

		this.command = {
			command: Commands.clientsSelection,
			title: '',
			arguments: [client],
		};

		this.iconPath = new ThemeIcon(isSelected ? 'circle-filled' : 'circle-outline');
	}

	public async getChildren(): Promise<ClientTreeItem[]> {
		const showIds = Config.get<boolean>('showIds');
		const { id, email, address, note } = this.client;

		const items: ClientTreeItem[] = [];
		if (showIds) {
			items.push(new IdValueItem('client.id', id));
		}
		items.push(
			new FieldValueItem('client.email', {
				name: 'Email',
				value: sensify(email ?? ''),
				icon: 'string',
			})
		);
		items.push(
			new FieldValueItem(
				'client.address',
				{ name: 'Address', value: sensify(address ?? ''), icon: 'geopoint' },
				true
			)
		);
		items.push(
			new FieldValueItem(
				'client.note',
				{ name: 'Note', value: sensify(note ?? ''), icon: 'string-abc' },
				true
			)
		);

		return items;
	}
}
