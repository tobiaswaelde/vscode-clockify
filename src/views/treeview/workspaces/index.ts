import { MessageTreeItem } from '../../../util/treeview/message-tree-item';
import {
	commands,
	Event,
	EventEmitter,
	ExtensionContext,
	TreeDataProvider,
	TreeItem,
} from 'vscode';
import { Clockify } from '../../../sdk';
import { WorkspaceTreeItem } from './items';
import { WorkspaceItem } from './items/item';
import { Commands } from '../../../config/commands';
import { selectWorkspace } from './commands/select-workspace';
import { apiKeySet } from '../../../helpers';
import { addWorkspace } from './commands/add-workspace';
import { refreshWorkspaces } from './commands/refresh-workspaces';
import { sensify } from '../../../util/data';
import { FieldValueItem } from '../../../util/treeview/field-value-item';
import { Config } from '../../../util/config';

type OnDidChangeEventData = WorkspaceTreeItem | undefined;

export class WorkspacesProvider implements TreeDataProvider<WorkspaceTreeItem> {
	private _onDidChangeTreeData: EventEmitter<OnDidChangeEventData> =
		new EventEmitter<OnDidChangeEventData>();
	readonly onDidChangeTreeData: Event<OnDidChangeEventData> = this._onDidChangeTreeData.event;

	constructor(private context: ExtensionContext) {
		this.registerCommands(context);
	}

	getTreeItem(element: WorkspaceTreeItem): TreeItem | Thenable<TreeItem> {
		return element;
	}

	async getChildren(element?: WorkspaceTreeItem | undefined): Promise<WorkspaceTreeItem[]> {
		// check if API key if set
		if (!apiKeySet()) {
			return [
				new MessageTreeItem('API key not set. Click to set API key.', undefined, 'error', {
					command: Commands.setApiKey,
					title: 'Set API key',
				}),
			];
		}

		// render workspace items
		if (element === undefined) {
			const workspaces = await Clockify.getWorkspaces();
			// show info if no workspaces were found
			if (workspaces.length === 0) {
				return [new MessageTreeItem('No workspaces found.', undefined, 'info')];
			}

			// order workspaces by name and return them
			workspaces.sort((a, b) => a.name.localeCompare(b.name));
			return workspaces.map((x) => new WorkspaceItem(x));
		}

		// render workspace info items
		if (element instanceof WorkspaceItem) {
			const showIds = Config.get<boolean>('showIds') ?? false;
			const { id, hourlyRate } = element.workspace;

			const formattedHourlyRate = Math.round((hourlyRate.amount / 100) * 100) / 100;

			const items: WorkspaceTreeItem[] = [];
			if (showIds) {
				items.push(
					new FieldValueItem('workspace.id', {
						name: 'ID',
						value: sensify(id),
						icon: 'bytes',
					})
				);
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

		return [];
	}

	/**
	 * Refresh tree view
	 * @param element The element to refresh
	 */
	public refresh(element?: WorkspaceTreeItem): void {
		this._onDidChangeTreeData.fire(element);
	}

	/**
	 * Register commands related to the tree view provider
	 * @param ctx The extension context
	 */
	private registerCommands(ctx: ExtensionContext) {
		ctx.subscriptions.push(
			commands.registerCommand(Commands.workspacesRefresh, (x) => refreshWorkspaces(x)),
			commands.registerCommand(Commands.workspacesSelection, selectWorkspace),
			commands.registerCommand(Commands.workspacesAdd, addWorkspace)
		);
	}
}
