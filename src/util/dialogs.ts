import { QuickPickItem, window } from 'vscode';
import { PROJECT_COLORS } from '../config/colors';
import { Clockify } from '../sdk';
import { GetClientsFilter, GetProjectsFilter, GetTasksFilter } from '../sdk/filters';
import { Client } from '../sdk/types/client';
import { Project } from '../sdk/types/project';
import { Task } from '../sdk/types/task';
import { Workspace } from '../sdk/types/workspace';

interface IdQuickPickItem extends QuickPickItem {
	id: string;
}
interface ValueQuickPickItem extends QuickPickItem {
	value: string;
}

export class Dialogs {
	//#region General
	public static async askForConfirmation(text: string): Promise<'Yes' | 'No' | undefined> {
		return await window.showErrorMessage(
			'Do you really want to delete the selected client?',
			'Yes',
			'No'
		);
	}

	public static async askForApiKey(apiKey?: string): Promise<string | undefined> {
		return window.showInputBox({
			prompt: 'Enter your API key.',
			placeHolder: 'Enter your API key',
			ignoreFocusOut: true,
			value: apiKey,
		});
	}

	public static async selectColor(color?: string): Promise<string | undefined> {
		const colorItems: ValueQuickPickItem[] = PROJECT_COLORS.map((x) => ({
			label: x.name,
			value: x.value,
			picked: x.value === color,
		}));

		const res = await window.showQuickPick(colorItems, {
			title: 'Select Color',
			placeHolder: 'Select Color',
			ignoreFocusOut: true,
		});
		return res?.value;
	}

	public static async getDescription(title: string, value?: string): Promise<string | undefined> {
		return window.showInputBox({
			title: title,
			placeHolder: 'Enter a description',
			ignoreFocusOut: true,
			value: value,
		});
	}
	//#endregion

	//#region workspaces
	public static async getWorkspaceName(name?: string): Promise<string | undefined> {
		return window.showInputBox({
			title: 'Enter a name for your workspace',
			placeHolder: 'Name of the workspace',
			ignoreFocusOut: true,
			value: name,
		});
	}

	public static async selectWorkspace(title?: string): Promise<Workspace | undefined> {
		const workspaces = await Clockify.getWorkspaces();
		const workspacesItems: IdQuickPickItem[] = workspaces.map((x) => ({
			id: x.id,
			label: x.name,
		}));

		const res = await window.showQuickPick(workspacesItems, {
			title: title || 'Select Workspace',
			placeHolder: 'Select Workspace',
			ignoreFocusOut: true,
		});

		if (res) {
			return workspaces.find((x) => x.id === res.id);
		}
	}
	//#endregion

	//#region clients
	public static async getClientName(name?: string): Promise<string | undefined> {
		return window.showInputBox({
			title: "Enter the client's name",
			placeHolder: "The client's name",
			ignoreFocusOut: true,
			value: name,
		});
	}

	public static async selectClient(
		workspaceId: string,
		allowNone: boolean = false,
		filter?: GetClientsFilter
	): Promise<Client | null | undefined> {
		const clients = await Clockify.getClients(workspaceId, filter);
		const clientItems: IdQuickPickItem[] = clients.map((x) => ({
			id: x.id,
			label: x.name,
			description: x.email,
			detail: x.note,
		}));
		if (allowNone) {
			clientItems.unshift({ id: 'none', label: 'No Client' });
		}

		const res = await window.showQuickPick(clientItems, {
			title: 'Select Client',
			placeHolder: 'Select Client',
			ignoreFocusOut: true,
		});

		if (res) {
			if (res.id === 'none') {
				return null;
			}
			return clients.find((x) => x.id === res.id);
		}
	}
	//#endregion

	//#region projects
	public static async getProjectName(name?: string): Promise<string | undefined> {
		return window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Enter a name for your project',
			prompt: 'Project Name',
		});
	}
	public static async getProjectVisibility(): Promise<boolean> {
		const res = await window.showQuickPick(['Public', 'Private'], {
			title: 'Select Visibility',
			placeHolder: 'Select Visibility',
			ignoreFocusOut: true,
		});

		return res === 'Public';
	}
	public static async getProjectBillable(): Promise<boolean> {
		const res = await window.showQuickPick(['Billable', 'Non-billable'], {
			title: 'Billable?',
			placeHolder: 'Billable?',
			ignoreFocusOut: true,
		});

		return res === 'Billable';
	}
	public static async selectProject(
		workspaceId: string,
		allowNone: boolean = false,
		filter?: GetProjectsFilter
	): Promise<Project | null | undefined> {
		const projects = await Clockify.getProjects(workspaceId, filter);
		const projectItems: IdQuickPickItem[] = projects.map((x) => ({
			id: x.id,
			label: x.name,
			// description:x.clientName,
			detail: x.clientName,
		}));
		if (allowNone) {
			projectItems.unshift({ id: 'none', label: 'No Project' });
		}

		const res = await window.showQuickPick(projectItems, {
			title: 'Select Project',
			placeHolder: 'Select Project',
			ignoreFocusOut: true,
		});

		if (res) {
			if (res.id === 'none') {
				return null;
			}
			return projects.find((x) => x.id === res.id);
		}
	}
	//#endregion

	//#region Tasks
	public static async getTaskName(name?: string): Promise<string | undefined> {
		return window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Enter a name for the task',
			prompt: 'Task name',
			value: name,
		});
	}
	public static async selectTask(
		workspaceId: string,
		projectId: string,
		allowNone: boolean = false,
		filter?: GetTasksFilter
	): Promise<Task | null | undefined> {
		const tasks = await Clockify.getTasks(workspaceId, projectId, filter);
		const taskItems: IdQuickPickItem[] = tasks.map((x) => ({
			id: x.id,
			label: x.name,
		}));
		if (allowNone) {
			taskItems.unshift({ id: 'none', label: 'No Task' });
		}

		const res = await window.showQuickPick(taskItems, {
			title: 'Select Task',
			placeHolder: 'Select Task',
			ignoreFocusOut: true,
		});
		if (res) {
			if (res.id === 'none') {
				return null;
			}
			return tasks.find((x) => x.id === res.id);
		}
	}
	//#endregion

	//#region Tags
	public static async getTagName(name?: string): Promise<string | undefined> {
		return window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Enter a name for the tag',
			prompt: 'Tag name',
			value: name,
		});
	}
	//#endregion
}
