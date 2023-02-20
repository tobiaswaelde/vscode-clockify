import moment = require('moment');
import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { TimeentryTreeItem } from '.';
import { Clockify } from '../../../../sdk';
import { TimeEntryImpl } from '../../../../sdk/types/time-entry';
import { Config } from '../../../../util/config';
import { sensify } from '../../../../util/data';
import { FieldValueItem } from '../../../../util/treeview/field-value-item';
import { IdValueItem } from '../../../../util/treeview/id-value-item';

export class TimeentryItem extends TreeItem {
	contextValue = 'timeentry';

	constructor(public timeentry: TimeEntryImpl) {
		const isRunning = timeentry.timeInterval.end === null;
		const title = `${isRunning ? '🚀' : ''} ${sensify(timeentry.description) || 'No description'}`;

		super(title, TreeItemCollapsibleState.Collapsed);

		if (isRunning) {
			this.description = moment
				.duration(moment().diff(timeentry.timeInterval.start))
				.format('H[h] m[m]');
		} else {
			this.description = moment.duration(timeentry.timeInterval.duration).format('H[h] m[m]');
		}
	}

	private getDuration() {
		const { start, end } = this.timeentry.timeInterval;

		if (end === null) {
			// get duration from start to now
			return moment.duration(moment().diff(start));
		} else {
			return moment.duration(moment(end).diff(start));
		}
	}

	public async getChildren(): Promise<TimeentryTreeItem[]> {
		const showIds = Config.get<boolean>('showIds');

		const {
			id,
			workspaceId,
			projectId,
			taskId,
			timeInterval: { start, end },
			billable,
			tagIds,
		} = this.timeentry;

		const project =
			projectId !== null ? await Clockify.getProject(workspaceId, projectId) : undefined;
		const task =
			taskId !== null && projectId !== null
				? await Clockify.getTask(workspaceId, projectId, taskId)
				: undefined;
		const tags = tagIds !== null ? await Clockify.getTagsByID(workspaceId, tagIds) : [];

		const items: TimeentryTreeItem[] = [];
		// ID
		if (showIds) {
			items.push(new IdValueItem('timeentry.id', id));
		}

		// project
		items.push(
			new FieldValueItem('timeentry.project', {
				name: 'Project',
				value: sensify(project?.name || ''),
				icon: 'reference',
			})
		);

		// task
		items.push(
			new FieldValueItem('timeentry.task', {
				name: 'Task',
				value: sensify(task?.name || ''),
				icon: 'reference',
			})
		);

		// start
		items.push(
			new FieldValueItem('timeentry.start', {
				name: 'Start',
				value: start ? moment(start).format('HH:mm:ss') : '',
				icon: 'timestamp',
			})
		);

		// end
		items.push(
			new FieldValueItem('timeentry.end', {
				name: 'End',
				value: end ? moment(end).format('HH:mm:ss') : '',
				icon: 'timestamp',
			})
		);

		// duration
		items.push(
			new FieldValueItem('timeentry.duration', {
				name: 'Duration',
				value: this.getDuration().format('H[h] m[m] s[s]'),
				icon: 'timestamp',
			})
		);

		// billable
		items.push(
			new FieldValueItem('timeentry.billable', {
				name: 'Billable',
				value: billable ? 'Yes' : 'No',
				icon: 'boolean',
			})
		);

		// tags
		items.push(
			new FieldValueItem('timeentry.tags', {
				name: 'Tags',
				value: tags.map((x) => sensify(x.name)).join(', '),
				icon: 'reference',
			})
		);

		return items;
	}
}
