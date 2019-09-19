import http from '../../services/http.service';
import { ClientDto, ClientRequest } from '../interfaces';
import { ApiError } from '../errors';

export async function getClients(workspaceId: string): Promise<ClientDto[]> {
	let clients: ClientDto[] = [];
	await http
		.get(`/workspaces/${workspaceId}/clients`)
		.then((res) => {
			clients = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
			//// clients = [];
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
		.catch((error) => {
			throw new ApiError(error);
			//// client = {} as ClientDto;
		});
	return client;
}
