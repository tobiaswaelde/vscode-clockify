import axios from 'axios';
import * as qs from 'qs';
import {
	Client,
	ClientRequest,
	ProjectImpl,
	ProjectRequest,
	StopTimeEntryRequest,
	Tag,
	TagRequest,
	Task,
	TaskRequest,
	TimeEntry,
	TimeEntryRequest,
	UpdateTimeEntryRequest,
	User,
	Workspace,
	WorkspaceRequest,
} from './types';
import { showError } from './util';

const BASE_URL = 'https://api.clockify.me/api/v1';

export class Clockify {
	private static http = axios.create({
		baseURL: BASE_URL,
	});

	/**
	 * Authenticate using API key
	 * @param {string} apiKey The API key, `undefined` to remove authentication
	 */
	public static authenticate(apiKey: string | undefined) {
		this.http.defaults.headers.common['X-Api-Key'] = apiKey;
	}

	//#region Clients

	/**
	 * Find clients in workspace
	 * @param {string} workspaceId The ID of the workspace
	 * @param {string} name If provided, clients will be filtered by name
	 * @param {number} page Page
	 * @param {number} pageSize Page size
	 * @returns {Array<Client>} The clients in the workspace
	 */
	public static async getClients(
		workspaceId: string,
		name?: string,
		page: number = 1,
		pageSize: number = 50
	): Promise<Client[]> {
		try {
			//eslint-disable-next-line @typescript-eslint/naming-convention
			const q = qs.stringify({ name, page, 'page-size': pageSize }, { encodeValuesOnly: true });

			const res = await this.http.get(`/workspaces/${workspaceId}/clients?${q}`);
			return res.data satisfies Client[];
		} catch (err) {
			showError('Error fetching clients.', err);
			return [];
		}
	}

	/**
	 * Add a new client to a workspace
	 * @param {string} workspaceId The workspace to add the client to
	 * @param {ClientRequest} newClient The data of the client to add
	 * @returns {Client|undefined} The created client
	 */
	public static async addClient(
		workspaceId: string,
		newClient: ClientRequest
	): Promise<Client | undefined> {
		try {
			const res = await this.http.post(`/workspaces/${workspaceId}/clients`, newClient);
			return res.data as Client;
		} catch (err) {
			showError('Error adding client.', err);
			return undefined;
		}
	}

	//#endregion
	//#region Projects

	/**
	 * Find projects in workspace
	 * @param {string} workspaceId The ID of the workspace
	 * @param {string} name If provided, filter projects by name
	 * @param {boolean} archived If provided, filter projects by archived status
	 * @param {number} page Page
	 * @param {number} pageSize Page size
	 * @returns {Array<ProjectImpl>} The projects in the workspace
	 */
	public static async getProjects(
		workspaceId: string,
		name?: string,
		archived?: boolean,
		page: number = 1,
		pageSize: number = 500
	): Promise<ProjectImpl[]> {
		try {
			const q = qs.stringify(
				//eslint-disable-next-line @typescript-eslint/naming-convention
				{ name, archived, page, 'page-size': pageSize },
				{ encodeValuesOnly: true }
			);

			const res = await this.http.get(`/workspaces/${workspaceId}/projects?${q}`);
			return res.data as ProjectImpl[];
		} catch (err) {
			showError('Error fetching projects.', err);
			return [];
		}
	}

	/**
	 * Add a new project to the workspace
	 * @param {string} workspaceId The ID of the workspace
	 * @param {ProjectRequest} newProject The data of the project to add
	 * @returns {ProjectImpl|undefined} The created project
	 */
	public static async addProject(
		workspaceId: string,
		newProject: ProjectRequest
	): Promise<ProjectImpl | undefined> {
		try {
			const res = await this.http.post(`/workspaces/${workspaceId}/projects`, newProject);
			return res.data as ProjectImpl;
		} catch (err) {
			showError('Error adding project.', err);
			return undefined;
		}
	}

	/**
	 * Delete project from workspace
	 * @param {string} workspaceId The ID of the workspace
	 * @param {string} projectId The ID of the project to delete
	 * @returns {ProjectImpl|undefined} The deleted project
	 */
	public static async deleteProject(
		workspaceId: string,
		projectId: string
	): Promise<ProjectImpl | undefined> {
		try {
			const res = await this.http.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
			return res.data as ProjectImpl;
		} catch (err) {
			showError('Error deleting project.', err);
			return undefined;
		}
	}

