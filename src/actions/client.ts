import http from '../services/http.service';
import { ClientDto, ClientRequest } from '../interfaces/interfaces';

export function getClients(workspaceId: string): ClientDto[] {
	let clients: ClientDto[] = [];
	http.get(`/workspaces/${workspaceId}/clients`)
		.then((res) => {
			// return res.data;
			clients = res.data;
		})
		.catch((err) => {
			clients = [];
		});
	return clients;
}

export function addNewClientToWorkspace(workspaceId: string, newClient: ClientRequest) {
	let client: ClientDto = {} as ClientDto;
	http.post(`/workspaces/${workspaceId}/clients`, newClient)
		.then((res) => {
			client = res.data;
		})
		.catch((err) => {
			client = {} as ClientDto;
		});
	return client;
}
