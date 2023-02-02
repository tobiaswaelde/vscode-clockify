import http from '../../services/http.service';
import { WorkspaceDto, WorkspaceRequest } from '../interfaces';
import { ApiError } from '../errors';

/**
 * Find workspaces for currently logged in user
 */
export async function getWorkspaces(): Promise<WorkspaceDto[]> {
	let query = `/workspaces`;
	let workspaces: WorkspaceDto[] = [];
	await http
		.get(query)
		.then((res) => {
			workspaces = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});
	return workspaces;
}

/**
 * Add a new workspace
 * @param newWorkspace New Workspace
 */
export async function addWorkspace(newWorkspace: WorkspaceRequest): Promise<WorkspaceDto> {
	let query = `/workspaces`;
	let workspace: WorkspaceDto = {} as WorkspaceDto;
	await http
		.post(query, newWorkspace)
		.then((res) => {
			workspace = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});
	return workspace;
}
