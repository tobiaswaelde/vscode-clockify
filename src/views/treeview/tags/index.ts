import { MessageTreeItem } from './../../../util/treeview/message-tree-item';
import { Workspace } from './../../../sdk/types/workspace';
import {
	commands,
	Event,
	EventEmitter,
	ExtensionContext,
	TreeDataProvider,
	TreeItem,
} from 'vscode';
import { Commands } from '../../../config/commands';
import { Clockify } from '../../../sdk';
import { GlobalState } from '../../../util/global-state';
import { addTag } from './commands/add-tag';
import { TagTreeItem } from './items';
import { Config } from '../../../util/config';
import { TagItem } from './items/item';
import { renameTag } from './commands/rename-tag';
import { deleteTag } from './commands/delete-tag';
import { archiveTag } from './commands/archive-tag';
import { TreeView } from '..';

type OnDidChangeEventData = TagTreeItem | undefined;

export class TagsProvider implements TreeDataProvider<TagTreeItem> {
	private _onDidChangeTreeData: EventEmitter<OnDidChangeEventData> =
		new EventEmitter<OnDidChangeEventData>();
	readonly onDidChangeTreeData: Event<OnDidChangeEventData> = this._onDidChangeTreeData.event;

	constructor(context: ExtensionContext) {
		this.registerCommands(context);
	}

	getTreeItem(element: TagTreeItem): TreeItem | Thenable<TreeItem> {
		return element;
	}

	async getChildren(element?: TagTreeItem | undefined): Promise<TagTreeItem[]> {
		const workspace = GlobalState.get<Workspace>('selectedWorkspace');

		// check if workspace is selected
		if (!workspace) {
			return [new MessageTreeItem('Select a workspace to display tags.', undefined, 'info')];
		}

		if (element === undefined) {
			const limit = Config.get<number>('fetchLimit') ?? 200;
			const tags = await Clockify.getTags(workspace.id, { page: 1, pageSize: limit });

			// show info if no tags were found
			if (tags.length === 0) {
				return [
					new MessageTreeItem('No tags found for the selected workspace.', undefined, 'info'),
				];
			}

			// order tags by name and archive status and return them
			tags.sort((a, b) => a.name.localeCompare(b.name));
			const normalTags = tags.filter((x) => x.archived === false);
			const archivedTags = tags.filter((x) => x.archived === true);
			return [...normalTags, ...archivedTags].map((x) => new TagItem(x));
		}

		return [];
	}

	/**
	 * Refresh tree view
	 * @param element The element to refresh
	 */
	public refresh(element?: TagTreeItem): void {
		this._onDidChangeTreeData.fire(element);
	}

	/**
	 * Register commands related to the tree view provider
	 * @param ctx The extension context
	 */
	private registerCommands(ctx: ExtensionContext) {
		ctx.subscriptions.push(
			commands.registerCommand(Commands.tagsRefresh, (x) => TreeView.refreshTags(x)),
			commands.registerCommand(Commands.tagsAdd, addTag),
			commands.registerCommand(Commands.tagsRename, renameTag),
			commands.registerCommand(Commands.tagsDelete, (x) => deleteTag(x)),
			commands.registerCommand(Commands.tagsArchive, (x) => archiveTag(x, true)),
			commands.registerCommand(Commands.tagsUnarchive, (x) => archiveTag(x, false))
		);
	}
}
