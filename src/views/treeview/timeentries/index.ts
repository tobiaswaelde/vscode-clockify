import { Workspace } from './../../../sdk/types/workspace';
import { commands, Event, EventEmitter, ExtensionContext, TreeDataProvider } from 'vscode';
import { Commands } from '../../../config/commands';
import { Clockify } from '../../../sdk';
import { GlobalState } from '../../../util/global-state';
import { TimeentryTreeItem } from './items';
import { MessageTreeItem } from '../../../util/treeview/message-tree-item';
import { Config } from '../../../util/config';
import { TimeentryItem } from './items/item';
import { TreeView } from '..';

type OnDidChangeEventData = TimeentryTreeItem | undefined;

export class TimeentriesProvider implements TreeDataProvider<TimeentryTreeItem> {
	private _onDidChangeTreeData: EventEmitter<OnDidChangeEventData> =
		new EventEmitter<OnDidChangeEventData>();
	readonly onDidChangeTreeData: Event<OnDidChangeEventData> = this._onDidChangeTreeData.event;

	constructor(context: ExtensionContext) {
		this.registerCommands(context);
	}

	getTreeItem(element: TimeentryTreeItem): TimeentryTreeItem | Thenable<TimeentryTreeItem> {
		return element;
	}

	async getChildren(element?: TimeentryTreeItem | undefined): Promise<TimeentryTreeItem[]> {
		const workspace = GlobalState.get<Workspace>('selectedWorkspace');

		// check if workspace is selected
		if (!workspace) {
			return [
				new MessageTreeItem('Select a workspace to display time entries.', undefined, 'info'),
			];
		}

		// get time entries items
		if (element === undefined) {
			const limit = Config.get<number>('fetchLimit') ?? 200;
			const user = await Clockify.getCurrentUser();
			if (!user) {
				return [new MessageTreeItem('Error getting current user.', undefined, 'error')];
			}
			const timeentries = await Clockify.getTimeEntriesForUser(workspace.id, user.id, {
				page: 1,
				pageSize: limit,
			});
			return timeentries.map((x) => new TimeentryItem(x));
		}

		// render time entry info items
		if (element instanceof TimeentryItem) {
			return element.getChildren();
		}

		return [];
	}

	/**
	 * Refresh tree view
	 * @param element The element to refresh
	 */
	public refresh(element?: TimeentryTreeItem): void {
		this._onDidChangeTreeData.fire(element);
	}

	/**
	 * Register commands related to the tree view provider
	 * @param ctx The extension context
	 */
	private registerCommands(ctx: ExtensionContext) {
		ctx.subscriptions.push(
			commands.registerCommand(Commands.timeentriesRefresh, (x) => TreeView.refreshTimeentries(x))
		);
	}
}
