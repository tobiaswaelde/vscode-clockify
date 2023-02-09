import { Config } from './../../../../util/config';
import { Workspace } from './../../../../sdk/types';
import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { getIconPath } from '../../../../util/icon';
import { Commands } from '../../../../config/commands';
import { sensify } from '../../../../util/data';

export class WorkspaceItem extends TreeItem {
	contextValue = 'workspace';

	constructor(public workspace: Workspace) {
		super(sensify(workspace.name), TreeItemCollapsibleState.Collapsed);

		this.iconPath = getIconPath('workspaces');

		this.command = {
			command: Commands.workspacesSelection,
			title: '',
			arguments: [workspace],
		};

		this.tooltip = workspace.id;

		if (Config.get('workspaces.showNumberOfMembers') === true) {
			this.description = `- ${workspace.memberships.length} ${
				workspace.memberships.length === 1 ? 'User' : 'Users'
			}`;
		}
	}
}
