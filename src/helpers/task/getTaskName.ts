import * as vscode from 'vscode';

export async function getTaskName(): Promise<string> {
	const taskName = vscode.window
		.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Enter a name for your task',
			prompt: 'Task name'
		})
		.then((taskName) => {
			if (taskName === undefined) {
				throw new Error();
			}
			return taskName;
		});

	return taskName;
}
