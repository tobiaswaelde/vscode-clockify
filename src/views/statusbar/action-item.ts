import { StatusBarItem, window, StatusBarAlignment, ExtensionContext } from 'vscode';
import { Commands } from '../../config/commands';
import { Tracking } from '../../helpers/tracking';

export class StatusBarActionItem {
	public readonly item: StatusBarItem;

	constructor(ctx: ExtensionContext, alignment: StatusBarAlignment, priority: number) {
		this.item = window.createStatusBarItem(alignment, priority);
		this.item.show();
		ctx.subscriptions.push(this.item);

		this.item.text = '$(play)';
		this.item.name = 'Tracking Status';
		this.item.tooltip = 'Start Tracking';
		this.item.command = Commands.trackingStart;
	}

	public update() {
		if (Tracking.isTracking) {
			this.item.text = '$(debug-pause)';
			this.item.tooltip = 'Stop Tracking';
			this.item.command = Commands.trackingStop;
		} else {
			this.item.text = '$(play)';
			this.item.tooltip = 'Start Tracking';
			this.item.command = Commands.trackingStart;
		}
	}
}
