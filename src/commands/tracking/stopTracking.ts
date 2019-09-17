import * as vscode from 'vscode';
import * as moment from 'moment';
import { stopTimeentry } from '../../api/actions/timeEntry';
import { StopTimeEntryRequest } from '../../api/interfaces';
import { getUser } from '../../api/actions/user';
import { getConfig } from '../../config/config';
import { selectWorkspace } from '../selectWorkspace';
import { updateStatusBarItem } from '../../statusbar/init';

export async function stopTracking(context: vscode.ExtensionContext) {
	let workspaceId = <string>getConfig('workspaceId');
	if (!workspaceId) {
		return;
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
	} catch (err) {
		//
	} finally {
		// Update status bar item
		context.globalState.update('tracking:isTracking', false);
		updateStatusBarItem(context);
	}
}