	//#endregion
	//#region Tags

	/**
	 * Find tags in workspace
	 * @param {string} workspaceId The ID of the workspace
	 * @param {string} name If provided, filter tags by name
	 * @param page Page
	 * @param pageSize Page size
	 * @returns {Array<Tag>} The tags in the workspace
	 */
	public static async getTags(
		workspaceId: string,
		name?: string,
		page: number = 1,
		pageSize: number = 1
	): Promise<Tag[]> {
		try {
			//eslint-disable-next-line @typescript-eslint/naming-convention
			const q = qs.stringify({ name, page, 'page-size': pageSize }, { encodeValuesOnly: true });

			const res = await this.http.get(`/workspaces/${workspaceId}/tags?${q}`);
			return res.data as Tag[];
		} catch (err) {
			showError('Error fetching tags.', err);
			return [];
		}
	}

	/**
	 * Add new tag to workspace
	 * @param {string} workspaceId The ID of the workspace
	 * @param {TagRequest} newTag The data of the new tag
	 * @returns {Tag|undefined} The created tag
	 */
	public static async addTag(workspaceId: string, newTag: TagRequest): Promise<Tag | undefined> {
		try {
			const res = await this.http.post(`/workspaces/${workspaceId}/tags`, newTag);
			return res.data as Tag;
		} catch (err) {
			showError('Error creating tag.', err);
			return undefined;
		}
	}

	//#endregion
	//#region Tasks

	/**
	 * Find tasks on project
	 * @param {string} workspaceId The ID of the workspace
	 * @param {string} projectId The ID of the project
	 * @param {boolean} isActive If `true`, only active tasks will be returned. Otherwise only finished tasks will be returned.
	 * @param {string} name If provided, tasks will be filtered by name.
	 * @param {number} page Page
	 * @param {number} pageSize Page size
	 * @returns The tasks oon the given project
	 */
	public static async getTasks(
		workspaceId: string,
		projectId: string,
		isActive?: boolean,
		name?: string,
		page: number = 1,
		pageSize: number = 50
	): Promise<Task[]> {
		try {
			const q = qs.stringify(
				//eslint-disable-next-line @typescript-eslint/naming-convention
				{ 'is-active': isActive, name, page, 'page-size': pageSize },
				{ encodeValuesOnly: true }
			);

			const res = await this.http.get(
				`/workspaces/${workspaceId}/projects/${projectId}/tasks?${q}`
			);
			return res.data as Task[];
		} catch (err) {
			showError('Error fetching tasks.', err);
			return [];
		}
	}

	/**
	 * Add new task to project
	 * @param {string} workspaceId The ID of the workspace
	 * @param {string} projectId The ID of the project
	 * @param {TaskRequest} newTask The data of the task to add
	 * @returns {Task|undefined} The created task
	 */
	public static async addTask(
		workspaceId: string,
		projectId: string,
		newTask: TaskRequest
	): Promise<Task | undefined> {
		try {
			const res = await this.http.post(
				`/workspaces/${workspaceId}/projects/${projectId}/tasks`,
				newTask
			);
			return res.data as Task;
		} catch (err) {
			showError('Error creating task.', err);
			return undefined;
		}
	}

	//#endregion
	//#region Time Entries

	/**
	 * Add a new time entry to workspace
	 *
	 * If end is not sent in request means that stopwatch mode is active, otherwise time entry is manually added.
	 *
	 * `start` is the only mandatory field in this request.
	 * @param {string} workspaceId The ID of the workspace
	 * @param {TimeEntryRequest} newTimeentry The data of the time entry to create
	 * @returns {TimeEntry|undefined} The created time entry
	 */
	public static async addTimeEntry(
		workspaceId: string,
		newTimeentry: TimeEntryRequest
	): Promise<TimeEntry | undefined> {
		try {
			const res = await this.http.post(`/workspaces/${workspaceId}/time-entries`, newTimeentry);
			return res.data as TimeEntry;
		} catch (err) {
			showError('Error creating time entry.', err);
			return undefined;
		}
	}

