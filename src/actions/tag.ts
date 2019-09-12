import http from '../services/http.service';
import { TagDto, TagRequest } from '../interfaces/interfaces';

export function getTags(workspaceId: string): TagDto[] {
	let tags: TagDto[] = [];
	http.get(`/workspaces/${workspaceId}/tags`)
		.then((res) => {
			tags = res.data;
		})
		.catch((err) => {
			tags = [];
		});
	return tags;
}

export function addTag(workspaceId: string, newTag: TagRequest): TagDto {
	let tag = {} as TagDto;
	http.post(`/workspaces/${workspaceId}/tags`, newTag)
		.then((res) => {
			tag = res.data;
		})
		.catch((err) => {
			tag = {} as TagDto;
		});
	return tag;
}
