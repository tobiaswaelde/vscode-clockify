import moment = require('moment');
import {
	ExtensionContext,
	StatusBarItem,
	window,
	StatusBarAlignment,
	MarkdownString,
} from 'vscode';
import { Tracking } from '../../helpers/tracking';

export class StatusBarTrackingItem {
	public readonly item: StatusBarItem;

	constructor(ctx: ExtensionContext, alignment: StatusBarAlignment, priority: number) {
		this.item = window.createStatusBarItem(alignment, priority);
		this.item.show();
		ctx.subscriptions.push(this.item);

		this.item.text = 'Clockify';
		this.item.name = 'Current Tracking';
		this.item.tooltip = 'Start tracking to display information.';
	}

	public async update() {
		if (Tracking.isTracking && Tracking.timeEntry) {
			const duration = moment.duration(
				moment().diff(moment(Tracking.timeEntry.timeInterval.start))
			);

			this.item.text = duration.format('h[h] m[m] s[s]');

			const tooltipLines: string[] = [];
			if (Tracking.description) {
				tooltipLines.push(Tracking.description);
			}
			if (Tracking.workspace) {
				tooltipLines.push(`**Workspace:** ${Tracking.workspace.name}`);
			}
			if (Tracking.project) {
				tooltipLines.push(`**Project:** ${Tracking.project.name}`);
			}
			if (Tracking.task) {
				tooltipLines.push(`**Task:** ${Tracking.task.name}`);
			}
			this.item.tooltip = new MarkdownString(tooltipLines.join('\n\n'));
		} else {
			this.item.text = 'Clockify';
			this.item.name = 'Current Tracking';
			this.item.tooltip = 'Start tracking to display information.';
		}
	}
}
