import { Workspace } from './../../../../sdk/types';
import { GlobalState } from '../../../../util/global-state';

export async function selectWorkspace(workspace: Workspace): Promise<void> {
	const currentWorkspace = GlobalState.get('selectedWorkspace') as Workspace | undefined;

	// skip if workspace is already selected
	if (currentWorkspace && currentWorkspace.id === workspace.id) {
		return;
	}

	if (workspace) {
		GlobalState.set('selectedWorkspace', workspace);
		console.log('workspace selected', workspace.id);
		//TODO refesh tree views
	}
}