	/**
	 * Get time entry in workspace
	 * @param {string} workspaceId The ID of the workspace
	 * @param {string} timeEntryId The ID of the time entry
	 * @param {boolean} considerDurationFormat If provided, returned timeentry's duration will be rounded to minutes or seconds based on duration format (hh:mm or hh:mm:ss) from workspace settings.
	 * @param {boolean} hydrated If provided, returned timeentry's project,task and tags will be returned in full and not just their ids. Note that if you request hydrated entity version, projectId, taskId and tagIds will be changed to project, task and tags in request response.
	 * @returns The time entry
	 */
	public static async getTimeEntry(
		workspaceId: string,
		timeEntryId: string,
		considerDurationFormat: boolean = false,
		hydrated: boolean = false
	): Promise<TimeEntry | undefined> {
		try {
			const q = qs.stringify(
				{
					//eslint-disable-next-line @typescript-eslint/naming-convention
					'consider-duration-format': considerDurationFormat ? '1' : undefined,
					hydrated: hydrated ? '1' : undefined,
				},
				{ encodeValuesOnly: true }
			);

			const res = await this.http.get(
				`/workspaces/${workspaceId}/time-entries/${timeEntryId}?${q}`
			);
			return res.data as TimeEntry;
		} catch (err) {
			showError('Error fetching time entry.', err);
			return undefined;
		}
	}

	/**
	 * Update time entry in workspace
	 * @param {string} workspaceId The ID of the workspace
	 * @param {string} timeEntryId The ID of the time entry
	 * @param {UpdateTimeEntryRequest} newTimeEntry The data of the time entry to update
	 * @returns {TimeEntry|undefined} The updated time entry
	 */
	public static async updateTimeEntry(
		workspaceId: string,
		timeEntryId: string,
		newTimeEntry: UpdateTimeEntryRequest
	): Promise<TimeEntry | undefined> {
		try {
			const res = await this.http.put(
				`/workspaces/${workspaceId}/time-entries/${timeEntryId}`,
				newTimeEntry
			);
			return res.data as TimeEntry;
		} catch (err) {
			showError('Error updating time entry.', err);
			return undefined;
		}
	}

	/**
	 * Find time entries for the given user in the workspace.
	 * @param {string} workspaceId The ID of the workspace
	 * @param {string} userId The ID of the user
	 * @param {string} description If provided, time entries will be filtered by description.
	 * @param {string} start If provided, only time entries that started after the specified datetime will be returned. Datetime must be in ISO-8601 format (eg. "2019-04-16T05:15:32.998Z"). You send time based on your timezone (from Profile Settings), and get results in UTC.
	 * @param {string} end If provided, only time entries that started before the specified datetime will be returned. Datetime must be in ISO-8601 format (eg. 2019-04-16T05:15:32.998Z"). You send time based on your timezone (from Profile Settings), and get results in UTC.
	 * @param {string} project If provided, time entries will be filtered by project.
	 * @param {string} task If provided, time entries will be filtered by task.
	 * @param {Array<string>} tags If provided, time entries will be filtered by tags. This parameter is an array of tag ids.
	 * @param {boolean} projectRequired If `true`, only time entries with project will be returned.
	 * @param {boolean} taskRequired If `true`, only time entries with task will be returned.
	 * @param {boolean} considerDurationFormat If `true`, returned timeentry's duration will be rounded to minutes or seconds based on duration format (hh:mm or hh:mm:ss) from workspace settings.
	 * @param {boolean} hydrated If `true`, returned timeentry's project,task and tags will be returned in full and not just their ids. Note that if you request hydrated entity version, projectId, taskId and tagIds will be changed to project, task and tags in request response.
	 * @param {boolean} inProgress If `true`, all other filters will be ignored and, if present, currently running time entry will be returned.
	 * @param page Page
	 * @param pageSize Page size
	 * @returns
	 */
	public static async getTimeEntriesForUser(
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
	): Promise<TimeEntry[]> {
		try {
			const q = qs.stringify(
				{
					description,
					start,
					end,
					project,
					task,
					tags,
					//eslint-disable-next-line @typescript-eslint/naming-convention
					'project-required': projectRequired ? '1' : undefined,
					//eslint-disable-next-line @typescript-eslint/naming-convention
					'task-required': taskRequired ? '1' : undefined,
					//eslint-disable-next-line @typescript-eslint/naming-convention
					'consider-duration-format': considerDurationFormat ? '1' : undefined,
					hydrated: hydrated ? '1' : undefined,
					//eslint-disable-next-line @typescript-eslint/naming-convention
					'in-progress': inProgress ? '1' : undefined,
					page,
					//eslint-disable-next-line @typescript-eslint/naming-convention
					'page-size': pageSize,
				},
				{ encodeValuesOnly: true }
			);

			const res = await this.http.get(
				`/workspaces/${workspaceId}/user/${userId}/time-entries?${q}`
			);
			return res.data as TimeEntry[];
		} catch (err) {
			showError('Error fetching time entries for user.', err);
			return [];
		}
	}

