import http from '../services/http.service';
import { Tag } from '../interfaces/Tag';

export async function getProjects(workspaceId: string) {
	return http
		.get(`/workspaces/${workspaceId}/projects`)
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			console.error(err);
			return [];
		});
}

export async function getTags(workspaceId: string) {
	return http
		.get(`/workspaces/${workspaceId}/tags`)
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			console.error(err);
			return [];
		});
}
export function addTag(workspaceId: string, tag: Tag): object | null {
	return http
		.post(`/workspaces/${workspaceId}/tags`, tag)
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			console.error(err);
			return null;
		});
}

export async function getTasks(workspaceId: string, projectId: string) {
	return http
		.get(`/workspaces/${workspaceId}/projects/${projectId}/tasks`)
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			console.error(err);
			return null;
		});
}

export async function addTimeEntry(workspaceId: string, timeEntry: object) {
	return http
		.post(`/workspaces/${workspaceId}/time-entries`, timeEntry)
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			console.error(err);
			return null;
		});
}
