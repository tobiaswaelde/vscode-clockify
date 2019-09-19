import http from '../../services/http.service';
import { WorkspaceDto, WorkspaceRequest } from '../interfaces';
import { ApiError } from '../errors';

export async function getWorkspaces(): Promise<WorkspaceDto[]> {
	let workspaces: WorkspaceDto[] = [];
	await http
		.get(`/workspaces`)
		.then((res) => {
			workspaces = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
			//// workspaces = [];
		});
	return workspaces;
}

export async function addWorkspace(newWorkspace: WorkspaceRequest): Promise<WorkspaceDto> {
	let workspace: WorkspaceDto = {} as WorkspaceDto;
	await http
		.post(`/workspaces`, newWorkspace)
		.then((res) => {
			workspace = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
			//// workspace = {} as WorkspaceDto;
		});
	return workspace;
}
