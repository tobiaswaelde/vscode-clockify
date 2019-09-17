import * as vscode from 'vscode';
import { TaskItem, TasksProvider } from './tasks.provider';
import { providerStore } from '../stores';
import { getContext } from '../utils';
import { WorkspaceDto, ProjectDtoImpl, TaskRequest } from '../../api/interfaces';
import { getTaskName } from '../../helpers/treeview/task/getTaskName';
import { getEstimatedDuration } from '../../helpers/treeview/task/getEstimatedDuration';
import { getUser } from '../../api/actions/user';
import { addTask as apiAddTask } from '../../api/actions/task';
import { ProjectsProvider } from '../projects/projects.provider';

export function registerTasksCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.tasks.add', addTask),
		vscode.commands.registerCommand('clockify.tasks.refresh', refreshTasks)
	);
}

async function addTask(): Promise<void> {
	const context = getContext();
	const workspace = context.globalState.get<WorkspaceDto>('selectedWorkspace')!;
	const project = context.globalState.get<ProjectDtoImpl>('selectedProject')!;
	if (!workspace) {
		await vscode.window.showErrorMessage('No workspace selected');
		return;
	}
	if (!project) {
		await vscode.window.showErrorMessage('No project selected');
		return;
	}

	try {
		let newTask: TaskRequest = {} as TaskRequest;

		const taskName = await getTaskName();
		newTask.name = taskName;

		const estimatedDuration = await getEstimatedDuration();
		if (estimatedDuration > 0) {
			newTask.estimate = `PT${estimatedDuration}H`;
		}

		newTask.assigneeId = (await getUser()!).id;

		// Add Task
		const task = await apiAddTask(workspace.id, project.id, newTask);
		if (task) {
			const tasksProvider = providerStore.get<TasksProvider>('tasks');
			const projectsProvider = providerStore.get<ProjectsProvider>('projects');
			tasksProvider.refresh();
			projectsProvider.refresh();

			await vscode.window.showInformationMessage(`Task '${task.name}' added`);
		}
	} catch (err) {
		console.error(err);
	}
}

function refreshTasks(element?: TaskItem): void {
	const tasksProvider = providerStore.get<TasksProvider>('tasks');
	tasksProvider.refresh(element);
}
