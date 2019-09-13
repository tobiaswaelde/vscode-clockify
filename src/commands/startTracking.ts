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
	//#region OLD
	// const projectId = await selectProject(workspaceId);
	// const start = new Date();
	// const description = await vscode.window
	// 	.showInputBox({ placeHolder: 'Description', prompt: 'What are you working on?' })
	// 	.then((value) => {
	// 		return value;
	// 	});
	// const billable = await vscode.window
	// 	.showQuickPick(['true', 'false'], { ignoreFocusOut: true, placeHolder: 'Billable?' })
	// 	.then((selected) => {
	// 		if (selected === 'true') {
	// 			return true;
	// 		}
	// 		if (selected === 'false') {
	// 			return false;
	// 		}
	// 		return false;
	// 	});
	// const _tagsRaw = getTags(workspaceId);
	// let _tags = [];
	// _tagsRaw.forEach(({ name, id }) => {
	// 	_tags.push({
	// 		label: name,
	// 		id
	// 	});
	// });
	// const tagIds = await vscode.window
	// 	.showQuickPick(_tags, {
	// 		canPickMany: true,
	// 		placeHolder: 'Select tags',
	// 		ignoreFocusOut: true
	// 	})
	// 	.then((data) => {
	// 		return data.map((v) => v.id);
	// 	});
	// const _tasksRaw = await getTasks(workspaceId, projectId);
	// let taskId = null;
	// console.log(_tasksRaw.length);
	// if (_tasksRaw.length > 0) {
	// 	let _tasks: object[] = [];
	// 	_tasksRaw.forEach(({ name, id }) => {
	// 		_tasks.push({
	// 			label: name,
	// 			id
	// 		});
	// 	});
	// 	if (_tasks.length > 0) {
	// 		taskId = await vscode.window
	// 			.showQuickPick(_tasks, { placeHolder: 'Select Task', ignoreFocusOut: true })
	// 			.then((data) => {
	// 				return data.id;
	// 			});
	// 	}
	// }
	// const timeEntry = {
	// 	start,
	// 	billable,
	// 	description,
	// 	projectId,
	// 	taskId,
	// 	tagIds
	// };
	// const t = await addTimeEntry(workspaceId, timeEntry);
	// console.log(t);
	//#endregion

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

async function selectProject(workspaceId: string) {
	const projectsRaw = await getProjects(workspaceId);
	let items: ProjectQuickPickItem[] = [];
	projectsRaw.forEach(({ name, id }) => {
		let item = {
			label: name,
			detail: id,
			id: id
		};
		items.push(item);
	});
	return vscode.window
		.showQuickPick(items, { ignoreFocusOut: true, placeHolder: 'Select project' })
		.then((item) => {
			if (item) {
				return item.id;
			} else {
				return '';
			}
		});
}
