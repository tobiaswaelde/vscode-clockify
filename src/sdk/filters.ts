type Pagination = {
	/** The page */
	page?: number;

	/** The page size, maximum is `5000` */
	pageSize?: number;
};

/**
 * The filter for fetching clients.
 */
export type GetClientsFilter = Pagination & {
	/** The name of the client */
	name?: string;
};

/**
 * The filter for fetching projects.
 */
export type GetProjectsFilter = Pagination & {
	/** The name of the project */
	name?: string;

	/** The archived status of the project */
	archived?: boolean;

	/** The clients of the project */
	clientId?: string;
};

/**
 * The filter for fetching tags.
 */
export type GetTagsFilter = Pagination & {
	/** The name of the tag */
	name?: string;

	/** if `true`, only return archived tags */
	archived?: boolean;
};

/**
 * The filter for fetching tasks.
 */
export type GetTasksFilter = Pagination & {
	/** The active state of the task */
	isActive?: boolean;

	/** The name of the task */
	name?: string;
};

/**
 * The filter for fetching a single time entry.
 */
export type GetTimeEntryFilter = {
	/** If provided, returned timeentry's duration will be rounded to minutes or seconds based on duration format (hh:mm or hh:mm:ss) from workspace settings. */
	considerDurationFormat?: boolean;

	/** If provided, returned timeentry's project,task and tags will be returned in full and not just their ids. Note that if you request hydrated entity version, projectId, taskId and tagIds will be changed to project, task and tags in request response. */
	hydrated?: boolean;
};

/**
 * The filter for fetching time entries for a user.
 */
export type GetTimeEntriesForUserFilter = Pagination & {
	/** If provided, time entries will be filtered by description. */
	description?: string;

	/** If provided, only time entries that started after the specified datetime will be returned. Datetime must be in ISO-8601 format (eg. "2019-04-16T05:15:32.998Z"). You send time based on your timezone (from Profile Settings), and get results in UTC. */
	start?: string;

	/** If provided, only time entries that started before the specified datetime will be returned. Datetime must be in ISO-8601 format (eg. 2019-04-16T05:15:32.998Z"). You send time based on your timezone (from Profile Settings), and get results in UTC. */
	end?: string;

	/** If provided, time entries will be filtered by project. */
	project?: string;

	/** If provided, time entries will be filtered by task. */
	task?: string;

	/** If provided, time entries will be filtered by tags. This parameter is an array of tag ids. */
	tags?: string[];

	/** If `true`, only time entries with project will be returned. */
	projectRequired?: boolean;

	/** If `true`, only time entries with task will be returned. */
	taskRequired?: boolean;

	/** If `true`, returned timeentry's duration will be rounded to minutes or seconds based on duration format (hh:mm or hh:mm:ss) from workspace settings. */
	considerDurationFormat?: boolean;

	/** If `true`, returned timeentry's project,task and tags will be returned in full and not just their ids. Note that if you request hydrated entity version, projectId, taskId and tagIds will be changed to project, task and tags in request response. */
	hydrated?: boolean;

	/** If `true`, all other filters will be ignored and, if present, currently running time entry will be returned. */
	inProgress?: boolean;
};
