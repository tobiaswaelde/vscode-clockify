import * as vscode from 'vscode';
import { TimeEntryRequest } from '../../api/interfaces';
import { selectWorkspace } from '../../helpers/selectWorkspace';
import { selectProject } from '../../helpers/selectProject';
import { selectTask } from '../../helpers/selectTask';
import { selectTags } from '../../helpers/selectTags';
import { selectBillable } from '../../helpers/selectBillable';
import { getDescription } from '../../helpers/getDescription';
import { addTimeentry } from '../../api/actions/timeEntry';
import { providerStore } from '../../treeView/stores';
import { TimeentriesProvider } from '../../treeView/timeentries/timeentries.provider';

export async function autoStartTracking(context: vscode.ExtensionContext): Promise<void> {
	const config = vscode.workspace.getConfiguration('clockify');
	let workspaceId = config.get<string>('tracking.workspaceId')!;
	let projectId = config.get<string>('tracking.projectId')!;
	// let taskId = config.get<string>('tracking.taskId')!;
	let tagIds = config.get<string[]>('tracking.tagIds')!;
	let billable = config.get<boolean>('tracking.billable')!;

	try {
		let newTimeentry: TimeEntryRequest = {} as TimeEntryRequest;
		newTimeentry.start = new Date().toISOString();

		//#region Workspace
		if (!workspaceId) {
			workspaceId = await selectWorkspace();
			config.update('tracking.workspaceId', workspaceId);
		}
		newTimeentry.workspaceId = workspaceId;
		//#endregion
		//#region Project
		if (!projectId) {
			projectId = await selectProject(workspaceId, false);
			config.update('tracking.projectId', projectId);
		}
		newTimeentry.projectId = projectId;
		//#endregion
		//#region Task
		// if (projectId && !taskId) {
		// 	taskId = await selectTask(workspaceId, projectId, false);
		// 	config.update('tracking.taskId', taskId);
		// }
		// newTimeentry.taskId = taskId;
		if (projectId) {
			newTimeentry.taskId = await selectTask(workspaceId, projectId, false);
		}
		//#endregion
		//#region Description
		newTimeentry.description = await getDescription();
		//#endregion
		//#region Tags
		if (tagIds === []) {
			tagIds = await selectTags(workspaceId, false);
			config.update('tracking.tagIds', tagIds);
		}
		newTimeentry.tagIds = tagIds;
		//#endregion
		//#region Billable
		if (billable === undefined) {
			billable = await selectBillable(false);
			config.update('tracking.billable', billable);
		}
		newTimeentry.billable = billable;
		//#endregion

		// Add time entry
		let timeentry = await addTimeentry(workspaceId, newTimeentry);
		if (timeentry) {
			context.globalState.update('tracking:isTracking', true);
			vscode.window.showInformationMessage(`Tracking started`);

			// Refresh time entries in tree view
			const timeentriesProvider = providerStore.get<TimeentriesProvider>('timeentries');
			timeentriesProvider.refresh();
		}
	} catch (err) {
		return;
	}
}
