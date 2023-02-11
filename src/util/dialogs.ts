import { window } from 'vscode';
import { Clockify } from '../sdk';
import { Workspace } from '../sdk/types/workspace';

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
		const res = await window.showQuickPick(
			workspaces.map((x) => x.name),
			{
				title: 'Select Workspace',
				placeHolder: 'Select Workspace',
			}
		);
		if (res) {
			return workspaces.find((x) => x.name === res);
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
	//#endregion

	//#region projects

	//#endregion
}
