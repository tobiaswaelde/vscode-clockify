import http from '../services/http.service';
import { ProjectDtoImpl, ProjectRequest } from '../interfaces/interfaces';

export function getProjects(workspaceId: string): ProjectDtoImpl[] {
	let projects: ProjectDtoImpl[] = [];
	http.get(`/workspaces/${workspaceId}/projects`)
		.then((res) => {
			projects = res.data;
		})
		.catch((err) => {
			projects = [];
		});
	return projects;
}

export function addProject(workspaceId: string, newProject: ProjectRequest): ProjectDtoImpl {
	let project: ProjectDtoImpl = {} as ProjectDtoImpl;
	http.post(`/workspaces/${workspaceId}/projects`, newProject)
		.then((res) => {
			project = res.data;
		})
		.catch((err) => {
			project = {} as ProjectDtoImpl;
		});
	return project;
}

export function deleteProject(workspaceId: string, projectId: string): ProjectDtoImpl {
	let project = {} as ProjectDtoImpl;
	http.delete(`/workspaces/${workspaceId}/projects/${projectId}`)
		.then((res) => {
			project = res.data;
		})
		.catch((err) => {
			project = {} as ProjectDtoImpl;
		});
	return project;
}
