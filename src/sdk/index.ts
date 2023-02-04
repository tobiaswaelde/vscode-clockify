import axios from 'axios';
import * as qs from 'qs';
import {
	Client,
	ClientRequest,
	ProjectImpl,
	ProjectRequest,
	Tag,
	TagRequest,
	Task,
	TaskRequest,
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

	//#endregion
	//#region Tie Sheet Templates

	//#endregion
	//#region User

	//#endregion
	//#region Workspaces

	//#endregion
}
