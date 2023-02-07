import { Command, ThemeColor, ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';

type MessageTreeItemIconType = 'info' | 'alert' | 'error';

export class MessageTreeItem extends TreeItem {
	constructor(
		message: string,
		tooltip?: string,
		private icon?: MessageTreeItemIconType,
		command?: Command
	) {
		super('', TreeItemCollapsibleState.None);
		this.description = message;
		this.tooltip = tooltip;
		this.iconPath = icon && new ThemeIcon(icon, this.iconColor);
		this.command = command;
	}

	private get iconColor() {
		switch (this.icon) {
			case 'info':
				return new ThemeColor('charts.blue');
			case 'alert':
				return new ThemeColor('charts.orange');
			case 'error':
				return new ThemeColor('charts.red');
		}
	}
}
