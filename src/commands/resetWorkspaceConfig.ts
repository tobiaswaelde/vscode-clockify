import * as vscode from 'vscode';

export async function resetWorkspaceConfig(context: vscode.ExtensionContext) {
	await vscode.window
		.showErrorMessage(
			"Are you sure that you want to reset the extension's workspace configuration?",
			'Yes',
			'No'
		)
		.then((selectedItem) => {
			switch (selectedItem) {
				case 'Yes':
					//> Reset config
					const config = vscode.workspace.getConfiguration('clockify');
					config.update('tracking.workspaceId', '');
					config.update('tracking.projectId', '');
					config.update('tracking.taskId', '');
					config.update('tracking.tagIds', []);
					config.update('tracking.billable', '');
					return true;

				default:
					return false;
			}
		})
		.then((resetted) => {
			if (resetted) {
				vscode.window.showInformationMessage(
					'Workspace configuration resetted successfully.'
				);
			}
		});
}
