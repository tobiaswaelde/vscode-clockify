import * as vscode from 'vscode';
import moment = require('moment');
import { getUser } from '../../api/actions/user';
import { getTimeentriesForUser } from '../../api/actions/timeEntry';

export async function get90DayAverage(): Promise<moment.Duration> {
	try {
		const config = vscode.workspace.getConfiguration('clockify');
		const workspaceId = <string>config.get('tracking.workspaceId')!;
		if (!workspaceId) {
			throw new Error();
		}
		const userId = (await getUser()!).id;

		let startDate = moment()
			.subtract(90, 'days')
			.hour(0)
			.minute(0)
			.second(0)
			.millisecond(0);
		let endDate = moment()
			.subtract(1, 'day')
			.hour(0)
			.minute(0)
			.second(0)
			.millisecond(0);

		let sum = moment.duration(0);
		let count = 0;
		for (let dayStart = moment(startDate); dayStart <= endDate; dayStart.add(1, 'day')) {
			let dayEnd = moment(dayStart).add(1, 'day');

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
					count++;
				});
			}
		}

		const milliseconds = sum.asMilliseconds();
		if (milliseconds < 1000) {
			throw new Error();
		}
		const avgMilliseconds = milliseconds / count;
		const avgDuration = moment.duration(avgMilliseconds, 'milliseconds');

		return avgDuration;
	} catch (err) {
		return moment.duration(0);
	}
}
