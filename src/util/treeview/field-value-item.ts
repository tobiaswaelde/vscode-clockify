import { Command, MarkdownString, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { FieldValue } from '../../types/field-value';
import { getValueTypeIconPath } from '../icon';

export class FieldValueItem extends TreeItem {
	/**
	 * A tree item displaying a field value
	 * @param contextValue The context value of the itme
	 * @param value The field value
	 * @param tooltip enable or set the tooltip
	 */
	constructor(
		public contextValue: string,
		value: FieldValue,
		tooltip?: true | string | MarkdownString,
		public command?: Command
	) {
		super(value.name, TreeItemCollapsibleState.None);

		this.iconPath = value.icon && getValueTypeIconPath(value.icon);
		this.description = value.value.replace('\n', ' ');

		if (tooltip !== undefined) {
			if (tooltip === true) {
				this.tooltip = value.value;
			} else {
				this.tooltip = tooltip;
			}
		} else {
			this.tooltip = '';
		}
	}
}
