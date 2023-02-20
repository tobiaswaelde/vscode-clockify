import { GlobalState } from './../../../../util/global-state';
import { Config } from './../../../../util/config';
import { Workspace } from '../../../../sdk/types/workspace';
import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { Commands } from '../../../../config/commands';
import { sensify } from '../../../../util/data';
import { WorkspaceTreeItem } from '.';
import { FieldValueItem } from '../../../../util/treeview/field-value-item';
import { IdValueItem } from '../../../../util/treeview/id-value-item';

export class WorkspaceItem extends TreeItem {
	contextValue = 'workspace';

	constructor(public workspace: Workspace) {
		const selectedWorkspace = GlobalState.get<Workspace>('selectedWorkspace');
		const isSelected = workspace.id === selectedWorkspace?.id;

		super(sensify(workspace.name), TreeItemCollapsibleState.Collapsed);

		this.command = {
			command: Commands.workspacesSelection,
			title: '',
			arguments: [workspace],
		};

		this.iconPath = new ThemeIcon(isSelected ? 'circle-filled' : 'circle-outline');

		if (Config.get('workspaces.showNumberOfMembers') === true) {
			this.description = `- ${workspace.memberships.length} ${
				workspace.memberships.length === 1 ? 'User' : 'Users'
			}`;
		}
	}

	public async getChildren(): Promise<WorkspaceTreeItem[]> {
		const showIds = Config.get<boolean>('showIds') ?? false;
		const { id, hourlyRate } = this.workspace;

		const formattedHourlyRate = Math.round((hourlyRate.amount / 100) * 100) / 100;

		const items: WorkspaceTreeItem[] = [];
		if (showIds) {
			items.push(new IdValueItem('workspace.id', id));
		}
		items.push(
			new FieldValueItem('workspace.hourlyRate', {
				name: 'Hourly Rate',
				value: `${sensify(formattedHourlyRate)} ${hourlyRate.currency}`,
				icon: 'number',
			})
		);
		return items;
	}
}
