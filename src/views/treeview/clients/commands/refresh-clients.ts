import { ClientsProvider } from '..';
import { GlobalState } from '../../../../util/global-state';
import { ProviderStore } from '../../../../util/stores/provider-store';
import { ClientItem } from '../items/item';

export function refreshClients(element?: ClientItem): void {
	GlobalState.set('selectedClient', null);
	GlobalState.set('selectedProject', null);

	const clientsProvider = ProviderStore.get<ClientsProvider>('clients');
	// const projectsProvider = ProviderStore.get<ProjectsProvider>('projects');
	clientsProvider.refresh(element);
	// projectsProvider.refresh(element);
}
