import http from '../../services/http.service';
import { TagDto, TagRequest } from '../interfaces';
import { ApiError } from '../errors';

export async function getTags(workspaceId: string): Promise<TagDto[]> {
	let tags: TagDto[] = [];
	await http
		.get(`/workspaces/${workspaceId}/tags`)
		.then((res) => {
			tags = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
			//// tags = [];
		});
	return tags;
}

export async function addTag(workspaceId: string, newTag: TagRequest): Promise<TagDto> {
	let tag = {} as TagDto;
	await http
		.post(`/workspaces/${workspaceId}/tags`, newTag)
		.then((res) => {
			tag = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
			//// tag = {} as TagDto;
		});
	return tag;
}
