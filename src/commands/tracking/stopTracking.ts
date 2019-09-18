import * as vscode from 'vscode';
import * as moment from 'moment';
import { stopTimeentry } from '../../api/actions/timeEntry';
import { StopTimeEntryRequest } from '../../api/interfaces';
import { getUser } from '../../api/actions/user';
import { getConfig } from '../../config/config';
import { selectWorkspace } from '../selectWorkspace';
import { updateStatusBarItem } from '../../statusbar/init';

export async function stopTracking(context: vscode.ExtensionContext) {
	const workspaceId = context.globalState.get<string>('workspaceId');
	if (!workspaceId) {
		context.globalState.update('tracking:isTracking', false);
		updateStatusBarItem(context);
		return;
	}

	try {
		let user = await getUser();

		let newTimeentry: StopTimeEntryRequest = {
			end: new Date().toISOString()
		};
		let timeentry = await stopTimeentry(workspaceId, user.id, newTimeentry);
		let duration = moment.duration(timeentry.timeInterval.duration).humanize() || '';

		vscode.window.showInformationMessage(`You worked ${duration} on ${timeentry.description}`);

		// Update status bar item
		await context.globalState.update('tracking:isTracking', false);
		updateStatusBarItem(context);
	} catch (err) {
		//
	}
}
