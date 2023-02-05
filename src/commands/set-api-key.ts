import * as vscode from 'vscode';
import { Clockify } from '../sdk';
import { Config } from '../util/config';

export async function setApiKey() {
	// ask user for the api key
	const apiKey = await vscode.window.showInputBox({
		prompt: 'Enter your API key.',
		placeHolder: 'Enter your API key',
		ignoreFocusOut: true,
	});
	if (!apiKey) {
		return;
	}

	// set API key in config
	Config.set('apiKey', apiKey, true);

	// authenticate the SDK
	Clockify.authenticate(apiKey);

	//TODO refresh tree view providers
}
