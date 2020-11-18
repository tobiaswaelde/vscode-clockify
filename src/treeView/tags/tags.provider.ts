import * as vscode from 'vscode';
import { getFilePath, messageTreeItem } from '../utils';
import { TagDto, WorkspaceDto } from '../../api/interfaces';
import { getTags } from '../../api/actions/tag';

export class TagsProvider implements vscode.TreeDataProvider<TagProviderItem> {
	private _onDidChangeTreeData = new vscode.EventEmitter<TagProviderItem | undefined>();
	readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

	constructor(private context: vscode.ExtensionContext) {}

	refresh(element?: TagProviderItem): void {
		this._onDidChangeTreeData.fire(element);
	}

	getTreeItem(element: TagProviderItem): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: TagProviderItem): Promise<TagProviderItem[]> {
		const workspace = this.context.globalState.get<WorkspaceDto>('selectedWorkspace');
		const config = vscode.workspace.getConfiguration('clockify');
		const limit = config.get<number>('downloadLimit')!;

		if (!workspace) {
			return [messageTreeItem('Select workspace')];
		}

		if (!element) {
			try {
				const tags = await getTags(workspace.id, undefined, 1, limit);
				if (tags.length === 0) {
					return [messageTreeItem('No Tags')];
				}
				return tags
					.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)) // Sort A>Z
					.map((tag) => {
						return new TagItem(tag);
					});
			} catch (err) {
				return [messageTreeItem('Error', undefined, 'alert')];
			}
		} else if (element instanceof TagItem) {
			return [];
		} else {
			console.error('Should not happen', element);
			return [];
		}
	}
}

export type TagProviderItem = TagItem;

export class TagItem extends vscode.TreeItem {
	contextValue = 'tags';
	iconPath = getFilePath('assets', 'clockify', 'dark', 'tags.svg');

	constructor(public tag: TagDto) {
		super(tag.name, vscode.TreeItemCollapsibleState.None);
	}

	get tooltip(): string {
		return this.tag.id;
	}
}
