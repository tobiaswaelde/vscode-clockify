import { window } from 'vscode';
import { Clockify } from '../../../../sdk';
import { Project } from '../../../../sdk/types/project';
import { Workspace } from '../../../../sdk/types/workspace';
import { requiresProject } from '../../../../helpers/tracking-requirements';
import { Config } from '../../../../util/config';
import { formatLocalDateTime, parseLocalDateTime } from '../../../../util/date-time';
import { Dialogs } from '../../../../util/dialogs';
import { GlobalState } from '../../../../util/global-state';
import { TreeView } from '../..';

export async function addTimeEntry(): Promise<void> {
	const workspace =
		GlobalState.get<Workspace>('selectedWorkspace') || (await Dialogs.selectWorkspace());
	if (!workspace) {
		return;
	}

	const projectRequired = requiresProject(workspace.workspaceSettings);
	const project =
		GlobalState.get<Project>('selectedProject') ||
		(await Dialogs.selectProject(workspace.id, !projectRequired));
	if (project === undefined || (projectRequired && project === null)) {
		return;
	}

	const task = project
		? await Dialogs.selectTask(
				workspace.id,
				project.id,
				!workspace.workspaceSettings.forceTasks
			  )
		: null;
	if (task === undefined || (workspace.workspaceSettings.forceTasks && task === null)) {
		if (task === null) {
			window.showErrorMessage('A task is required in this workspace.');
		}
		return;
	}

	const tags = await Dialogs.selectTags(workspace.id);
	if (tags === undefined || (workspace.workspaceSettings.forceTags && tags.length === 0)) {
		if (tags?.length === 0) {
			window.showErrorMessage('At least one tag is required in this workspace.');
		}
		return;
	}

	const description = await Dialogs.getDescription('Manual Time Entry');
	if (description === undefined) {
		return;
	}
	const normalizedDescription = description.trim();
	if (workspace.workspaceSettings.forceDescription && !normalizedDescription) {
		window.showErrorMessage('A description is required in this workspace.');
		return;
	}

	const now = new Date();
	const defaultStart = new Date(now.getTime() - 60 * 60 * 1000);
	const startValue = await Dialogs.getDateTime('Manual Time Entry: Start', formatLocalDateTime(defaultStart));
	if (!startValue) {
		return;
	}
	const endValue = await Dialogs.getDateTime('Manual Time Entry: End', formatLocalDateTime(now));
	if (!endValue) {
		return;
	}

	const start = parseLocalDateTime(startValue);
	const end = parseLocalDateTime(endValue);
	if (!start || !end || end <= start) {
		window.showErrorMessage('End time must be after start time.');
		return;
	}

	const billable = await Dialogs.getBillable(Config.get<boolean>('tracking.billable') ?? false);
	if (billable === undefined) {
		return;
	}

	const created = await Clockify.addTimeEntry(workspace.id, {
		start: start.toISOString(),
		end: end.toISOString(),
		description: normalizedDescription,
		projectId: project?.id,
		taskId: task?.id,
		tagIds: tags.map(({ id }) => id),
		billable,
	});
	if (!created) {
		return;
	}

	TreeView.refreshTimeentries();
	window.showInformationMessage('Manual time entry added.');
}
