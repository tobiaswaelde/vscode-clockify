import * as vscode from 'vscode';

// Workspace Settings
// trackingAutoStart
// trackingAutoStop
// workspaceId
// projectId
// taskId
// tagIds
// billable

export async function changeTimeEntry(): Promise<void> {
	const config = vscode.workspace.getConfiguration('clockify');
	const workspaceId = config.get<string>('tracking.workspaceId')!;
	const projectId = config.get<string>('tracking.projectId')!;
	const taskId = config.get<string>('tracking.taskId')!;
	const tagIds = config.get<string[]>('tracking.tagIds')!;
	const billable = config.get<boolean>('tracking.billable')!;

	return;
}
