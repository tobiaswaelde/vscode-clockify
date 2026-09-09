import { StatusBarActionItem } from './action-item';
import { ExtensionContext, StatusBarAlignment } from 'vscode';
import { StatusBarTrackingItem } from './tracking-item';

export class StatusBar {
	private static priority = 1000;
	private static actionItem: StatusBarActionItem;
	private static trackingItem: StatusBarTrackingItem;

	public static initialize(ctx: ExtensionContext) {
		this.actionItem = new StatusBarActionItem(ctx, StatusBarAlignment.Right, this.priority + 1);
		this.trackingItem = new StatusBarTrackingItem(ctx, StatusBarAlignment.Right, this.priority);

		this.update();
	}

	public static update() {
		this.actionItem.update();
		this.trackingItem.update();
	}
}
