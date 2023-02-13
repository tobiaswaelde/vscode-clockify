import { Workspace } from './../../../sdk/types/workspace';
import {
	commands,
	Event,
	EventEmitter,
	ExtensionContext,
	TreeDataProvider,
	TreeItem,
} from 'vscode';
import { GlobalState } from '../../../util/global-state';
import { ProjectTreeItem } from './items';
import { Client } from '../../../sdk/types/client';
import { MessageTreeItem } from '../../../util/treeview/message-tree-item';
import { Config } from '../../../util/config';
import { Clockify } from '../../../sdk';
import { ProjectItem } from './items/item';
import { Commands } from '../../../config/commands';
import { addProject } from './commands/add-project';

type OnDidChangeEventData = ProjectTreeItem | undefined;

export class ProjectsProvider implements TreeDataProvider<ProjectTreeItem> {
	private _onDidChangeTreeData: EventEmitter<OnDidChangeEventData> =
		new EventEmitter<OnDidChangeEventData>();
	readonly onDidChangeTreeData: Event<OnDidChangeEventData> = this._onDidChangeTreeData.event;

	constructor(private context: ExtensionContext) {
		this.registerCommands(context);
	}

	getTreeItem(element: ProjectTreeItem): TreeItem | Thenable<TreeItem> {
		return element;
	}

	async getChildren(element?: ProjectTreeItem | undefined): Promise<ProjectTreeItem[]> {
		const workspace = GlobalState.get<Workspace>('selectedWorkspace');
		const client = GlobalState.get<Client>('selectedClient');
		const limit = Config.get<number>('fetchLimit') ?? 200;

		// check if workspace is selected
		if (!workspace) {
			return [new MessageTreeItem('Select workspace', undefined, 'info')];
		}

		// render project item
		if (element === undefined) {
			const projects = await Clockify.getProjects(workspace.id, { page: 1, pageSize: limit });
			projects.sort((a, b) => a.name.localeCompare(b.name));

			if (client) {
				return projects.filter((x) => x.clientId === client.id).map((x) => new ProjectItem(x));
			}
			return projects.map((x) => new ProjectItem(x));
		}

		// render project info items
		if (element instanceof ProjectItem) {
			return element.getChildren();
		}

		return [];
	}

	/**
	 * Refresh tree view
	 * @param element The element to refresh
	 */
	public refresh(element?: ProjectTreeItem): void {
		this._onDidChangeTreeData.fire(element);
	}

	/**
	 * Register commands related to the tree view provider
	 * @param ctx The extension context
	 */
	private registerCommands(ctx: ExtensionContext) {
		ctx.subscriptions.push(commands.registerCommand(Commands.projectsAdd, addProject));
	}
}
