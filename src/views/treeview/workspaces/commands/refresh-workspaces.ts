import { WorkspacesProvider } from '..';
import { ProviderStore } from '../../../../util/stores/provider-store';
import { WorkspaceItem } from '../items/item';

export function refreshWorkspaces(element?: WorkspaceItem): void {
	const workspacesProvider = ProviderStore.get<WorkspacesProvider>('workspaces');
	workspacesProvider.refresh(element);
}
