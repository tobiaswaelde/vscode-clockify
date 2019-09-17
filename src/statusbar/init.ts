import * as vscode from 'vscode';
import { get90DayAverage } from '../helpers/statusbar/get90DayAverage';
import { getCurrentDaySum } from '../helpers/statusbar/getCurrentDaySum';
import moment = require('moment');
import { ICONS } from '../config/constants';

let statusBarItem: vscode.StatusBarItem;

export async function initStatusBarItem(context: vscode.ExtensionContext): Promise<void> {
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.text = 'Clockify';
	statusBarItem.command = 'clockify.tracker.toggle';
	statusBarItem.show();

	context.subscriptions.push(statusBarItem);
	updateStatusBarItem();
}

export async function updateStatusBarItem() {
	let isTracking = true;

	// Get daily average for last 90 days
	const last90DaysAverage = await get90DayAverage();
	const codeTimeAvg = Math.round(last90DaysAverage.asHours() * 100) / 100;
	// Sum up current day's tracked time
	const currentDaySum = await getCurrentDaySum();
	const codeTimeToday = Math.round(currentDaySum.asHours() * 100) / 100;

	//#region Get color
	let color = '#2196f3';
	// red >1h below avg
	if (
		moment
			.duration(currentDaySum)
			.add(1, 'hour')
			.asMilliseconds() < last90DaysAverage.asMilliseconds()
	) {
		color = '#f44336';
	}
	// orange <1h below avg
	else if (currentDaySum.asMilliseconds() < last90DaysAverage.asMilliseconds()) {
		color = '#ff9800';
	}
	// blue == avg
	else if (currentDaySum.asMilliseconds() === last90DaysAverage.asMilliseconds()) {
		color = '#2196f3';
	}
	// green >= avg
	else {
		color = '#4caf50';
	}
	statusBarItem.color = color;
	//#endregion

	statusBarItem.tooltip = `Code time today vs. your daily average.${
		isTracking ? ` ${ICONS.Bullet} Tracking...` : ''
	}`;

	statusBarItem.text = `${codeTimeToday} hrs | ${codeTimeAvg} hrs ${
		isTracking ? ICONS.Clock : ''
	}`;
}
