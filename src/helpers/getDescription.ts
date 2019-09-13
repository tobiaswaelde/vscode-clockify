import * as vscode from 'vscode';

export async function getDescription(): Promise<string> {
	const description = await vscode.window
		.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'What are you working on?',
			prompt: 'Description'
		})
		.then((description) => {
			if (description === undefined) {
				throw new Error('No description entered');
			}
			return description;
		});

	return description;
}
