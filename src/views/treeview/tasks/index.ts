import { Project } from './../../../sdk/types/project';
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
import { TaskTreeItem } from './items';
import { MessageTreeItem } from '../../../util/treeview/message-tree-item';
import { Clockify } from '../../../sdk';
import { Config } from '../../../util/config';
import { TaskItem } from './items/item';
import { Commands } from '../../../config/commands';
import { addTask } from './commands/add-task';
import { setTaskAsDefault } from './commands/set-as-default';
import { TreeView } from '..';

type OnDidChangeEventData = TaskTreeItem | undefined;

export class TasksProvider implements TreeDataProvider<TaskTreeItem> {
	private _onDidChangeTreeData: EventEmitter<OnDidChangeEventData> =
		new EventEmitter<OnDidChangeEventData>();
	readonly onDidChangeTreeData: Event<OnDidChangeEventData> = this._onDidChangeTreeData.event;

	constructor(context: ExtensionContext) {
		this.registerCommands(context);
	}

	getTreeItem(element: TaskTreeItem): TreeItem | Thenable<TreeItem> {
		return element;
	}

	async getChildren(element?: TaskTreeItem | undefined): Promise<TaskTreeItem[]> {
		const workspace = GlobalState.get<Workspace>('selectedWorkspace');
		const project = GlobalState.get<Project>('selectedProject');

		// check if workspace & project are selected
		if (!workspace || !project) {
			return [new MessageTreeItem('Select a project to display related tasks.', undefined, 'info')];
		}

		// render task item
		if (element === undefined) {
			const limit = Config.get<number>('fetchLimit') ?? 200;
			const tasks = await Clockify.getTasks(workspace.id, project.id, { page: 1, pageSize: limit });

			// show info if no tasks were found
			if (tasks.length === 0) {
				return [new MessageTreeItem('No tasks found for the selected project.', undefined, 'info')];
			}

			// order tasks by name and return them
			tasks.sort((a, b) => a.name.localeCompare(b.name));
			return tasks.map((x) => new TaskItem(x));
		}

		// render task info items
		if (element instanceof TaskItem) {
			return element.getChildren();
		}

		return [];
	}

	/**
	 * Refresh tree view
	 * @param element The element to refresh
	 */
	public refresh(element?: TaskTreeItem): void {
		this._onDidChangeTreeData.fire(element);
	}

	/**
	 * Register commands related to the tree view provider
	 * @param ctx The extension context
	 */
	private registerCommands(ctx: ExtensionContext) {
		ctx.subscriptions.push(
			commands.registerCommand(Commands.tasksRefresh, (x) => TreeView.refreshTasks(x)),
			commands.registerCommand(Commands.tasksSetDefault, (x) => setTaskAsDefault(x)),
			commands.registerCommand(Commands.tasksAdd, addTask)
		);
	}
}
