import http from '../services/http.service';
import {
	TimeEntryRequest,
	TimeIntervalDto,
	TimeEntryDtoImpl,
	UpdateTimeEntryRequest,
	StopTimeEntryRequest
} from '../interfaces/interfaces';

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

export async function getTimeentriesForUser(
	workspaceId: string,
	userId: string
): Promise<TimeEntryDtoImpl[]> {
	let timeentries: TimeEntryDtoImpl[] = [];
	await http
		.get(`/workspaces/${workspaceId}/user/${userId}/time-entries`)
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

export async function stopTimeentr(
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
