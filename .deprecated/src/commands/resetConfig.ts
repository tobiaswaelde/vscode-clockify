import * as vscode from 'vscode';

export async function resetConfig() {
	await vscode.window
		.showErrorMessage(
			"Are you sure that you want to reset the extension's configuration?",
			'Yes',
			'No'
		)
		.then((selectedItem) => {
			switch (selectedItem) {
				case 'Yes':
					//> Reset config
					const config = vscode.workspace.getConfiguration('clockify');
					config.update('apiKey', null, true);
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
