import http from '../../services/http.service';
import { TaskDto, TaskRequest } from '../interfaces';
import { ApiError } from '../errors';

/**
 * Find tasks on project
 * @param workspaceId Workspace ID
 * @param projectId Project ID
 * @param isActive If provided and true, only active tasks will be returned. Otherwise only finished tasks will be returned.
 * @param name If provided, tasks will be filtered by name.
 * @param page page
 * @param pageSize page-size
 */
export async function getTasks(
	workspaceId: string,
	projectId: string,
	isActive?: boolean,
	name?: string,
	page: number = 1,
	pageSize: number = 50
): Promise<TaskDto[]> {
	let query = `/workspaces/${workspaceId}/projects/${projectId}/tasks`;
	let queryParamsSet = false;
	//#region QUERY PARAMETERS
	if (isActive) {
		query += `${queryParamsSet ? '&' : '?'}is-active=${isActive}`;
		queryParamsSet = true;
	}
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

	let tasks: TaskDto[] = [];
	await http
		.get(query)
		.then((res) => {
			tasks = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});
	return tasks;
}

/**
 * Add a new task on project
 * @param workspaceId Workspace ID
 * @param projectId Project ID
 * @param newTask New Task
 */
export async function addTask(
	workspaceId: string,
	projectId: string,
	newTask: TaskRequest
): Promise<TaskDto> {
	let query = `/workspaces/${workspaceId}/projects/${projectId}/tasks`;
	let task = {} as TaskDto;
	await http
		.post(query, newTask)
		.then((res) => {
			task = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});
	return task;
}
