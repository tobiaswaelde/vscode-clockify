import { WorkspacesProvider } from '..';
import { GlobalState } from '../../../../util/global-state';
import { ProviderStore } from '../../../../util/stores/provider-store';
import { refreshClients } from '../../clients/commands/refresh-clients';
import { refreshProjects } from '../../projects/commands/refresh-projects';
import { WorkspaceItem } from '../items/item';

export function refreshWorkspaces(element?: WorkspaceItem): void {
	GlobalState.set('selectedWorkspace', null);

	const workspacesProvider = ProviderStore.get<WorkspacesProvider>('workspaces');
	workspacesProvider.refresh(element);
	refreshClients();
	refreshProjects();
}
