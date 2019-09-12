import * as vscode from 'vscode';
import { getProjects, getTags, getTasks, addTimeEntry } from '../actions/workspace';

export async function startTracking(workspaceId: string) {
	const projectId = await selectProject(workspaceId);
	const start = new Date();
	const description = await vscode.window
		.showInputBox({ placeHolder: 'Description', prompt: 'What are you working on?' })
		.then((value) => {
			return value;
		});
	const billable = await vscode.window
		.showQuickPick(['true', 'false'], { ignoreFocusOut: true, placeHolder: 'Billable?' })
		.then((selected) => {
			if (selected === 'true') {
				return true;
			}
			if (selected === 'false') {
				return false;
			}
			return false;
		});

	const _tagsRaw = await getTags(workspaceId);
	let _tags = [];
	_tagsRaw.forEach(({ name, id }) => {
		_tags.push({
			label: name,
			id
		});
	});
	const tagIds = await vscode.window
		.showQuickPick(_tags, {
			canPickMany: true,
			placeHolder: 'Select tags',
			ignoreFocusOut: true
		})
		.then((data) => {
			return data.map((v) => v.id);
		});

	const _tasksRaw = await getTasks(workspaceId, projectId);
	let taskId = null;
	console.log(_tasksRaw.length);
	if (_tasksRaw.length > 0) {
		let _tasks: object[] = [];
		_tasksRaw.forEach(({ name, id }) => {
			_tasks.push({
				label: name,
				id
			});
		});
		if (_tasks.length > 0) {
			taskId = await vscode.window
				.showQuickPick(_tasks, { placeHolder: 'Select Task', ignoreFocusOut: true })
				.then((data) => {
					return data.id;
				});
		}
	}

	const timeEntry = {
		start,
		billable,
		description,
		projectId,
		taskId,
		tagIds
	};
	const t = await addTimeEntry(workspaceId, timeEntry);
	console.log(t);
}

async function selectProject(workspaceId: string) {
	const projectsRaw = await getProjects(workspaceId);
	let items: object[] = [];
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
