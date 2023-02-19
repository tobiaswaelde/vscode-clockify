import { Config } from '../../../../util/config';
import { TaskItem } from '../items/item';

export async function setTaskAsDefault(item: TaskItem) {
	if (item.task.id) {
		Config.set('tracking.taskId', item.task.id, false);
	}
}
