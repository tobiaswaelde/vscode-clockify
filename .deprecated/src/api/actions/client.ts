import http from '../../services/http.service';
import { ClientDto, ClientRequest } from '../interfaces';
import { ApiError } from '../errors';

/**
 * Find clients on workspace
 * @param workspaceId Workspace ID
 * @param name If provided, clients will be filtered by name
 * @param page page
 * @param pageSize page-size
 */
export async function getClients(
	workspaceId: string,
	name?: string,
	page: number = 1,
	pageSize: number = 50
): Promise<ClientDto[]> {
	let query = `/workspaces/${workspaceId}/clients`;
	let queryParamsSet = false;
	//#region QUERY PARAMETERS
	if (name) {
		query += `${queryParamsSet ? '&' : '?'}name=${name}`;
		queryParamsSet = true;
	}
	if (page) {
		query += `${queryParamsSet ? '&' : '?'}page=${page}`;
		queryParamsSet = true;
	}
	if (pageSize) {
		query += `${queryParamsSet ? '&' : '?'}page-size=${pageSize}`;
		queryParamsSet = true;
	}
	//#endregion

	let clients: ClientDto[] = [];
	await http
		.get(query)
		.then((res) => {
			clients = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});
	return clients;
}

/**
 * Add a new client to workspace
 * @param workspaceId Workspace ID
 * @param newClient New Client
 */
export async function addNewClientToWorkspace(
	workspaceId: string,
	newClient: ClientRequest
): Promise<ClientDto> {
	let query = `/workspaces/${workspaceId}/clients`;
	let client: ClientDto = {} as ClientDto;
	await http
		.post(query, newClient)
		.then((res) => {
			client = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});
	return client;
}
