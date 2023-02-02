import * as vscode from 'vscode';

export async function getWorkspaceName(): Promise<string> {
	const workspaceName = await vscode.window
		.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Name of the workspace',
			prompt: 'Enter a name for your workspace'
		})
		.then((workspaceName) => {
			if (workspaceName === undefined) {
				throw new Error();
			}
			return workspaceName;
		});

	return workspaceName;
}
