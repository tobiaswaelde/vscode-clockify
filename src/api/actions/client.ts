import http from '../../services/http.service';
import { ClientDto, ClientRequest } from '../interfaces';

export async function getClients(workspaceId: string): Promise<ClientDto[]> {
	let clients: ClientDto[] = [];
	await http
		.get(`/workspaces/${workspaceId}/clients`)
		.then((res) => {
			clients = res.data;
		})
		.catch((err) => {
			clients = [];
		});
	return clients;
}

export async function addNewClientToWorkspace(
	workspaceId: string,
	newClient: ClientRequest
): Promise<ClientDto> {
	let client: ClientDto = {} as ClientDto;
	await http
		.post(`/workspaces/${workspaceId}/clients`, newClient)
		.then((res) => {
			client = res.data;
		})
		.catch((err) => {
			client = {} as ClientDto;
		});
	return client;
}
