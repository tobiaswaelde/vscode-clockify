import { Workspace } from './../../../../sdk/types';
import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { getIconPath } from '../../../../util/icon';
import { Commands } from '../../../../config/commands';

export class WorkspaceItem extends TreeItem {
	contextValue = 'workspace';

	constructor(public workspace: Workspace) {
		super(workspace.name, TreeItemCollapsibleState.Collapsed);

		this.iconPath = getIconPath('workspaces');
		console.log(this.iconPath);

		this.command = {
			command: Commands.workspacesSelection,
			title: '',
			arguments: [workspace],
		};

		this.tooltip = workspace.id;
	}
}
