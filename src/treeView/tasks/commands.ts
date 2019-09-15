import * as vscode from 'vscode';
import { TaskItem, TasksProvider } from './tasks.provider';
import { providerStore } from '../stores';

export function registerTasksCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.tasks.add', addTask),
		vscode.commands.registerCommand('clockify.tasks.refresh', refreshTasks)
	);
}

async function addTask(): Promise<void> {
	//
}

function refreshTasks(element?: TaskItem): void {
	const tasksProvider = providerStore.get<TasksProvider>('tasks');
	tasksProvider.refresh(element);
}
