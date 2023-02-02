import * as vscode from 'vscode';
import { WorkspaceDto, ProjectDtoImpl, TaskDto } from '../../api/interfaces';
import { messageTreeItem, FieldValue, IconType, getFilePath } from '../utils';
import { getTasks } from '../../api/actions/task';
import moment = require('moment');
import { ProjectInfoItem } from '../projects/projects.provider';

export class TasksProvider implements vscode.TreeDataProvider<TaskProviderItem> {
	private _onDidChangeTreeData = new vscode.EventEmitter<TaskProviderItem | undefined>();
	readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

	constructor(private context: vscode.ExtensionContext) {}

	refresh(element?: TaskProviderItem): void {
		this._onDidChangeTreeData.fire(element);
	}

	getTreeItem(element: TaskProviderItem): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: TaskProviderItem): Promise<TaskProviderItem[]> {
		const workspace = this.context.globalState.get<WorkspaceDto>('selectedWorkspace');
		const project = this.context.globalState.get<ProjectDtoImpl>('selectedProject');
		const config = vscode.workspace.getConfiguration('clockify');
		const limit = config.get<number>('downloadLimit')!;

		if (!workspace || !project) {
			return [messageTreeItem('Select project')];
		}

		if (!element) {
			try {
				const tasks = await getTasks(workspace.id, project.id, undefined, undefined, 1, limit);
				if (tasks.length === 0) {
					return [messageTreeItem('No Tasks')];
				}
				return tasks
					.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)) // Sort A>Z
					.map((task) => {
						return new TaskItem(task);
					});
			} catch (err) {
				return [messageTreeItem('Error', undefined, 'alert')];
			}
		} else if (element instanceof TaskItem) {
			const task = element.task;
			let items: TaskProviderItem[] = [];

			const estimate = moment.duration(task.estimate);
			items.push(
				new ProjectInfoItem(
					{ name: 'Estimate', value: `${estimate.asHours()} hours` },
					IconType.Timestamp
				)
			);
			items.push(
				new ProjectInfoItem({ name: 'Status', value: task.status }, IconType.Boolean)
			);

			return items;
		} else if (element instanceof TaskInfoItem) {
			return [];
		} else {
			console.error('Should not happen', element);
			return [];
		}
	}
}

export type TaskProviderItem = TaskItem | TaskInfoItem;

export class TaskItem extends vscode.TreeItem {
	contextValue = 'task';
	iconPath = getFilePath('assets', 'clockify', 'dark', 'tasks.svg');

	constructor(public task: TaskDto) {
		super(task.name, vscode.TreeItemCollapsibleState.Collapsed);

		const estimate = moment.duration(task.estimate);
		this.description = `${estimate.asHours()} hours`;
	}

	get tooltip(): string {
		return this.task.id;
	}
}

export class TaskInfoItem extends vscode.TreeItem {
	contextValue = 'tasks.info';
	iconPath: string;

	constructor(public fieldValue: FieldValue, public iconType: IconType) {
		super(fieldValue.name, vscode.TreeItemCollapsibleState.None);

		this.iconPath = getFilePath('assets', 'valuetype', `${iconType}.svg`);
		this.description = fieldValue.value;
	}

	get tooltip(): string {
		return this.fieldValue.value;
	}
}
