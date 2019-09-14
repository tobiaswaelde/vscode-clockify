import * as vscode from 'vscode';
import * as moment from 'moment';
import { stopTimeentry } from '../api/timeEntry';
import { StopTimeEntryRequest } from '../api/interfaces';
import { getUser } from '../api/user';
import { getConfig } from '../config/config';
import { selectWorkspace } from './selectWorkspace';

export async function stopTracking() {
	let workspaceId = <string>getConfig('workspaceId');
	if (!workspaceId) {
		await selectWorkspace();
		workspaceId = <string>getConfig('workspaceId');
		if (!workspaceId) {
			return;
		}
	}

	try {
		let user = await getUser();

		let newTimeentry: StopTimeEntryRequest = {
			end: new Date().toISOString()
		};
		let timeentry = await stopTimeentry(workspaceId, user.id, newTimeentry);
		let duration = moment.duration(timeentry.timeInterval.duration).humanize() || '';
		await vscode.window.showInformationMessage(
			`You worked ${duration} on ${timeentry.description}`
		);
	} catch (err) {}
}
