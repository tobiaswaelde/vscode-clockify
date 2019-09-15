import * as vscode from 'vscode';

export async function selectVisibility(): Promise<boolean> {
	const isPublic = await vscode.window
		.showQuickPick(['Public', 'Private'], {
			ignoreFocusOut: true,
			placeHolder: 'Visibility'
		})
		.then((isPublic) => {
			if (isPublic === undefined) {
				throw new Error();
			}
			return isPublic === 'Public';
		});

	return isPublic;
}
