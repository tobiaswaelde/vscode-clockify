import { MessageTreeItem } from './../util/message-tree-item';
import { Config } from './../../../util/config';
import { Workspace } from '../../../sdk/types/workspace';
import {
	commands,
	Event,
	EventEmitter,
	ExtensionContext,
	TreeDataProvider,
	TreeItem,
} from 'vscode';
import { Clockify } from '../../../sdk';
import { GlobalState } from '../../../util/global-state';
import { ClientTreeItem } from './items';
import { ClientItem } from './items/item';
import { Commands } from '../../../config/commands';
import { refreshClients } from './commands/refresh-clients';
import { selectClient } from './commands/select-client';
import { addClient } from './commands/add-client';
import { deleteClient } from './commands/delete-client';
import { editClient } from './commands/edit-client';

type OnDidChangeEventData = ClientTreeItem | undefined;

export class ClientsProvider implements TreeDataProvider<ClientTreeItem> {
	private _onDidChangeTreeData: EventEmitter<OnDidChangeEventData> =
		new EventEmitter<OnDidChangeEventData>();
	readonly onDidChangeTreeData: Event<OnDidChangeEventData> = this._onDidChangeTreeData.event;

	constructor(private context: ExtensionContext) {
		this.registerCommands(context);
	}

	getTreeItem(element: ClientItem): TreeItem | Thenable<TreeItem> {
		return element;
	}

	async getChildren(element?: ClientItem | undefined): Promise<ClientTreeItem[]> {
		const workspace = GlobalState.get('selectedWorkspace') as Workspace;
		const limit = Config.get<number>('fetchLimit') ?? 200;

		if (!workspace) {
			return [new MessageTreeItem('Select workspace', undefined, 'info')];
		}

		// render client item
		if (element === undefined) {
			const clients = await Clockify.getClients(workspace.id, { page: 1, pageSize: limit });
			if (clients.length === 0) {
				return [new MessageTreeItem('No clients.', undefined, 'alert')];
			}

			clients.sort((a, b) => a.name.localeCompare(b.name));
			return clients.map((client) => new ClientItem(client));
		}

		return [];
	}

	/**
	 * Refresh tree view
	 * @param element The element to refresh
	 */
	public refresh(element?: ClientTreeItem): void {
		this._onDidChangeTreeData.fire(element);
	}

	/**
	 * Register commands related to the tree view provider
	 * @param ctx The extension context
	 */
	private registerCommands(ctx: ExtensionContext) {
		ctx.subscriptions.push(
			commands.registerCommand(Commands.clientsRefresh, () => refreshClients()),
			commands.registerCommand(Commands.clientsSelection, selectClient),
			commands.registerCommand(Commands.clientsAdd, addClient),
			commands.registerCommand(Commands.clientsEdit, editClient),
			commands.registerCommand(Commands.clientsDelete, (x) => deleteClient(x))
		);
	}
}
