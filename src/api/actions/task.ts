import http from '../../services/http.service';
import { TaskDto, TaskRequest } from '../interfaces';
import { ApiError } from '../errors';

export async function getTasks(workspaceId: string, projectId: string): Promise<TaskDto[]> {
	let tasks: TaskDto[] = [];
	await http
		.get(`/workspaces/${workspaceId}/projects/${projectId}/tasks`)
		.then((res) => {
			tasks = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
			//// tasks = [];
		});
	return tasks;
}

export async function addTask(
	workspaceId: string,
	projectId: string,
	newTask: TaskRequest
): Promise<TaskDto> {
	let task = {} as TaskDto;
	await http
		.post(`/workspaces/${workspaceId}/projects/${projectId}/tasks`, newTask)
		.then((res) => {
			task = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
			//// task = {} as TaskDto;
		});
	return task;
}
