import * as vscode from 'vscode';

export async function getClientName(): Promise<string> {
	const clientName = await vscode.window
		.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Name of the client',
			prompt: 'Enter a name for your client'
		})
		.then((clientName) => {
			if (clientName === undefined) {
				throw new Error();
			}
			return clientName;
		});

	return clientName;
}
