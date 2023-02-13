import { ClientsProvider } from '..';
import { GlobalState } from '../../../../util/global-state';
import { ProviderStore } from '../../../../util/stores/provider-store';
import { refreshProjects } from '../../projects/commands/refresh-projects';
import { ClientItem } from '../items/item';

export function refreshClients(element?: ClientItem): void {
	GlobalState.set('selectedProject', null);

	const clientsProvider = ProviderStore.get<ClientsProvider>('clients');
	clientsProvider.refresh(element);
	refreshProjects();
}
