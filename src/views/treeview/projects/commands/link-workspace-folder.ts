import { ConfigurationTarget, window, workspace, WorkspaceFolder } from 'vscode';
import { Config } from '../../../../util/config';
import { ProjectItem } from '../items/item';

interface WorkspaceFolderItem {
	label: string;
	description: string;
	folder: WorkspaceFolder;
}

async function selectWorkspaceFolder(): Promise<WorkspaceFolder | undefined> {
	const folders = workspace.workspaceFolders ?? [];
	if (folders.length === 0) {
		window.showErrorMessage('Open a workspace folder before linking a Clockify project.');
		return undefined;
	}
	if (folders.length === 1) {
		return folders[0];
	}

	const items: WorkspaceFolderItem[] = folders.map((folder) => ({
		label: folder.name,
		description: folder.uri.fsPath,
		folder,
	}));
	return (
		await window.showQuickPick(items, {
			title: 'Link Clockify Project to Workspace Folder',
			placeHolder: 'Select a workspace folder',
			ignoreFocusOut: true,
		})
	)?.folder;
}

export async function linkWorkspaceFolder(item?: ProjectItem): Promise<void> {
	const project = item?.project;
	if (!project) {
		window.showErrorMessage('No project selected.');
		return;
	}

	const folder = await selectWorkspaceFolder();
	if (!folder) {
		return;
	}

	await Promise.all([
		Config.set(
			'tracking.workspaceId',
			project.workspaceId,
			ConfigurationTarget.WorkspaceFolder,
			folder.uri
		),
		Config.set(
			'tracking.projectId',
			project.id,
			ConfigurationTarget.WorkspaceFolder,
			folder.uri
		),
		Config.set(
			'tracking.taskId',
			undefined,
			ConfigurationTarget.WorkspaceFolder,
			folder.uri
		),
		Config.set(
			'tracking.autostart',
			true,
			ConfigurationTarget.WorkspaceFolder,
			folder.uri
		),
	]);

	window.showInformationMessage(
		`Project '${project.name}' linked to workspace folder '${folder.name}'. Automatic tracking will use this project when the folder is opened.`
	);
}
