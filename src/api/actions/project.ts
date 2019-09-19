import http from '../../services/http.service';
import { ProjectDtoImpl, ProjectRequest } from '../interfaces';
import { ApiError } from '../errors';

export async function getProjects(workspaceId: string): Promise<ProjectDtoImpl[]> {
	let projects: ProjectDtoImpl[] = [];
	await http
		.get(`/workspaces/${workspaceId}/projects`)
		.then((res) => {
			projects = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
			//// projects = [];
		});
	return projects;
}

export async function addProject(
	workspaceId: string,
	newProject: ProjectRequest
): Promise<ProjectDtoImpl> {
	let project: ProjectDtoImpl = {} as ProjectDtoImpl;
	await http
		.post(`/workspaces/${workspaceId}/projects`, newProject)
		.then((res) => {
			project = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
			//// console.error(err);
			//// project = {} as ProjectDtoImpl;
		});
	return project;
}

export async function deleteProject(
	workspaceId: string,
	projectId: string
): Promise<ProjectDtoImpl> {
	let project = {} as ProjectDtoImpl;
	await http
		.delete(`/workspaces/${workspaceId}/projects/${projectId}`)
		.then((res) => {
			project = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
			//// project = {} as ProjectDtoImpl;
		});
	return project;
}
