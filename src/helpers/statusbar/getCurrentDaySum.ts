import * as vscode from 'vscode';
import moment = require('moment');
import { getUser } from '../../api/actions/user';
import { getTimeentriesForUser } from '../../api/actions/timeEntry';

export async function getCurrentDaySum(): Promise<moment.Duration> {
	try {
		const config = vscode.workspace.getConfiguration('clockify');
		const workspaceId = <string>config.get('tracking.workspaceId')!;
		if (!workspaceId) {
			throw new Error();
		}
		const userId = (await getUser()!).id;

		let dayStart = moment()
			.hour(0)
			.minute(0)
			.second(0)
			.millisecond(0);
		let dayEnd = moment(dayStart).add(1, 'day');

		let sum = moment.duration(0);
		const timeEntries = await getTimeentriesForUser(
			workspaceId,
			userId,
			undefined,
			dayStart.toISOString(),
			dayEnd.toISOString(),
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			1,
			1000
		);
		if (timeEntries.length > 0) {
			timeEntries.forEach((timeEntry) => {
				sum.add(timeEntry.timeInterval.duration);
			});
		}

		return sum;
	} catch (err) {
		return moment.duration(0);
	}
}
