import * as moment from 'moment';
import 'moment-duration-format';
import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { ProjectTreeItem } from '.';
import { Commands } from '../../../../config/commands';
import { Project } from '../../../../sdk/types/project';
import { Config } from '../../../../util/config';
import { sensify } from '../../../../util/data';
import { GlobalState } from '../../../../util/global-state';
import { FieldValueItem } from '../../../../util/treeview/field-value-item';
import { IdValueItem } from '../../../../util/treeview/id-value-item';

export class ProjectItem extends TreeItem {
	contextValue = 'project';

	constructor(public project: Project) {
		const selectedProject = GlobalState.get<Project>('selectedProject');
		const isSelected = project.id === selectedProject?.id;

		super(sensify(project.name), TreeItemCollapsibleState.Collapsed);

		this.command = {
			command: Commands.projectsSelection,
			title: '',
			arguments: [project],
		};

		this.iconPath = new ThemeIcon(isSelected ? 'circle-filled' : 'circle-outline');
	}

	public async getChildren(): Promise<ProjectTreeItem[]> {
		const showIds = Config.get('showIds') ?? false;
		const { id, billable, clientName, duration, estimate, hourlyRate } = this.project;

		const items: ProjectTreeItem[] = [];

		if (showIds) {
			items.push(new IdValueItem('project.id', id));
		}
		items.push(
			new FieldValueItem('project.client', {
				name: 'Client',
				value: sensify(clientName),
				icon: 'reference',
			})
		);
		items.push(
			new FieldValueItem('project.estimate', {
				name: 'Estimate',
				value: moment.duration(estimate.estimate).format('h[h] m[m]'),
				icon: 'timestamp',
			})
		);
		items.push(
			new FieldValueItem('project.duration', {
				name: 'Duration',
				value: moment.duration(duration).format('h[h] m[m]'),
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
		items.push(
			new FieldValueItem('project.isPublic', {
				name: 'Public',
				value: this.project.public ? 'Yes' : 'No',
				icon: 'boolean',
			})
		);

		return items;
	}
}
