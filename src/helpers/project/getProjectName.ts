import * as vscode from 'vscode';

export async function getProjectName(): Promise<string> {
	const projectName = await vscode.window
		.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Enter a name for your project',
			prompt: 'Project Name'
		})
		.then((projectName) => {
			if (projectName === undefined) {
				throw new Error();
			}
			return projectName;
		});

	return projectName;
}
