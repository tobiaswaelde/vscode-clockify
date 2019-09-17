import * as vscode from 'vscode';

export async function autoStopTracking(context: vscode.ExtensionContext): Promise<void> {
	console.log('clockify.autoStopTracking');
	try {
		context.globalState.update('tracking:isTracking', false);
		return;
	} catch (err) {
		return;
	}
}
