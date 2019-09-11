import http from '../services/http.service';

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
