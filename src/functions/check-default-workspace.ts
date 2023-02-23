import { Dialogs } from '../util/dialogs';
import { Config } from './../util/config';

export async function checkDefaultWorkspace(): Promise<boolean> {
	const workspaceId = Config.get<string>('defaultWorkspaceId');
	if (!workspaceId) {
		const workspace = await Dialogs.selectWorkspace('Select the default workspace.');
		if (!workspace) {
			return false;
		} else {
			Config.set('defaultWorkspaceId', workspace.id, true);
		}
	}

	return true;
}
