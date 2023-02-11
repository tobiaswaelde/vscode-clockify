import { Client } from '../../../../sdk/types/client';
import { GlobalState } from '../../../../util/global-state';
import { refreshProjects } from '../../projects/commands/refresh-projects';
import { refreshClients } from './refresh-clients';

export async function selectClient(client?: Client): Promise<void> {
	const selectedClient = GlobalState.get<Client>('selectedClient');

	// skip if current client is already selected
	if (selectedClient && selectedClient.id === client?.id) {
		GlobalState.set('selectedClient', null);
	} else {
		GlobalState.set('selectedClient', client);
	}

	GlobalState.set('selectedProject', null);

	//TODO refresh tree views
	refreshClients();
	refreshProjects();
}
