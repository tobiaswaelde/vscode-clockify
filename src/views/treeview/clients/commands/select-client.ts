import { TreeView } from '../..';
import { Client } from '../../../../sdk/types/client';
import { GlobalState } from '../../../../util/global-state';

export async function selectClient(client?: Client): Promise<void> {
	const selectedClient = GlobalState.get<Client>('selectedClient');

	// skip if current client is already selected
	if (selectedClient && selectedClient.id === client?.id) {
		GlobalState.set('selectedClient', null);
	} else {
		GlobalState.set('selectedClient', client);
	}

	GlobalState.set('selectedProject', null);

	// refresh tree views
	TreeView.refreshClients();
	TreeView.refreshProjects();
	TreeView.refreshTasks();
}
