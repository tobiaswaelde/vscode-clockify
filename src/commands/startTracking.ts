import * as vscode from 'vscode';
import * as _ from 'lodash';
import { TimeEntryRequest } from '../api/interfaces';
import { addTimeentry } from '../api/actions/timeEntry';
import { selectWorkspace } from '../helpers/selectWorkspace';
import { selectProject } from '../helpers/selectProject';
import { selectTask } from '../helpers/selectTask';
import { getDescription } from '../helpers/getDescription';
import { selectBillable } from '../helpers/selectBillable';
import { selectTags } from '../helpers/selectTags';

export async function startTracking() {
	// 1. Select Workspace
	// 2. Select Project
	// 3. Select Task
	// 4. Description
	// 5. Billable
	// 6. Select Tags
	try {
		let newTimeentry: TimeEntryRequest = {} as TimeEntryRequest;
		newTimeentry.start = new Date().toISOString();

		const workspaceId = await selectWorkspace();

		const projectId = await selectProject(workspaceId);
		newTimeentry.projectId = projectId;

		const taskId = await selectTask(workspaceId, projectId);
		newTimeentry.taskId = taskId;

		const description = await getDescription();
		newTimeentry.description = description;

		const billable = await selectBillable();
		newTimeentry.billable = billable;

		//#region GET TAGS ITEMS
		const tagIds = await selectTags(workspaceId);
		newTimeentry.tagIds = tagIds;

		// Add Time Entry
		const timeEntry = await addTimeentry(workspaceId, newTimeentry);
		if (timeEntry) {
			vscode.window.showInformationMessage('Tracking started');
		}
	} catch (err) {
		console.log(err);
	}
}
