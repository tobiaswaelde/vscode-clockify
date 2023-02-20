import { HourlyRate } from './hourly-rate';
import { ProjectId, ProjectSummary } from './project';
import { Tag, TagId } from './tag';
import { Task, TaskId } from './task';
import { UserSummary } from './user';

export type TimeEntriesDurationRequest = {
	start: string;
	end: string;
};

export type TimeEntry = {
	billable: boolean;
	isLocked: boolean;
	projectId: ProjectId;
	tagIds: TagId[];
	taskId: TaskId;
	timeInterval: TimeInterval;
};

export type TimeEntryBulkEditRequest = {
	timeEntries: TimeEntryRequest[];
	timeEntryIds: string[];
	timeEntryList: TimeEntry[];
	changeFields: string[];
};

export type TimeEntryImpl = {
	billable: boolean;
	description: string;
	id: string;
	isLocked: boolean;
	projectId: string | null;
	tagIds: string[] | null;
	taskId: string | null;
	timeInterval: TimeInterval;
	userId: string;
	workspaceId: string;
};

export type TimeEntryIdsRequest = {
	timeEntryIds: string[];
};

export type TimeEntryRequest = {
	id?: string;
	start: string;
	billable?: boolean;
	description?: string;
	projectId?: string;
	userId?: string;
	taskId?: string;
	end?: string;
	tagIds?: string[];
	timeInterval?: TimeEntriesDurationRequest;
	workspaceId?: string;
	isLocked?: boolean;
};

export type TimeEntrySummary = {
	billable: boolean;
	clientId: string;
	clientName: string;
	description: string;
	hourlyRate: HourlyRate;
	id: string;
	isLocked: boolean;
	project: ProjectSummary;
	tags: Tag[];
	task: Task;
	timeInterval: TimeInterval;
	totalBillable: number;
	user: UserSummary;
};

export type TimeInterval = {
	duration: string;
	end: string | null;
	start: string;
};

export type UpdateTimeEntryRequest = {
	start?: string;
	billable?: boolean;
	description?: string;
	projectId?: string | null;
	taskId?: string | null;
	end?: string;
	tagIds?: string[];
};

export type StopTimeEntryRequest = {
	end: string;
};
