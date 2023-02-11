import { GlobalState } from './../../../../util/global-state';
import { Config } from './../../../../util/config';
import { Workspace } from '../../../../sdk/types/workspace';
import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { Commands } from '../../../../config/commands';
import { sensify } from '../../../../util/data';

export class WorkspaceItem extends TreeItem {
	contextValue = 'workspace';

	constructor(public workspace: Workspace) {
		const selectedWorkspace = GlobalState.get<Workspace>('selectedWorkspace');
		const selected = workspace.id === selectedWorkspace?.id;

		super(sensify(workspace.name), TreeItemCollapsibleState.Collapsed);

		this.command = {
			command: Commands.workspacesSelection,
			title: '',
			arguments: [workspace],
		};

		this.iconPath = new ThemeIcon(selected ? 'circle-filled' : 'circle-outline');

		if (Config.get('workspaces.showNumberOfMembers') === true) {
			this.description = `- ${workspace.memberships.length} ${
				workspace.memberships.length === 1 ? 'User' : 'Users'
			}`;
		}
	}
}
