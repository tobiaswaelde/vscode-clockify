import { Config } from '../../../../util/config';
import { WorkspaceItem } from '../items/item';

export async function setWorkspaceAsDefault(item: WorkspaceItem) {
	if (item.workspace.id) {
		Config.set('defaultWorkspaceId', item.workspace.id, true);
	}
}
