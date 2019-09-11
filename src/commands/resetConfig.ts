import * as vscode from 'vscode';

export function resetConfig(context: vscode.ExtensionContext) {
	vscode.window
		.showErrorMessage(
			"Are you sure that you want to reset the extension's configuration?",
			'Yes',
			'No'
		)
		.then((selectedItem) => {
			switch (selectedItem) {
				case 'Yes':
					context.globalState.update('apiKey', null);
					context.globalState.update('workspaceId', null);
					return true;

				default:
					return false;
			}
		})
		.then((resetted) => {
			if (resetted) {
				vscode.window.showInformationMessage('Configuration resetted successfully.');
			}
		});
}
