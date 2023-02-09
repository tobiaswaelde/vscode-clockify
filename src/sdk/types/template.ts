import { ProjectTaskTuple, ProjectTaskTupleRequest } from './project';

export type Template = {
	id: string;
	name: string;
	projectsAndTasks: ProjectTaskTuple[];
	userId: string;
	workspaceId: string;
};

export type TemplatePatchRequest = {
	name: string;
};

export type TemplateRequest = {
	name: string;
	projectsAndTasks: ProjectTaskTupleRequest[];
};
