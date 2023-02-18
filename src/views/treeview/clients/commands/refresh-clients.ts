import { ClientsProvider } from '..';
import { ProviderStore } from '../../../../util/stores/provider-store';
import { refreshProjects } from '../../projects/commands/refresh-projects';
import { ClientItem } from '../items/item';

export function refreshClients(element?: ClientItem): void {
	const clientsProvider = ProviderStore.get<ClientsProvider>('clients');
	clientsProvider.refresh(element);
	refreshProjects();
}
