import { TreeItem, TreeItemCollapsibleState, ThemeIcon } from 'vscode';
import { Tag } from '../../../../sdk/types/tag';
import { sensify } from '../../../../util/data';

export class TagItem extends TreeItem {
	contextValue = 'tag';

	constructor(public tag: Tag) {
		super(sensify(tag.name), TreeItemCollapsibleState.None);

		this.iconPath = new ThemeIcon('tag');
		this.description = tag.archived ? 'Archived' : undefined;
	}
}
