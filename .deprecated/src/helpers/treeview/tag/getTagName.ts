import * as vscode from 'vscode';

export async function getTagName(): Promise<string> {
	const tagName = await vscode.window
		.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Enter a name for your tag',
			prompt: 'Tag name'
		})
		.then((tagName) => {
			if (tagName === undefined) {
				throw new Error();
			}
			return tagName;
		});

	return tagName;
}
