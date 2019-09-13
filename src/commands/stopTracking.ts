import * as vscode from 'vscode';
import { stopTimeentry } from '../actions/timeEntry';
import { StopTimeEntryRequest } from '../interfaces/interfaces';
import { getUser } from '../actions/user';

export async function stopTracking(workspaceId: string) {
	try {
		let user = await getUser();

		let newTimeentry: StopTimeEntryRequest = {
			end: new Date().toISOString()
		};
		let timeentry = await stopTimeentry(workspaceId, user.id, newTimeentry);
		let duration = timeentry.timeInterval.duration;
		await vscode.window.showInformationMessage(
			`You worked ${duration} on ${timeentry.description}`
		);
	} catch (err) {}
}
