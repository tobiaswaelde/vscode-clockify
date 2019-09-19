import http from '../../services/http.service';
import { ProjectDtoImpl, ProjectRequest } from '../interfaces';
import { ApiError } from '../errors';

/**
 * Find projects on workspace
 * @param workspaceId Workspace ID
 * @param name If provided, projects will be filtered by name
 * @param page page
 * @param pageSize page-size
 */
export async function getProjects(
	workspaceId: string,
	name?: string,
	page: number = 1,
	pageSize: number = 50
): Promise<ProjectDtoImpl[]> {
	let query = `/workspaces/${workspaceId}/projects`;
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

	let projects: ProjectDtoImpl[] = [];
	await http
		.get(query)
		.then((res) => {
			projects = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});
	return projects;
}

/**
 * Add a new project to workspace
 * @param workspaceId Workspace ID
 * @param newProject New Project
 */
export async function addProject(
	workspaceId: string,
	newProject: ProjectRequest
): Promise<ProjectDtoImpl> {
	let query = `/workspaces/${workspaceId}/projects`;
	let project: ProjectDtoImpl = {} as ProjectDtoImpl;
	await http
		.post(query, newProject)
		.then((res) => {
			project = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});
	return project;
}

/**
 * Delete project from workspace
 * @param workspaceId Workspace ID
 * @param projectId Project ID
 */
export async function deleteProject(
	workspaceId: string,
	projectId: string
): Promise<ProjectDtoImpl> {
	let query = `/workspaces/${workspaceId}/projects/${projectId}`;
	let project = {} as ProjectDtoImpl;
	await http
		.delete(query)
		.then((res) => {
			project = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});
	return project;
}
