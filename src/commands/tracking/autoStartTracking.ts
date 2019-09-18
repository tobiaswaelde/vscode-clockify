import * as vscode from 'vscode';
import { TimeEntryRequest } from '../../api/interfaces';
import { selectWorkspace } from '../../helpers/selectWorkspace';
import { selectProject } from '../../helpers/selectProject';
import { selectTask } from '../../helpers/selectTask';
import { selectTags } from '../../helpers/selectTags';
import { selectBillable } from '../../helpers/selectBillable';
import { getDescription } from '../../helpers/getDescription';
import { addTimeentry } from '../../api/actions/timeEntry';

export async function autoStartTracking(context: vscode.ExtensionContext): Promise<void> {
	console.log('clockify.autoStartTracking');
	const config = vscode.workspace.getConfiguration('clockify');
	let workspaceId = config.get<string>('tracking.workspaceId')!;
	let projectId = config.get<string>('tracking.projectId')!;
	let taskId = config.get<string>('tracking.taskId')!;
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
		if (projectId && !taskId) {
			taskId = await selectTask(workspaceId, projectId, false);
			config.update('tracking.taskId', taskId);
		}
		newTimeentry.taskId = taskId;
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
		if (!billable) {
			billable = await selectBillable(false);
			config.update('tracking.billable', billable);
		}
		newTimeentry.billable = billable;
		//#endregion

		console.log(newTimeentry);
		let timeentry = await addTimeentry(workspaceId, newTimeentry);
		vscode.window.showInformationMessage(`Tracking started: ${timeentry.id}`);
		context.globalState.update('tracking:isTracking', true);
	} catch (err) {
		return;
	}
}
