import { TreeItem, TreeItemCollapsibleState, ThemeIcon } from 'vscode';
import { Tag } from '../../../../sdk/types/tag';
import { sensify } from '../../../../util/data';

export class TagItem extends TreeItem {
	contextValue = 'tag';

	constructor(public tag: Tag) {
		super(sensify(tag.name), TreeItemCollapsibleState.None);

		this.iconPath = new ThemeIcon('tag');

		if (tag.archived) {
			this.contextValue = 'tag-archived';
			this.description = 'archived';
		}
	}
}
