import { Workspace } from '../../../../sdk/types/workspace';
import { GlobalState } from '../../../../util/global-state';
import { refreshClients } from '../../clients/commands/refresh-clients';
import { refreshProjects } from '../../projects/commands/refresh-projects';

export async function selectWorkspace(workspace: Workspace): Promise<void> {
	console.log('select workspace', workspace.id);
	const selectedWorkspace = GlobalState.get('selectedWorkspace') as Workspace | undefined;

	// skip if workspace is already selected
	if (selectedWorkspace && selectedWorkspace.id === workspace.id) {
		return;
	}

	if (workspace) {
		GlobalState.set('selectedWorkspace', workspace);
		GlobalState.set('selectedClient', null);
		GlobalState.set('selectedProject', null);

		console.log('workspace selected', workspace.id);
		//TODO refresh tree views
		refreshClients();
		refreshProjects();
	}
}