	/**
	 * Add a new time entry for another user in workspace.
	 *
	 * Adding time for others is a premium feature. This API endpoint works only for workspaces with active Premium subscription.
	 *
	 * If you leave out end time, you'll start a timer for that person.
	 * @param {string} workspaceId The ID of the workspace
	 * @param {string} userId The ID of the user
	 * @param {TimeEntryRequest} newTimeEntry The data of the new time entry
	 * @returns {TimeEntry|undefined} The created time entry
	 */
	public static async addTimeEntryForUser(
		workspaceId: string,
		userId: string,
		timeEntry: TimeEntryRequest
	): Promise<TimeEntry | undefined> {
		try {
			const res = await this.http.post(
				`/workspaces/${workspaceId}/user/${userId}/time-entries`,
				timeEntry
			);
			return res.data as TimeEntry;
		} catch (err) {
			showError('Error creating time entry for user', err);
			return undefined;
		}
	}

	/**
	 * Stops currently running time entry in workspace.
	 *
	 * Admins can stop someone else's running timers on Premium workspaces (Add time for others feature).
	 *
	 * If workspace has a required field enabled (eg. the Timesheet is enabled and project is a required field as a result), you won't be able to stop the timer until you fill in the required field(s). You'll simply get "Entity not created" message.
	 * @param {string} workspaceId The ID of the workspace
	 * @param {string} userId The ID of the user
	 * @param {StopTimeEntryRequest} newTimeEntry The data of the time entry
	 */
	public static async stopTimeEntryForUser(
		workspaceId: string,
		userId: string,
		newTimeEntry: StopTimeEntryRequest
	): Promise<TimeEntry | undefined> {
		try {
			const res = await this.http.patch(`/workspaces/${workspaceId}/user/${userId}/time-entries`);
			return res.data as TimeEntry;
		} catch (err) {
			showError('Error stopping time entry');
			return undefined;
		}
	}

	//#endregion
	//#region Time Sheet Templates

	//#endregion
	//#region User

	/**
	 * Get currently signed in user
	 * @returns {User|undefined} The currently signed in user
	 */
	public static async getCurrentUser(): Promise<User | undefined> {
		try {
			const res = await this.http.get('/user');
			return res.data as User;
		} catch (err) {
			showError('Error fetching current user.', err);
			return undefined;
		}
	}

	/**
	 * Find users in workspace
	 * @param {string} workspaceId The ID of the workspace
	 * @returns {Array<User>} The users in the given workspace
	 */
	public static async getWorkspaceUsers(workspaceId: string): Promise<User[]> {
		try {
			const res = await this.http.get(`/workspaces/${workspaceId}/users`);
			return res.data as User[];
		} catch (err) {
			showError('Error fetching workspace users.', err);
			return [];
		}
	}

	//#endregion
	//#region Workspaces

	/**
	 * Find all workspaces
	 * @returns {Array<Workspace>} The workspace
	 */
	public static async getWorkspaces(): Promise<Workspace[]> {
		try {
			const res = await this.http.get('/workspaces');
			return res.data as Workspace[];
		} catch (err) {
			showError('Error fetching workspaces.', err);
			return [];
		}
	}

	/**
	 * Crete new workspace
	 * @param {WorkspaceRequest} newWorkspace The data of the workspace to create
	 * @returns {Workspace|undefined} The created workspace
	 */
	public static async addWorkspace(newWorkspace: WorkspaceRequest): Promise<Workspace | undefined> {
		try {
			const res = await this.http.post('/workspaces', newWorkspace);
			return res.data as Workspace;
		} catch (err) {
			showError('Error creating workspace.', err);
			return undefined;
		}
	}

	//#endregion
}
