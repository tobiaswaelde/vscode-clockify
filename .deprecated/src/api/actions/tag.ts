import http from '../../services/http.service';
import { TagDto, TagRequest } from '../interfaces';
import { ApiError } from '../errors';

/**
 * Find tags on workspace
 * @param workspaceId Workspace ID
 * @param name If provided, tags will be filtered by name
 * @param page page
 * @param pageSize page-size
 */
export async function getTags(
	workspaceId: string,
	name?: string,
	page: number = 1,
	pageSize: number = 50
): Promise<TagDto[]> {
	let query = `/workspaces/${workspaceId}/tags`;
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

	let tags: TagDto[] = [];
	await http
		.get(query)
		.then((res) => {
			tags = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});
	return tags;
}

/**
 * Add a new tag to workspace
 * @param workspaceId Workspace ID
 * @param newTag New Tag
 */
export async function addTag(workspaceId: string, newTag: TagRequest): Promise<TagDto> {
	let query = `/workspaces/${workspaceId}/tags`;
	let tag = {} as TagDto;
	await http
		.post(query, newTag)
		.then((res) => {
			tag = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});
	return tag;
}
