import { StatusBar } from './../views/statusbar/index';
import { TimeEntryImpl } from './../sdk/types/time-entry';
import { Workspace } from './../sdk/types/workspace';
import { Clockify } from '../sdk';
import { Config } from '../util/config';
import { Dialogs } from '../util/dialogs';
import * as moment from 'moment';
import { Project } from '../sdk/types/project';
import { Task } from '../sdk/types/task';
import { showError } from '../sdk/util';

export class Tracking {
	// private static workspaceId?: string;
	// private static projectId?: string;
	// private static taskId?: string;

	public static isTracking: boolean = false;
	public static timeEntry?: TimeEntryImpl;
	public static workspace?: Workspace;
	public static project?: Project;
	public static task?: Task;

	public static initialize() {
		// this.workspaceId = Config.get<string>('tracking.workspaceId');
	}

	public static async start() {
		const start = moment();

		// const workspaceId = await this.getWorkspaceId();
		// if (!workspaceId) {
		// 	return;
		// }
		// const workspace = await this.getWorkspace();
		// if (!workspace) {
		// 	return;
		// }
		// this.workspaceId = workspaceId;
		// this.workspace = workspace;
		// this.projectId = await this.getProjectId();
		// this.taskId = await this.getTaskId();

		// this.update();

		// // add time entry

		// console.log('tracking:', this.isTracking);
	}

	/**
	 * Stop current running timer
	 */
	public static async stop() {
		if (!this.workspace) {
			return;
		}

		// get current user
		const user = await Clockify.getCurrentUser();
		if (!user) {
			return undefined;
		}

		// send stop request
		const end = new Date().toISOString();
		await Clockify.stopTimeEntryForUser(this.workspace.id, user.id, { end });

		// update status bar
		this.isTracking = false;
		this.timeEntry = undefined;
		await StatusBar.update();
	}

	public static async update() {
		const timeEntry = await this.getRunningTimeEntry();
		if (!timeEntry) {
			this.isTracking = false;
			this.timeEntry = undefined;
		} else {
			this.isTracking = true;
			this.timeEntry = timeEntry;
			this.updateWorkspace();
			this.updateProject();
			this.updateTask();
		}
	}

	private static async getRunningTimeEntry(): Promise<TimeEntryImpl | undefined> {
		// get current user
		const user = await Clockify.getCurrentUser();
		if (!user) {
			return undefined;
		}

		// find running time entries in all workspaces
		const workspaces = await Clockify.getWorkspaces();
		const timeentries = (
			await Promise.all(workspaces.map((x) => Clockify.getTimeEntriesForUser(x.id, user.id)))
		).flat();
		const startedTimeEntries = timeentries.filter((x) => x.timeInterval.end === null);

		// get running time entry
		if (startedTimeEntries.length > 0) {
			return startedTimeEntries[0];
		}

		return undefined;
	}
	private static async updateWorkspace() {
		if (
			!this.timeEntry || // no active time entry
			this.workspace?.id === this.timeEntry.workspaceId // workspace not changed
		) {
			return;
		}

		console.log('[tracking] update workspace');
		this.workspace = await Clockify.getWorkspace(this.timeEntry.workspaceId);
	}
	private static async updateProject() {
		if (
			!this.timeEntry || // no active time entry
			!this.timeEntry.projectId || // no project assigned
			this.project?.id === this.timeEntry.projectId // project not changed
		) {
			return;
		}

		console.log('[tracking] update project');
		const { workspaceId, projectId } = this.timeEntry;
		this.project = await Clockify.getProject(workspaceId, projectId);
	}
	private static async updateTask() {
		if (
			!this.timeEntry || // no active time entry
			!this.timeEntry.projectId || // no project assigned
			!this.timeEntry.taskId || // no task assigned
			this.task?.id === this.timeEntry.taskId // task not changed
		) {
			return;
		}

		console.log('[tracking] update task');
		const { workspaceId, projectId, taskId } = this.timeEntry;
		this.task = await Clockify.getTask(workspaceId, projectId, taskId);
	}

	// private static async getWorkspaceId(): Promise<string | undefined> {
	// 	const workspaceWorkspaceId = Config.get<string>('tracking.workspaceId');
	// 	if (workspaceWorkspaceId) {
	// 		return workspaceWorkspaceId;
	// 	}

	// 	const workspace = await Dialogs.selectWorkspace();
	// 	if (workspace) {
	// 		return workspace.id;
	// 	}

	// 	return undefined;
	// }
	// private static async getWorkspace(): Promise<Workspace | undefined> {
	// 	const workspaceWorkspaceId = Config.get<string>('tracking.workspaceId');
	// 	if (workspaceWorkspaceId) {
	// 		return Clockify.getWorkspace(workspaceWorkspaceId);
	// 	}

	// 	return Dialogs.selectWorkspace();
	// }

	// private static async getProjectId(): Promise<string | undefined> {
	// 	if (!this.workspaceId) {
	// 		return undefined;
	// 	}

	// 	const workspaceProjectId = Config.get<string>('tracking.projectId');
	// 	if (workspaceProjectId) {
	// 		return workspaceProjectId;
	// 	}

	// 	const project = await Dialogs.selectProject(this.workspaceId);
	// 	if (project) {
	// 		return project.id;
	// 	}

	// 	return undefined;
	// }
	// private static async getProject(): Promise<Project | undefined> {
	// 	if (this.workspaceId && this.projectId) {
	// 		return Clockify.getProject(this.workspaceId, this.projectId);
	// 	}
	// 	return undefined;
	// }

	// private static async getTaskId(): Promise<string | undefined> {
	// 	if (!this.workspaceId || !this.projectId) {
	// 		return undefined;
	// 	}

	// 	const workspaceTaskId = Config.get<string>('tracking.taskId');
	// 	if (workspaceTaskId) {
	// 		return workspaceTaskId;
	// 	}

	// 	const task = await Dialogs.selectTask(this.workspaceId, this.projectId);
	// 	if (task) {
	// 		return task.id;
	// 	}

	// 	return undefined;
	// }
}
