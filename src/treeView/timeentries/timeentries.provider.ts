import * as vscode from 'vscode';
import { WorkspaceDto, TimeEntryDtoImpl, ProjectDtoImpl } from '../../api/interfaces';
import { messageTreeItem, FieldValue, IconType, getFilePath } from '../utils';
import { getTimeentriesForUser } from '../../api/actions/timeEntry';
import { getUser } from '../../api/actions/user';
import moment = require('moment');

export class TimeentriesProvider implements vscode.TreeDataProvider<TimeentryProviderItem> {
	private _onDidChangeTreeData = new vscode.EventEmitter<TimeentryProviderItem | undefined>();
	public onDidChangeTreeData = this._onDidChangeTreeData.event;

	constructor(private context: vscode.ExtensionContext) {}

	refresh(element?: TimeentryProviderItem): void {
		this._onDidChangeTreeData.fire(element);
	}

	getTreeItem(element: TimeentryProviderItem): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: TimeentryProviderItem): Promise<TimeentryProviderItem[]> {
		const workspace = this.context.globalState.get<WorkspaceDto>('selectedWorkspace');
		const config = vscode.workspace.getConfiguration('clockify');
		const limit = config.get<number>('downloadLimit')!;
		
		if (!workspace) {
			return [messageTreeItem('Select workspace')];
		}

		if (!element) {
			try {
				const user = await getUser();
				const project = this.context.globalState.get<ProjectDtoImpl>('selectedProject');
				const projectId = project && project.id;
				const timeentries = await getTimeentriesForUser(
					workspace.id,
					user.id,
					undefined,
					undefined,
					undefined,
					projectId,
					undefined,
					undefined,
					undefined,
					undefined,
					undefined,
					undefined,
					undefined,
					1,
					limit
				);
				if (timeentries.length === 0) {
					return [messageTreeItem('No Timeentries')];
				}

				return timeentries.map((timeentry) => {
					return new TimeentryItem(timeentry);
				});
			} catch (err) {
				return [messageTreeItem('Error', undefined, 'alert')];
			}
		} else if (element instanceof TimeentryItem) {
			const timeentry = element.timeentry;
			let items: TimeentryProviderItem[] = [];

			// items.push(
			// 	new TimeentryInfoItem(
			// 		{ name: 'Project', value: timeentry.projectId },
			// 		IconType.String
			// 	)
			// );
			items.push(
				new TimeentryInfoItem(
					{
						name: 'Duration',
						value: moment.duration(timeentry.timeInterval.duration).humanize()
					},
					IconType.Timestamp
				)
			);
			return items;
		} else if (element instanceof TimeentryInfoItem) {
			return [];
		} else {
			console.error('Should not happen!', element);
			return [];
		}
	}
}

export type TimeentryProviderItem = TimeentryItem | TimeentryInfoItem;

export class TimeentryItem extends vscode.TreeItem {
	contextValue = 'timeentry';

	constructor(public timeentry: TimeEntryDtoImpl) {
		super(
			timeentry.description ? timeentry.description : 'No description',
			vscode.TreeItemCollapsibleState.Collapsed
		);

		this.description = moment.duration(timeentry.timeInterval.duration).humanize();
	}

	get tooltip(): string {
		return this.timeentry.id;
	}
}

export class TimeentryInfoItem extends vscode.TreeItem {
	contextValue = 'timeentries.info';
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
