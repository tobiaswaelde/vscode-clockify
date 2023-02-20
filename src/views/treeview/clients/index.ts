import { MessageTreeItem } from '../../../util/treeview/message-tree-item';
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
import { selectClient } from './commands/select-client';
import { addClient } from './commands/add-client';
import { deleteClient } from './commands/delete-client';
import { renameClient } from './commands/rename-client';
import { TreeView } from '..';

type OnDidChangeEventData = ClientTreeItem | undefined;

export class ClientsProvider implements TreeDataProvider<ClientTreeItem> {
	private _onDidChangeTreeData: EventEmitter<OnDidChangeEventData> =
		new EventEmitter<OnDidChangeEventData>();
	readonly onDidChangeTreeData: Event<OnDidChangeEventData> = this._onDidChangeTreeData.event;

	constructor(context: ExtensionContext) {
		this.registerCommands(context);
	}

	getTreeItem(element: ClientItem): TreeItem | Thenable<TreeItem> {
		return element;
	}

	async getChildren(element?: ClientItem | undefined): Promise<ClientTreeItem[]> {
		const workspace = GlobalState.get('selectedWorkspace') as Workspace;

		if (!workspace) {
			return [new MessageTreeItem('Select workspace', undefined, 'info')];
		}

		// render client item
		if (element === undefined) {
			const limit = Config.get<number>('fetchLimit') ?? 200;

			const clients = await Clockify.getClients(workspace.id, { page: 1, pageSize: limit });

			// show info if no clients were found
			if (clients.length === 0) {
				return [new MessageTreeItem('No clients.', undefined, 'alert')];
			}

			// sort clients by name and return them
			clients.sort((a, b) => a.name.localeCompare(b.name));
			return clients.map((client) => new ClientItem(client));
		}

		// render client information
		if (element instanceof ClientItem) {
			return element.getChildren();
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
			commands.registerCommand(Commands.clientsRefresh, (x) => TreeView.refreshClients(x)),
			commands.registerCommand(Commands.clientsSelection, selectClient),
			commands.registerCommand(Commands.clientsAdd, addClient),
			commands.registerCommand(Commands.clientsRename, renameClient),
			commands.registerCommand(Commands.clientsDelete, (x) => deleteClient(x))
		);
	}
}
