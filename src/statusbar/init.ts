import * as vscode from 'vscode';
import { get90DayAverage } from '../helpers/statusbar/get90DayAverage';
import { getCurrentDaySum } from '../helpers/statusbar/getCurrentDaySum';
import moment = require('moment');
import { ICONS } from '../config/constants';

let statusBarItem: vscode.StatusBarItem;
let last90DaysAverage: moment.Duration;

export async function initStatusBarItem(context: vscode.ExtensionContext): Promise<void> {
	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.statusbar.menu', openStatusBarMenu)
	);

	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.text = 'Clockify';
	statusBarItem.command = 'clockify.statusbar.menu';
	statusBarItem.show();

	context.subscriptions.push(statusBarItem);

	last90DaysAverage = await get90DayAverage();
	updateStatusBarItem(context);
}

export function openStatusBarMenu() {
	console.log('status bar menu');
}

export async function updateStatusBarItem(context: vscode.ExtensionContext) {
	console.log('updateStatusBarItem');
	let isTracking = context.globalState.get<boolean>('tracking:isTracking');

	// Get daily average for last 90 days
	const codeTimeAvg = `${Math.round(last90DaysAverage.asHours() * 10) / 10} hrs`;
	// Sum up current day's tracked time
	const currentDaySum = await getCurrentDaySum();
	const codeTimeToday =
		currentDaySum.asHours() < 1
			? `${Math.round(currentDaySum.asMinutes() * 10) / 10} min`
			: `${Math.round(currentDaySum.asHours() * 10) / 10} hrs`;

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

	statusBarItem.text = `${codeTimeToday} | ${codeTimeAvg} ${isTracking ? ICONS.Clock : ''}`;
}
