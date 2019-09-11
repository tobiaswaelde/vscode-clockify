import * as vscode from 'vscode';
import http from '../services/http.service';
import * as _ from 'lodash';

export async function selectWorkspace(context: vscode.ExtensionContext) {
	const workspacesRaw: [] = await getWorkspaces();
	const workspaces = workspacesRaw.map((workspace) => {
		return _.pick(workspace, ['id', 'name']);
	});

	let items: object[] = [];
	workspaces.forEach((w) => {
		items.push({
			label: w.name,
			detail: w.id
		});
	});
	vscode.window.showQuickPick(items).then((item) => {
		setWorkspace(context, item.detail);
	});
}

function setWorkspace(context: vscode.ExtensionContext, workspaceId: string) {
	context.globalState.update('workspaceId', workspaceId);
	vscode.window.showInformationMessage(`Workspace set successfully`);
}

async function getWorkspaces() {
	return http
		.get('/workspaces')
		.then((data) => {
			return data.data;
		})
		.catch((err) => {
			console.error(err);
		});
}
