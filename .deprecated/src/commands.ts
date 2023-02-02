import * as vscode from 'vscode';
import { setApiKey } from './commands/setApiKey';
import { resetConfig } from './commands/resetConfig';
import { selectWorkspace } from './commands/selectWorkspace';
import { startTracking } from './commands/tracking/startTracking';
import { stopTracking } from './commands/tracking/stopTracking';
import { toggleTracking } from './commands/tracking/toggleTracking';
import { changeTimeEntry } from './commands/timeentry/changeTimeEntry';
import { WorkspaceItem } from './treeView/workspaces/workspaces.provider';
import { ProjectItem } from './treeView/projects/projects.provider';

export function registerClockifyCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.setApiKey', setApiKey),
		vscode.commands.registerCommand('clockify.resetConfig', resetConfig),
		vscode.commands.registerCommand('clockify.selectWorkspace', () => {
			selectWorkspace(context);
		}),
		vscode.commands.registerCommand('clockify.tracking.start', () => {
			startTracking(context);
		}),
		vscode.commands.registerCommand('clockify.tracking.stop', () => {
			stopTracking(context);
		}),
		vscode.commands.registerCommand('clockify.tracking.toggle', toggleTracking),
		vscode.commands.registerCommand('clockify.timeentry.change', changeTimeEntry)
	);
}

export function registerContextMenuCommands(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('clockify');

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'clockify.config.workspace.set',
			(workspaceItem: WorkspaceItem) => {
				config.update('tracking.workspaceId', workspaceItem.workspace.id);
			}
		),
		vscode.commands.registerCommand(
			'clockify.config.project.set',
			(projectItem: ProjectItem) => {
				config.update('tracking.projectId', projectItem.project.id);
			}
		)
	);
}
