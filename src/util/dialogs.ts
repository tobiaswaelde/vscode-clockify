import { QuickPickItem, window } from 'vscode';
import { PROJECT_COLORS } from '../config/colors';
import { Clockify } from '../sdk';
import { GetClientsFilter } from '../sdk/filters';
import { Client } from '../sdk/types/client';
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

	public static async selectWorkspace(): Promise<Workspace | undefined> {
		const workspaces = await Clockify.getWorkspaces();
		const workspacesItems: IdQuickPickItem[] = workspaces.map((x) => ({
			id: x.id,
			label: x.name,
		}));

		const res = await window.showQuickPick(workspacesItems, {
			title: 'Select Workspace',
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
		clientItems.unshift({ id: 'none', label: 'No Client' });

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
	//#endregion
}
