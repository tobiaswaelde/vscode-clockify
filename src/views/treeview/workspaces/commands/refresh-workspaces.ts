import { WorkspacesProvider } from '..';
import { ProviderStore } from '../../../../util/stores/provider-store';
import { refreshClients } from '../../clients/commands/refresh-clients';
import { refreshProjects } from '../../projects/commands/refresh-projects';
import { refreshTags } from '../../tags/commands/refresh-tags';
import { refreshTasks } from '../../tasks/commands/refresh-tasks';
import { refreshTimeentries } from '../../timeentries/commands/refresh-timeentries';
import { WorkspaceItem } from '../items/item';

export function refreshWorkspaces(element?: WorkspaceItem): void {
	const workspacesProvider = ProviderStore.get<WorkspacesProvider>('workspaces');
	workspacesProvider.refresh(element);
	refreshClients();
	refreshProjects();
	refreshTasks();
	refreshTags();
	refreshTimeentries();
}
