import * as vscode from 'vscode';
import { getConfig } from '../../config/config';
import { getUser } from '../../api/actions/user';
import { StopTimeEntryRequest } from '../../api/interfaces';
import { stopTimeentry } from '../../api/actions/timeEntry';

export async function autoStopTracking(context: vscode.ExtensionContext) {
	console.log('clockify.autoStopTracking');
	let workspaceId = <string>getConfig('tracking.workspaceId');
	if (!workspaceId) {
		return;
	}

	try {
		let user = await getUser();

		let newTimeentry: StopTimeEntryRequest = {
			end: new Date().toISOString()
		};
		let timeentry = await stopTimeentry(workspaceId, user.id, newTimeentry);

		context.globalState.update('tracking:isTracking', false);
		// return;
	} catch (err) {
		// return;
	} finally {
		context.globalState.update('tracking:isTracking', false);
	}
}
