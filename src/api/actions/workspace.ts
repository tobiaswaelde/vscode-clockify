import http from '../../services/http.service';
import { WorkspaceDto, WorkspaceRequest } from '../interfaces';

export async function getWorkspaces(): Promise<WorkspaceDto[]> {
	let workspaces: WorkspaceDto[] = [];
	await http
		.get(`/workspaces`)
		.then((res) => {
			workspaces = res.data;
		})
		.catch((err) => {
			workspaces = [];
		});
	return workspaces;
}

export async function addWorkspace(newWorkspace: WorkspaceRequest): Promise<WorkspaceDto> {
	let workspace: WorkspaceDto = {} as WorkspaceDto;
	await http
		.post(`/workspaces`)
		.then((res) => {
			workspace = res.data;
		})
		.catch((err) => {
			workspace = {} as WorkspaceDto;
		});
	return workspace;
}
