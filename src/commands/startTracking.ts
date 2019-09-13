import * as vscode from 'vscode';
import { getTags } from '../actions/tag';
import { getProjects } from '../actions/project';
import {
	ProjectQuickPickItem,
	TaskQuickPickItem,
	TagQuickPickItem
} from '../interfaces/customInterfaces';
import { getClients } from '../actions/client';
import { ClientDto, ProjectDtoImpl, TimeEntryRequest } from '../interfaces/interfaces';
import { getTasks } from '../actions/task';
import * as _ from 'lodash';
import { addTimeentry } from '../actions/timeEntry';

export async function startTracking(workspaceId: string) {
	// 1. Select Project
	// 2. Select Task
	// 3. Description
	// 4. Billable
	// 5. Select Tags
	try {
		let newTimeentry: TimeEntryRequest = {} as TimeEntryRequest;
		newTimeentry.start = new Date().toISOString();

		//#region GET PROJECT ITEMS
		const projects = await getProjects(workspaceId);
		const clients = await getClients(workspaceId);

		let projectItems: ProjectQuickPickItem[] = [];
		projects.forEach((project) => {
			let client = getClient(clients, project);
			let clientName = client ? client.name : 'none';

			let item = {
				label: project.name,
				detail: `Client ${clientName}`,
				id: project.id
			};
			projectItems.push(item);
		});
		//#endregion

		// Select Project
		const projectId = await vscode.window
			.showQuickPick(projectItems, { ignoreFocusOut: true, placeHolder: 'Select project' })
			.then((project) => {
				if (project === undefined) {
					throw new Error('No project selected');
				}
				return project.id;
			});
		newTimeentry.projectId = projectId;

		//#region GET TASK ITEMS
		const tasks = await getTasks(workspaceId, projectId);

		let taskItems: TaskQuickPickItem[] = [];
		tasks.forEach((task) => {
			let item = {
				label: task.name,
				id: task.id
			};
			taskItems.push(item);
		});
		//#endregion

		// Select Task
		const taskId =
			tasks.length > 0
				? await vscode.window
						.showQuickPick(taskItems, {
							ignoreFocusOut: true,
							placeHolder: 'Select Task'
						})
						.then((task) => {
							if (task === undefined) {
								throw new Error('No task selected');
							}
							return task.id;
						})
				: 'null';
		newTimeentry.taskId = taskId;

		// Description
		const description = await vscode.window
			.showInputBox({
				ignoreFocusOut: true,
				placeHolder: 'What are you working on?',
				prompt: 'Description'
			})
			.then((description) => {
				if (description === undefined) {
					throw new Error('No description entered');
				}
				return description;
			});
		newTimeentry.description = description;

		// Billable
		const billable = await vscode.window
			.showQuickPick(['Billable', 'Non-billable'], {
				ignoreFocusOut: true,
				placeHolder: 'Billable?'
			})
			.then((billable) => {
				if (billable === undefined) {
					throw new Error('No billable type selected');
				}
				return billable === 'billable';
			});
		newTimeentry.billable = billable;

		//#region GET TAGS ITEMS
		const tags = await getTags(workspaceId);

		let tagItems: TagQuickPickItem[] = [];
		tags.forEach((tag) => {
			let item = {
				label: tag.name,
				id: tag.id
			};
			tagItems.push(item);
		});
		//#endregion

		// Select Tags
		const tagIds = await vscode.window
			.showQuickPick(tagItems, {
				ignoreFocusOut: true,
				placeHolder: 'Select Tags',
				canPickMany: true
			})
			.then((tags) => {
				if (tags === undefined) {
					throw new Error('No tags selected');
				}
				let result: string[] = [];
				tags.forEach((tag) => {
					result.push(tag.id);
				});
				return result;
			});
		newTimeentry.tagIds = tagIds;

		// Add Time Entry
		const timeEntry = await addTimeentry(workspaceId, newTimeentry);
		if (timeEntry) {
			vscode.window.showInformationMessage('Tracking started');
		}
	} catch (err) {}
}

function getClient(clients: ClientDto[], project: ProjectDtoImpl) {
	return clients.find((client) => client.id === project.clientId);
}
