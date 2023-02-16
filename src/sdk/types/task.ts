export type TaskStatus = 'ACTIVE' | 'DONE';

export type Task = {
	assigneeId: string;
	estimate: string;
	id: string;
	name: string;
	projectId: string;
	status: TaskStatus;
};

export type TaskId = {
	id: string;
};

export type TaskRequest = {
	id?: string;
	name: string;
	assigneeId?: string;
	estimate?: string;
	status?: string;
};
