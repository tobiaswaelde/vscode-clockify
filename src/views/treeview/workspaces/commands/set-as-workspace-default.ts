import { Config } from '../../../../util/config';
import { WorkspaceItem } from '../items/item';

export async function setWorkspaceAsWorkspaceDefault(item: WorkspaceItem) {
	if (item.workspace.id) {
		await Promise.all([
			Config.set('tracking.workspaceId', item.workspace.id, false),
			Config.set('tracking.projectId', undefined, false),
			Config.set('tracking.taskId', undefined, false),
		]);
	}
}
