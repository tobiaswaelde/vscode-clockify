import { Workspace } from './../../../sdk/types/workspace';
import { Event, EventEmitter, ExtensionContext, TreeDataProvider, TreeItem } from 'vscode';
import { GlobalState } from '../../../util/global-state';
import { ProjectTreeItem } from './items';
import { Client } from '../../../sdk/types/client';
import { MessageTreeItem } from '../../../util/treeview/message-tree-item';
import { Config } from '../../../util/config';
import { Clockify } from '../../../sdk';
import { ProjectItem } from './items/item';
import { FieldValueItem } from '../../../util/treeview/field-value-item';
import { sensify } from '../../../util/data';
import * as moment from 'moment';

type OnDidChangeEventData = ProjectTreeItem | undefined;

export class ProjectsProvider implements TreeDataProvider<ProjectTreeItem> {
	private _onDidChangeTreeData: EventEmitter<OnDidChangeEventData> =
		new EventEmitter<OnDidChangeEventData>();
	readonly onDidChangeTreeData: Event<OnDidChangeEventData> = this._onDidChangeTreeData.event;

	constructor(private context: ExtensionContext) {}

	getTreeItem(element: ProjectTreeItem): TreeItem | Thenable<TreeItem> {
		return element;
	}

	async getChildren(element?: ProjectTreeItem | undefined): Promise<ProjectTreeItem[]> {
		const workspace = GlobalState.get('selectedWorkspace') as Workspace | undefined;
		const client = GlobalState.get('selectedClient') as Client | undefined;
		const limit = Config.get<number>('fetchLimit') ?? 200;
		const showIds = Config.get('showIds') ?? false;

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
			const { id, billable, clientName, duration, estimate, hourlyRate } = element.project;
			console.log(estimate);

			const items: ProjectTreeItem[] = [];
			if (showIds) {
				items.push(
					new FieldValueItem('project.id', { name: 'ID', value: sensify(id), icon: 'bytes' })
				);
			}
			items.push(
				new FieldValueItem('project.estimate', {
					name: 'Estimate',
					value: sensify(moment.duration(estimate.estimate).asHours().toFixed(2)) + ' h',
					icon: 'timestamp',
				})
			);
			items.push(
				new FieldValueItem('project.duration', {
					name: 'Duration',
					value: sensify(moment.duration(duration).asHours().toFixed(2)) + ' h',
					icon: 'timestamp',
				})
			);
			items.push(
				new FieldValueItem('project.billable', {
					name: 'Billable',
					value: billable ? 'Yes' : 'No',
					icon: 'boolean',
				})
			);
			items.push(
				new FieldValueItem('project.hourlyRate', {
					name: 'Hourly Rate',
					value: `${Math.round((hourlyRate.amount / 100) * 100) / 100} ${hourlyRate.currency}`,
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
	public refresh(element?: ProjectTreeItem): void {
		this._onDidChangeTreeData.fire(element);
	}

	/**
	 * Register commands related to the tree view provider
	 * @param ctx The extension context
	 */
	private registerCommands(ctx: ExtensionContext) {}
}
