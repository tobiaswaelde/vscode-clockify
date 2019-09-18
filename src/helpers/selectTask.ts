import * as vscode from 'vscode';
import { TaskQuickPickItem } from '../interfaces/customInterfaces';
import { getTasks } from '../api/actions/task';

export async function selectTask(
	workspaceId: string,
	projectId: string,
	throwError = true
): Promise<string> {
	const tasks = await getTasks(workspaceId, projectId);

	let taskItems: TaskQuickPickItem[] = [];
	tasks.forEach((task) => {
		let item = {
			label: task.name,
			id: task.id
		};
		taskItems.push(item);
	});

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
							if (throwError) {
								throw new Error('No task selected');
							} else {
								return '';
							}
						}
						return task.id;
					})
			: '';

	return taskId;
}
