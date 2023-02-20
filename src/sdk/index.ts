import axios from 'axios';
import * as qs from 'qs';
import {
	GetClientsFilter,
	GetProjectsFilter,
	GetTagsFilter,
	GetTasksFilter,
	GetTimeEntriesForUserFilter,
	GetTimeEntryFilter,
} from './filters';
import { Client, ClientRequest } from './types/client';
import { Project, ProjectRequest } from './types/project';
import { Tag, TagRequest } from './types/tag';
import { Task, TaskRequest } from './types/task';
import {
	TimeEntry,
	TimeEntryRequest,
	StopTimeEntryRequest,
	UpdateTimeEntryRequest,
	TimeEntryImpl,
} from './types/time-entry';
import { User } from './types/user';
import { Workspace, WorkspaceRequest } from './types/workspace';
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
	 * @param {GetClientsFilter} filter The filter
	 * @returns {Array<Client>} The clients in the workspace
	 */
	public static async getClients(
		workspaceId: string,
		filter?: GetClientsFilter
	): Promise<Client[]> {
		try {
			const q = qs.stringify(
				//eslint-disable-next-line @typescript-eslint/naming-convention
				{ name: filter?.name, page: filter?.page, 'page-size': filter?.pageSize },
				{ encodeValuesOnly: true }
			);

			const res = await this.http.get(`/workspaces/${workspaceId}/clients?${q}`);
			const clients = res.data as Client[];
			clients.sort((a, b) => a.name.localeCompare(b.name));
			return clients;
		} catch (err) {
			showError('Error fetching clients.', err);
			return [];
		}
	}

	/**
	 * Add a new client to a workspace
	 * @param {string} workspaceId The ID of the workspace to add the client to
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

	/**
	 * Update client in workspace
	 * @param {string} workspaceId The ID of the workspace the client belongs to
	 * @param {string} clientId The ID of the client to update
	 * @param {ClientRequest} data The data to update
	 * @returns {Client} The updated client or `undefined`
	 */
	public static async updateClient(
		workspaceId: string,
		clientId: string,
		data: ClientRequest
	): Promise<Client | undefined> {
		try {
			const res = await this.http.put(`/workspaces/${workspaceId}/clients/${clientId}`, data);
			return res.data as Client;
		} catch (err) {
			showError('Error updating client.', err);
			return undefined;
		}
	}

	/**
	 * Delete client from workspace
	 * @param {string} workspaceId The ID of the workspace to delete the client from
	 * @param {string} clientId The ID of the client to delete
	 * @returns {Client} The deleted client or `undefined`
	 */
	public static async deleteClient(
		workspaceId: string,
		clientId: string
	): Promise<Client | undefined> {
		try {
			const res = await this.http.delete(`/workspaces/${workspaceId}/clients/${clientId}`);
			return res.data as Client;
		} catch (err) {
			showError('Error deleting client.', err);
			return undefined;
		}
	}

	//#endregion
	//#region Projects

	/**
	 * Find projects in workspace
	 * @param {string} workspaceId The ID of the workspace
	 * @param {GetProjectsFilter} filter The filter
	 * @returns {Array<Project>} The projects in the workspace
	 */
	public static async getProjects(
		workspaceId: string,
		filter?: GetProjectsFilter
	): Promise<Project[]> {
		try {
			const q = qs.stringify(
				{
					name: filter?.name,
					archived: filter?.archived,
					page: filter?.page,
					//eslint-disable-next-line @typescript-eslint/naming-convention
					'page-size': filter?.pageSize,
				},
				{ encodeValuesOnly: true }
			);

			const res = await this.http.get(`/workspaces/${workspaceId}/projects?${q}`);
			return res.data as Project[];
		} catch (err) {
			showError('Error fetching projects.', err);
			return [];
		}
	}

	/**
	 * Find project by ID
	 * @param {string} workspaceId The ID of the workspace
	 * @param {string} projectId The ID of the project
	 * @returns {Porject} The project or undefined
	 */
	public static async getProject(
		workspaceId: string,
		projectId: string
	): Promise<Project | undefined> {
		try {
			const res = await this.http.get(`/workspaces/${workspaceId}/projects/${projectId}`);
			return res.data as Project;
		} catch (err) {
			showError(`Error fetchin project with ID '${projectId}'.`, err);
			return undefined;
		}
	}

	/**
	 * Add a new project to the workspace
	 * @param {string} workspaceId The ID of the workspace
	 * @param {ProjectRequest} newProject The data of the project to add
	 * @returns {Project|undefined} The created project
	 */
	public static async addProject(
		workspaceId: string,
		newProject: ProjectRequest
	): Promise<Project | undefined> {
		try {
			const res = await this.http.post(`/workspaces/${workspaceId}/projects`, newProject);
			return res.data as Project;
		} catch (err) {
			showError('Error adding project.', err);
			return undefined;
		}
	}

	/**
	 * Delete project from workspace
	 * @param {string} workspaceId The ID of the workspace
	 * @param {string} projectId The ID of the project to delete
	 * @returns {Project|undefined} The deleted project
	 */
	public static async deleteProject(
		workspaceId: string,
		projectId: string
	): Promise<Project | undefined> {
		try {
			const res = await this.http.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
			return res.data as Project;
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
	 * @param {GetTagsFilter} filter The filter
	 * @returns {Array<Tag>} The tags in the workspace
	 */
	public static async getTags(workspaceId: string, filter: GetTagsFilter): Promise<Tag[]> {
		const { name, page, pageSize } = filter;
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
	 * Find tag by ID
	 * @param {string} workspaceId The ID of the workspace
	 * @param {srting} tagId The ID of the tag
	 * @returns {Tag} The tag or undefined
	 */
	public static async getTag(workpaceId: string, tagId: string): Promise<Tag | undefined> {
		try {
			const res = await this.http.get(`/workspaces/${workpaceId}/tags/${tagId}`);
			return res.data as Tag;
		} catch (err) {
			showError(`Error fetching tag with ID '${tagId}'.`, err);
			return undefined;
		}
	}

	/**
	 * Find multiple tags by ID
	 * @param {string} workspaceId The ID of the workspace
	 * @param {Array<string>} tagIds The IDs of the tags
	 * @returns {Tag[]}
	 */
	public static async getTagsByID(workspaceId: string, tagIds: string[]): Promise<Tag[]> {
		const tags = await Promise.all(tagIds.map((tagId) => this.getTag(workspaceId, tagId)));
		return tags.filter((x) => x) as Tag[];
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

	/**
	 * Update tag in workspace
	 * @param {string} workspaceId The ID of the workspace the tag belongs to
	 * @param {string} tagId The ID of the tag to update
	 * @param {TagRequest} data The data to update
	 * @returns {Tag} The updated tag or `undefined`
	 */
	public static async updateTag(
		workspaceId: string,
		tagId: string,
		data: TagRequest
	): Promise<Tag | undefined> {
		try {
			const res = await this.http.put(`/workspaces/${workspaceId}/tags/${tagId}`, data);
			return res.data as Tag;
		} catch (err) {
			showError('Error updating tag.', err);
			return undefined;
		}
	}

	/**
	 * Delete tag from workspace
	 * @param {string} workspaceId The ID of the workspace
	 * @param {string} tagId The ID of the tag to delete
	 * @returns {Project|undefined} The deleted tag
	 */
	public static async deleteTag(workspaceId: string, tagId: string): Promise<Tag | undefined> {
		try {
			const res = await this.http.delete(`/workspaces/${workspaceId}/tags/${tagId}`);
			return res.data as Tag;
		} catch (err) {
			showError('Error deleting tag.', err);
			return undefined;
		}
	}

	//#endregion
	//#region Tasks

	/**
	 * Find tasks on project
	 * @param {string} workspaceId The ID of the workspace
	 * @param {string} projectId The ID of the project
	 * @param {GetTasksFilter} filter The filter
	 * @returns {Array<Task>} The tasks on the given project
	 */
	public static async getTasks(
		workspaceId: string,
		projectId: string,
		filter: GetTasksFilter = {}
	): Promise<Task[]> {
		const { isActive, name, page, pageSize } = filter;
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
	 * Find task by ID
	 * @param {string} workspaceId The ID of the workspace
	 * @param {string} projectId The ID of the project
	 * @param {string} taskId The ID of the Task
	 * @returns {Task} The task or undefined
	 */
	public static async getTask(
		workspaceId: string,
		projectId: string,
		taskId: string
	): Promise<Task | undefined> {
		try {
			const res = await this.http.get(
				`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
			);
			return res.data as Task;
		} catch (err) {
			showError(`Error fetching task with ID '${taskId}'.`, err);
			return undefined;
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
	 * @param {GetTimeEntryFilter} filter The filter
	 * @returns {TimeEntry|undefined} The time entry
	 */
	public static async getTimeEntry(
		workspaceId: string,
		timeEntryId: string,
		filter: GetTimeEntryFilter
	): Promise<TimeEntry | undefined> {
		const { considerDurationFormat, hydrated } = filter;
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
	 * @param {GetTimeEntriesForUserFilter} filter The filter
	 * @returns
	 */
	public static async getTimeEntriesForUser(
		workspaceId: string,
		userId: string,
		filter: GetTimeEntriesForUserFilter = {}
	): Promise<TimeEntryImpl[]> {
		try {
			const q = qs.stringify(
				{
					description: filter.description,
					start: filter.start,
					end: filter.end,
					project: filter.project,
					task: filter.task,
					tags: filter.tags,
					//eslint-disable-next-line @typescript-eslint/naming-convention
					'project-required': filter.projectRequired ? '1' : undefined,
					//eslint-disable-next-line @typescript-eslint/naming-convention
					'task-required': filter.taskRequired ? '1' : undefined,
					//eslint-disable-next-line @typescript-eslint/naming-convention
					'consider-duration-format': filter.considerDurationFormat ? '1' : undefined,
					hydrated: filter.hydrated ? '1' : undefined,
					//eslint-disable-next-line @typescript-eslint/naming-convention
					'in-progress': filter.inProgress ? '1' : undefined,
					page: filter.page,
					//eslint-disable-next-line @typescript-eslint/naming-convention
					'page-size': filter.pageSize,
				},
				{ encodeValuesOnly: true }
			);

			const res = await this.http.get(
				`/workspaces/${workspaceId}/user/${userId}/time-entries?${q}`
			);
			return res.data as TimeEntryImpl[];
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
		data: StopTimeEntryRequest
	): Promise<TimeEntry | undefined> {
		try {
			const res = await this.http.patch(
				`/workspaces/${workspaceId}/user/${userId}/time-entries`,
				data
			);
			return res.data as TimeEntry;
		} catch (err) {
			showError('Error stopping time entry', err);
			return undefined;
		}
	}

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
			const workspaces = res.data as Workspace[];
			workspaces.sort((a, b) => a.name.localeCompare(b.name));
			return workspaces;
		} catch (err) {
			showError('Error fetching workspaces.', err);
			return [];
		}
	}

	/**
	 * Find workspace by ID
	 * @param {string} workspaceId The ID of the workspace
	 * @returns {Workspace} The workspace or undefined
	 */
	public static async getWorkspace(workspaceId: string): Promise<Workspace | undefined> {
		try {
			const workspaces = await this.getWorkspaces();
			return workspaces.find((x) => x.id === workspaceId);
		} catch (err) {
			showError('Error fetching workspace.', err);
			return undefined;
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
