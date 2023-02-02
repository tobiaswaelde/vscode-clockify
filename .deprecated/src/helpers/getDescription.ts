import * as vscode from 'vscode';

export async function getDescription(throwError = true): Promise<string> {
	const description = await vscode.window
		.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'What are you working on?',
			prompt: 'Description'
		})
		.then((description) => {
			if (description === undefined) {
				if (throwError) {
					throw new Error('No description entered');
				} else {
					return '';
				}
			}
			return description;
		});

	return description;
}
