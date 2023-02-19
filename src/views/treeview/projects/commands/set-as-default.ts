import { Config } from '../../../../util/config';
import { ProjectItem } from '../items/item';

export async function setProjectAsDefault(item: ProjectItem) {
	if (item.project.id) {
		Config.set('tracking.projectId', item.project.id, false);
		Config.set('tracking.taskId', undefined, false);
	}
}
