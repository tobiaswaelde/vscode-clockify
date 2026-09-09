import { commands, QuickPickItem, window } from 'vscode';
import { PROJECT_COLORS } from '../config/colors';
import { Commands } from '../config/commands';
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

const ADD_ITEM_ID = '__clockify_add__';

export class Dialogs {
	//#region General
	public static async askForConfirmation(text: string): Promise<'Yes' | 'No' | undefined> {
		return await window.showErrorMessage(
			text,
			'Yes',
			'No'
		);
	}

	public static async askForApiKey(apiKey?: string): Promise<string | undefined> {
		return window.showInputBox({
			prompt: 'Enter your API key.',
			placeHolder: 'Enter your API key',
			password: true,
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
		workspacesItems.push({ id: ADD_ITEM_ID, label: '$(add) Add Workspace', alwaysShow: true });

		const res = await window.showQuickPick(workspacesItems, {
			title: title || 'Select Workspace',
			placeHolder: 'Select Workspace',
			ignoreFocusOut: true,
		});

		if (res?.id === ADD_ITEM_ID) {
			const name = (await this.getWorkspaceName())?.trim();
			if (!name) {
				return undefined;
			}

			const workspace = await Clockify.addWorkspace({ name });
			if (workspace) {
				await commands.executeCommand(Commands.workspacesRefresh);
				window.showInformationMessage(`Workspace '${workspace.name}' added successfully.`);
			}
			return workspace;
		}

		return workspaces.find((x) => x.id === res?.id);
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
		clientItems.push({ id: ADD_ITEM_ID, label: '$(add) Add Client', alwaysShow: true });

		const res = await window.showQuickPick(clientItems, {
			title: 'Select Client',
			placeHolder: 'Select Client',
			ignoreFocusOut: true,
		});

		if (res?.id === 'none') {
			return null;
		}
		if (res?.id === ADD_ITEM_ID) {
			const name = (await this.getClientName())?.trim();
			if (!name) {
				return undefined;
			}

			const client = await Clockify.addClient(workspaceId, { name });
			if (client) {
				await commands.executeCommand(Commands.clientsRefresh);
				window.showInformationMessage(`Client '${client.name}' added successfully.`);
			}
			return client;
		}

		return clients.find((x) => x.id === res?.id);
	}
	//#endregion

	//#region projects
	public static async getProjectName(name?: string): Promise<string | undefined> {
		return window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Enter a name for your project',
			prompt: 'Project Name',
			value: name,
		});
	}
	public static async getProjectVisibility(): Promise<boolean | undefined> {
		const res = await window.showQuickPick(['Public', 'Private'], {
			title: 'Select Visibility',
			placeHolder: 'Select Visibility',
			ignoreFocusOut: true,
		});

		return res === undefined ? undefined : res === 'Public';
	}
	public static async getProjectBillable(): Promise<boolean | undefined> {
		const res = await window.showQuickPick(['Billable', 'Non-billable'], {
			title: 'Billable?',
			placeHolder: 'Billable?',
			ignoreFocusOut: true,
		});

		return res === undefined ? undefined : res === 'Billable';
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
		projectItems.push({ id: ADD_ITEM_ID, label: '$(add) Add Project', alwaysShow: true });

		const res = await window.showQuickPick(projectItems, {
			title: 'Select Project',
			placeHolder: 'Select Project',
			ignoreFocusOut: true,
		});

		if (res?.id === 'none') {
			return null;
		}
		if (res?.id === ADD_ITEM_ID) {
			const client = await this.selectClient(workspaceId, true);
			if (client === undefined) {
				return undefined;
			}

			const name = (await this.getProjectName())?.trim();
			if (!name) {
				return undefined;
			}
			const color = await this.selectColor();
			if (!color) {
				return undefined;
			}
			const isPublic = await this.getProjectVisibility();
			if (isPublic === undefined) {
				return undefined;
			}
			const billable = await this.getProjectBillable();
			if (billable === undefined) {
				return undefined;
			}

			const project = await Clockify.addProject(workspaceId, {
				clientId: client?.id,
				name,
				color,
				isPublic,
				billable,
			});
			if (project) {
				await commands.executeCommand(Commands.projectsRefresh);
				window.showInformationMessage(`Project '${project.name}' added.`);
			}
			return project;
		}

		return projects.find((x) => x.id === res?.id);
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
		taskItems.push({ id: ADD_ITEM_ID, label: '$(add) Add Task', alwaysShow: true });

		const res = await window.showQuickPick(taskItems, {
			title: 'Select Task',
			placeHolder: 'Select Task',
			ignoreFocusOut: true,
		});
		if (res?.id === 'none') {
			return null;
		}
		if (res?.id === ADD_ITEM_ID) {
			const name = (await this.getTaskName())?.trim();
			if (!name) {
				return undefined;
			}

			const task = await Clockify.addTask(workspaceId, projectId, { name });
			if (task) {
				await commands.executeCommand(Commands.tasksRefresh);
				window.showInformationMessage(`Task '${task.name}' added.`);
			}
			return task;
		}

		return tasks.find((x) => x.id === res?.id);
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
