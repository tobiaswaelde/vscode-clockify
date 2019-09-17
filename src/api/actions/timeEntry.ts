import http from '../../services/http.service';
import {
	TimeEntryRequest,
	TimeIntervalDto,
	TimeEntryDtoImpl,
	UpdateTimeEntryRequest,
	StopTimeEntryRequest
} from '../interfaces';

export async function addTimeentry(
	workspaceId: string,
	newTimeentry: TimeEntryRequest
): Promise<TimeEntryDtoImpl> {
	let timeentry: TimeEntryDtoImpl = {} as TimeEntryDtoImpl;
	await http
		.post(`/workspaces/${workspaceId}/time-entries`, newTimeentry)
		.then((res) => {
			timeentry = res.data;
		})
		.catch((err) => {
			timeentry = {} as TimeEntryDtoImpl;
		});
	return timeentry;
}

export async function getTimeentry(
	workspaceId: string,
	timeentryId: string
): Promise<TimeEntryDtoImpl> {
	let timeentry: TimeEntryDtoImpl = {} as TimeEntryDtoImpl;
	await http
		.get(`/workspaces/${workspaceId}/time-entries/${timeentryId}`)
		.then((res) => {
			timeentry = res.data;
		})
		.catch((err) => {
			timeentry = {} as TimeEntryDtoImpl;
		});
	return timeentry;
}

export async function updateTimeentry(
	workspaceId: string,
	timeentryId: string,
	newTimeentry: UpdateTimeEntryRequest
): Promise<TimeEntryDtoImpl> {
	let timeentry: TimeEntryDtoImpl = {} as TimeEntryDtoImpl;
	await http
		.put(`/workspaces/${workspaceId}/time-entries/${timeentryId}`, newTimeentry)
		.then((res) => {
			timeentry = res.data;
		})
		.catch((err) => {
			timeentry = {} as TimeEntryDtoImpl;
		});
	return timeentry;
}

export async function deleteTimeentry(workspaceId: string, timeentryId: string): Promise<void> {
	await http.delete(`/workspaces/${workspaceId}/time-entries/${timeentryId}`);
}

/**
 * Gets a time entry for specified user on workspace.
 * @param workspaceId Workspace ID
 * @param userId User ID
 * @param description If provided, time entries will be filtered by description.
 * @param start If provided, only time entries that started after the specified datetime will be returned. Datetime must be in ISO-8601 format (eg. "2019-04-16T05:15:32.998Z"). You send time based on your timezone (from Profile Settings), and get results in UTC.
 * @param end If provided, only time entries that started before the specified datetime will be returned. Datetime must be in ISO-8601 format (eg. 2019-04-16T05:15:32.998Z"). You send time based on your timezone (from Profile Settings), and get results in UTC.
 * @param project If provided, time entries will be filtered by project.
 * @param task If provided, time entries will be filtered by task.
 * @param tags If provided, time entries will be filtered by tags. This parameter is an array of tag ids.
 * @param projectRequired If true, only time entries with project will be returned.
 * @param taskRequired If true, only time entries with task will be returned.
 * @param considerDurationFormat If true, returned timeentry's duration will be rounded to minutes or seconds based on duration format (hh:mm or hh:mm:ss) from workspace settings.
 * @param hydrated If true, returned timeentry's project,task and tags will be returned in full and not just their ids. Note that if you request hydrated entity version, projectId, taskId and tagIds will be changed to project, task and tags in request response.
 * @param inProgress If true, all other filters will be ignored and, if present, currently running time entry will be returned.
 * @param page page
 * @param pageSize page-size
 */
export async function getTimeentriesForUser(
	workspaceId: string,
	userId: string,
	description?: string,
	start?: string,
	end?: string,
	project?: string,
	task?: string,
	tags?: string[],
	projectRequired: boolean = false,
	taskRequired: boolean = false,
	considerDurationFormat: boolean = false,
	hydrated: boolean = false,
	inProgress: boolean = false,
	page: number = 1,
	pageSize: number = 50
): Promise<TimeEntryDtoImpl[]> {
	let query = `/workspaces/${workspaceId}/user/${userId}/time-entries`;
	let queryParamsSet = false;
	//#region QUERY PARAMETERS
	if (description) {
		query += `${queryParamsSet ? '&' : '?'}description=${description}`;
		queryParamsSet = true;
	}
	if (start) {
		query += `${queryParamsSet ? '&' : '?'}start=${start}`;
		queryParamsSet = true;
	}
	if (end) {
		query += `${queryParamsSet ? '&' : '?'}end=${end}`;
		queryParamsSet = true;
	}
	if (project) {
		query += `${queryParamsSet ? '&' : '?'}project=${project}`;
		queryParamsSet = true;
	}
	if (task) {
		query += `${queryParamsSet ? '&' : '?'}task=${task}`;
		queryParamsSet = true;
	}
	if (tags) {
		tags.forEach((tag) => {
			query += `${queryParamsSet ? '&' : '?'}tags=${tag}`;
			queryParamsSet = true;
		});
	}
	if (projectRequired) {
		query += `${queryParamsSet ? '&' : '?'}project-required=1`;
		queryParamsSet = true;
	}
	if (taskRequired) {
		query += `${queryParamsSet ? '&' : '?'}task-required=1`;
		queryParamsSet = true;
	}
	if (considerDurationFormat) {
		query += `${queryParamsSet ? '&' : '?'}consider-duration-format=1`;
		queryParamsSet = true;
	}
	if (hydrated) {
		query += `${queryParamsSet ? '&' : '?'}hydrated=1`;
		queryParamsSet = true;
	}
	if (inProgress) {
		query += `${queryParamsSet ? '&' : '?'}on-progress=1`;
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

	let timeentries: TimeEntryDtoImpl[] = [];
	await http
		.get(query)
		.then((res) => {
			timeentries = res.data;
		})
		.catch((err) => {
			timeentries = [];
		});
	return timeentries;
}

export async function addTimeentryForUser(
	workspaceId: string,
	userId: string,
	newTimeentry: TimeEntryRequest
): Promise<TimeEntryDtoImpl> {
	let timeentry: TimeEntryDtoImpl = {} as TimeEntryDtoImpl;
	await http
		.post(`/workspaces/${workspaceId}/user/${userId}/time-entries`, newTimeentry)
		.then((res) => {
			timeentry = res.data;
		})
		.catch((err) => {
			timeentry = {} as TimeEntryDtoImpl;
		});
	return timeentry;
}

export async function stopTimeentry(
	workspaceId: string,
	userId: string,
	newTimeentry: StopTimeEntryRequest
): Promise<TimeEntryDtoImpl> {
	let timeentry: TimeEntryDtoImpl = {} as TimeEntryDtoImpl;
	await http
		.patch(`/workspaces/${workspaceId}/user/${userId}/time-entries`, newTimeentry)
		.then((res) => {
			timeentry = res.data;
		})
		.catch((err) => {
			timeentry = {} as TimeEntryDtoImpl;
		});
	return timeentry;
}
