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
import { selectProject } from './commands/select-project';
import { renameProject } from './commands/rename-project';
import { deleteProject } from './commands/delete-project';
import { setProjectAsDefault } from './commands/set-as-default';
import { TreeView } from '..';

type OnDidChangeEventData = ProjectTreeItem | undefined;

export class ProjectsProvider implements TreeDataProvider<ProjectTreeItem> {
	private _onDidChangeTreeData: EventEmitter<OnDidChangeEventData> =
		new EventEmitter<OnDidChangeEventData>();
	readonly onDidChangeTreeData: Event<OnDidChangeEventData> = this._onDidChangeTreeData.event;

	constructor(context: ExtensionContext) {
		this.registerCommands(context);
	}

	getTreeItem(element: ProjectTreeItem): TreeItem | Thenable<TreeItem> {
		return element;
	}

	async getChildren(element?: ProjectTreeItem | undefined): Promise<ProjectTreeItem[]> {
		const workspace = GlobalState.get<Workspace>('selectedWorkspace');

		// check if workspace is selected
		if (!workspace) {
			return [new MessageTreeItem('Select workspace', undefined, 'info')];
		}

		// render project item
		if (element === undefined) {
			const client = GlobalState.get<Client>('selectedClient');
			const limit = Config.get<number>('fetchLimit') ?? 200;

			const projects = await Clockify.getProjects(workspace.id, { page: 1, pageSize: limit });
			const filteredProjects = projects.filter((x) => (client ? x.clientId === client.id : true));

			// show info if no projects were found
			if (filteredProjects.length === 0) {
				if (client) {
					return [
						new MessageTreeItem('No projects found for the selected client.', undefined, 'info'),
					];
				}
				return [new MessageTreeItem('No projects found.', undefined, 'info')];
			}

			// order projects by name and return them
			filteredProjects.sort((a, b) => a.name.localeCompare(b.name));
			return filteredProjects.map((x) => new ProjectItem(x));
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
		ctx.subscriptions.push(
			commands.registerCommand(Commands.projectsRefresh, (x) => TreeView.refreshProjects(x)),
			commands.registerCommand(Commands.projectsSelection, selectProject),
			commands.registerCommand(Commands.projectsSetDefault, (x) => setProjectAsDefault(x)),
			commands.registerCommand(Commands.projectsAdd, addProject),
			commands.registerCommand(Commands.projectsRename, renameProject),
			commands.registerCommand(Commands.projectsDelete, (x) => deleteProject(x))
		);
	}
}
