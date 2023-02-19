import { TimeEntryImpl } from './../sdk/types/time-entry';
import { Workspace } from './../sdk/types/workspace';
import { Clockify } from '../sdk';
import { Config } from '../util/config';
import { Dialogs } from '../util/dialogs';
import * as moment from 'moment';
import { Project } from '../sdk/types/project';
import { Task } from '../sdk/types/task';

export class Tracking {
	private static workspaceId?: string;
	private static projectId?: string;
	private static taskId?: string;

	public static isTracking: boolean = false;
	public static timeEntry?: TimeEntryImpl;
	public static workspace?: Workspace;
	public static project?: Project;
	public static task?: Task;

	public static initialize() {
		this.workspaceId = Config.get<string>('tracking.workspaceId');
	}

	public static async start() {
		const start = moment();

		const workspaceId = await this.getWorkspaceId();
		if (!workspaceId) {
			return;
		}
		const workspace = await this.getWorkspace();
		if (!workspace) {
			return;
		}
		this.workspaceId = workspaceId;
		this.workspace = workspace;
		this.projectId = await this.getProjectId();
		this.taskId = await this.getTaskId();

		this.update();

		// add time entry

		console.log('tracking:', this.isTracking);
	}

	public static async stop() {
		console.log('stop tracking');
	}

	public static async update(): Promise<boolean> {
		console.log('[tracking] update');

		if (!this.workspaceId) {
			this.isTracking = false;
			this.timeEntry = undefined;
			return false;
		}

		const user = await Clockify.getCurrentUser();
		if (!user) {
			this.isTracking = false;
			this.timeEntry = undefined;
			return false;
		}

		const workspaces = await Clockify.getWorkspaces();
		const timeentries = (
			await Promise.all(workspaces.map((x) => Clockify.getTimeEntriesForUser(x.id, user.id)))
		).flat();
		const startedTimeEntries = timeentries.filter((x) => x.timeInterval.end === null);

		if (startedTimeEntries.length > 0) {
			const latestTimeEntry = startedTimeEntries[0];
			this.workspaceId = latestTimeEntry.workspaceId;
			this.projectId = latestTimeEntry.projectId || undefined;
			this.taskId = latestTimeEntry.taskId || undefined;
			this.workspace = await Clockify.getWorkspace(latestTimeEntry.workspaceId);
			this.project = await this.getProject();

			this.isTracking = true;
			this.timeEntry = latestTimeEntry;
			return true;
		}

		this.isTracking = false;
		this.timeEntry = undefined;
		return false;
	}

	private static async getWorkspaceId(): Promise<string | undefined> {
		const workspaceWorkspaceId = Config.get<string>('tracking.workspaceId');
		if (workspaceWorkspaceId) {
			return workspaceWorkspaceId;
		}

		const workspace = await Dialogs.selectWorkspace();
		if (workspace) {
			return workspace.id;
		}

		return undefined;
	}
	private static async getWorkspace(): Promise<Workspace | undefined> {
		const workspaceWorkspaceId = Config.get<string>('tracking.workspaceId');
		if (workspaceWorkspaceId) {
			return Clockify.getWorkspace(workspaceWorkspaceId);
		}

		return Dialogs.selectWorkspace();
	}

	private static async getProjectId(): Promise<string | undefined> {
		if (!this.workspaceId) {
			return undefined;
		}

		const workspaceProjectId = Config.get<string>('tracking.projectId');
		if (workspaceProjectId) {
			return workspaceProjectId;
		}

		const project = await Dialogs.selectProject(this.workspaceId);
		if (project) {
			return project.id;
		}

		return undefined;
	}
	private static async getProject(): Promise<Project | undefined> {
		if (this.workspaceId && this.projectId) {
			return Clockify.getProject(this.workspaceId, this.projectId);
		}
		return undefined;
	}

	private static async getTaskId(): Promise<string | undefined> {
		if (!this.workspaceId || !this.projectId) {
			return undefined;
		}

		const workspaceTaskId = Config.get<string>('tracking.taskId');
		if (workspaceTaskId) {
			return workspaceTaskId;
		}

		const task = await Dialogs.selectTask(this.workspaceId, this.projectId);
		if (task) {
			return task.id;
		}

		return undefined;
	}
}
