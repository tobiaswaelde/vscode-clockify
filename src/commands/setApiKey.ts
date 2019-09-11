import * as vscode from 'vscode';
import http from '../services/http.service';

export function setApiKey(context: vscode.ExtensionContext) {
	vscode.window
		.showInputBox({
			placeHolder: 'Your API key',
			prompt: 'Enter your API key',
			ignoreFocusOut: true
		})
		.then((input) => {
			if (input === undefined) {
				return;
			}

			context.globalState.update('apiKey', input);
			http.authenticate(input);

			vscode.window.showInformationMessage(`API key set successfully.`);
		});
}
