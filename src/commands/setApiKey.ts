import * as vscode from 'vscode';

export async function setApiKey() {
	try {
		const apiKey = await vscode.window
			.showInputBox({
				ignoreFocusOut: true,
				placeHolder: 'Enter API key',
				prompt: 'Enter your API key'
			})
			.then((apiKey) => {
				if (apiKey === undefined) {
					throw new Error('No API key entered');
				}
				return apiKey;
			});

		// Write apiKey to global config
		const config = vscode.workspace.getConfiguration('clockify');
		config.update('apiKey', apiKey, true);
	} catch (err) {}
}
