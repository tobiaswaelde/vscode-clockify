import { TreeView } from '../..';
import { Workspace } from '../../../../sdk/types/workspace';
import { GlobalState } from '../../../../util/global-state';

export async function selectWorkspace(workspace: Workspace): Promise<void> {
	const selectedWorkspace = GlobalState.get<Workspace>('selectedWorkspace');

	// skip if workspace is already selected
	if (selectedWorkspace && selectedWorkspace.id === workspace.id) {
		return;
	}

	if (workspace) {
		GlobalState.set('selectedWorkspace', workspace);
		GlobalState.set('selectedClient', null);
		GlobalState.set('selectedProject', null);

		TreeView.refreshWorkspaces();
		TreeView.refreshClients();
		TreeView.refreshProjects();
		TreeView.refreshTasks();
		TreeView.refreshTags();
		TreeView.refreshTimeentries();
	}
}
