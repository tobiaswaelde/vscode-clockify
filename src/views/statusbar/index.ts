import { StatusBarActionItem } from './action-item';
import { ExtensionContext, StatusBarAlignment } from 'vscode';
import { StatusBarTrackingItem } from './tracking-item';

export class StatusBar {
	private static priority = 1000;
	private static actionItem: StatusBarActionItem;
	private static trackingItem: StatusBarTrackingItem;

	public static async initialize(ctx: ExtensionContext) {
		console.log('init statusbar');
		this.actionItem = new StatusBarActionItem(ctx, StatusBarAlignment.Right, this.priority + 1);
		this.trackingItem = new StatusBarTrackingItem(ctx, StatusBarAlignment.Right, this.priority);

		this.update();
	}

	public static async update() {
		console.log('[statusbar] update');
		this.actionItem.update();
		this.trackingItem.update();
	}
}
