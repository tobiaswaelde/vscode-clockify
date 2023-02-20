import { Task } from './../../../../sdk/types/task';
import moment = require('moment');
import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { TaskTreeItem } from '.';
import { Config } from '../../../../util/config';
import { FieldValueItem } from '../../../../util/treeview/field-value-item';
import { sensify } from '../../../../util/data';
import { IdValueItem } from '../../../../util/treeview/id-value-item';

export class TaskItem extends TreeItem {
	contextValue = 'task';

	constructor(public task: Task) {
		super(sensify(task.name), TreeItemCollapsibleState.Collapsed);
	}

	public async getChildren(): Promise<TaskTreeItem[]> {
		const showIds = Config.get<boolean>('showIds');
		const { id } = this.task;

		const status = this.task.status === 'ACTIVE' ? 'Active' : 'Done';
		const estimate = moment.duration(this.task.estimate).format('h[h] m[m]');

		const items: TaskTreeItem[] = [];
		if (showIds) {
			items.push(new IdValueItem('task.id', id));
		}
		items.push(
			new FieldValueItem('task.status', { name: 'Status', value: status, icon: 'boolean' })
		);
		items.push(
			new FieldValueItem('task.estimate', { name: 'Estimate', value: estimate, icon: 'timestamp' })
		);
		return items;
	}
}
