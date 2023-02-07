import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { FieldValue } from '../../../../types/field-value';
import { getValueTypeIconPath } from '../../../../util/icon';

export class WorkspaceInfoItem extends TreeItem {
	contextValue = 'workspaces.info';

	constructor(value: FieldValue) {
		super(value.name, TreeItemCollapsibleState.None);

		this.iconPath = value.icon && getValueTypeIconPath(value.icon);

		this.description = value.value;

		this.tooltip = value.value;
	}
}
