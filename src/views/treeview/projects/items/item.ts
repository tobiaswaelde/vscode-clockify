import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { Commands } from '../../../../config/commands';
import { Project } from '../../../../sdk/types/project';
import { sensify } from '../../../../util/data';
import { getColoredProjectIcon } from '../../../../util/icon';

export class ProjectItem extends TreeItem {
	contextValue = 'project';

	constructor(public project: Project) {
		super(sensify(project.name), TreeItemCollapsibleState.Collapsed);

		this.command = {
			command: Commands.projectsSelection,
			title: '',
			arguments: [project],
		};

		this.description = project.public ? 'public' : 'private';

		this.iconPath = getColoredProjectIcon(project.color);
	}
}
