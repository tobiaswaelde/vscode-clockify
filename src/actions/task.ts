import http from '../services/http.service';
import { TaskDto, TaskRequest } from '../interfaces/interfaces';

export function getTasks(workspaceId: string, projectId: string): TaskDto[] {
	let tasks: TaskDto[] = [];
	http.get(`/workspaces/${workspaceId}/projects/${projectId}/tasks`)
		.then((res) => {
			tasks = res.data;
		})
		.catch((err) => {
			tasks = [];
		});
	return tasks;
}

export function addTask(workspaceId: string, projectId: string, newTask: TaskRequest): TaskDto {
	let task = {} as TaskDto;
	http.post(`/workspaces/${workspaceId}/projects/${projectId}/tasks`)
		.then((res) => {
			task = res.data;
		})
		.catch((err) => {
			task = {} as TaskDto;
		});
	return task;
}
