import * as vscode from 'vscode';
import * as _ from 'lodash';
import { TimeEntryRequest } from '../../api/interfaces';
import { addTimeentry } from '../../api/actions/timeEntry';
import { selectWorkspace } from '../../helpers/selectWorkspace';
import { selectProject } from '../../helpers/selectProject';
import { selectTask } from '../../helpers/selectTask';
import { getDescription } from '../../helpers/getDescription';
import { selectBillable } from '../../helpers/selectBillable';
import { selectTags } from '../../helpers/selectTags';
import { updateStatusBarItem } from '../../statusbar/init';
import { providerStore } from '../../treeView/stores';
import { TimeentriesProvider } from '../../treeView/timeentries/timeentries.provider';

export async function startTracking(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('clockify');
	let workspaceId = config.get<string>('tracking.workspaceId')!;
	let projectId = config.get<string>('tracking.projectId')!;
	// let taskId = config.get<string>('tracking.taskId')!;
	let tagIds = config.get<string[]>('tracking.tagIds')!;
	let billable = config.get<boolean>('tracking.billable')!;

	try {
		let newTimeentry: TimeEntryRequest = {} as TimeEntryRequest;
		newTimeentry.start = new Date().toISOString();

		// 1. Select Workspace
		if (!workspaceId) {
			workspaceId = await selectWorkspace();
		}
		newTimeentry.workspaceId = workspaceId;

	  // 2. Select Project
		if (!projectId) {
			projectId = await selectProject(workspaceId, false);
		}
		newTimeentry.projectId = projectId;

		// 3. Select Task
		if(projectId) {
			newTimeentry.taskId = await selectTask(workspaceId, projectId, false);
		}

		// 4. Description
		newTimeentry.description = await getDescription(false);

		// 5. Billable
		if (billable === undefined) {
			billable = await selectBillable(false);
		}
		newTimeentry.billable = billable;

		// 6. Select Tags
		if (tagIds === []) {
			tagIds = await selectTags(workspaceId, false);
		}
		newTimeentry.tagIds = tagIds;

		// Add Time Entry
		const timeEntry = await addTimeentry(workspaceId, newTimeentry);
		if (timeEntry) {
			context.globalState.update('workspaceId', workspaceId);
			vscode.window.showInformationMessage('Tracking started');

			// Update status bar item
			context.globalState.update('tracking:isTracking', true);
			updateStatusBarItem(context, true);

			// Update tree view
			const timentriesProvider = providerStore.get<TimeentriesProvider>('timeentries');
			timentriesProvider.refresh();
		}
	} catch (err) {
		console.log(err);
	}
}
