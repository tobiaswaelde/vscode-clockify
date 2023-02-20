import { StatusBar } from './../views/statusbar/index';
import { TimeEntryImpl } from './../sdk/types/time-entry';
import { Workspace } from './../sdk/types/workspace';
import { Clockify } from '../sdk';
import { Config } from '../util/config';
import { Dialogs } from '../util/dialogs';
import { Project } from '../sdk/types/project';
import { Task } from '../sdk/types/task';
import { TreeView } from '../views/treeview';

export class Tracking {
	public static isTracking: boolean = false;
	public static timeEntry?: TimeEntryImpl;
	public static description?: string;
	public static workspace?: Workspace;
	public static project?: Project;
	public static task?: Task;

	public static async initialize() {}

	public static async start() {
		// skip is tracker is already active
		if (this.isTracking) {
			return;
		}
		console.log(this.workspace, this.project, this.task);

		const start = new Date().toISOString();

		this.workspace = await this.getWorkspace();
		if (!this.workspace) {
			return;
		}
		this.project = await this.getProject();
		this.task = await this.getTask();
		this.description = await Dialogs.getDescription('What are you working on?');

		// add time entry
		const newTimeentry = await Clockify.addTimeEntry(this.workspace.id, {
			start,
			description: this.description,
			projectId: this.project?.id,
			taskId: this.task?.id,
		});
		console.log(newTimeentry);
		this.update();
		TreeView.refreshTimeentries();
	}

	/**
	 * Stop current running timer
	 */
	public static async stop() {
		if (!this.workspace || !this.timeEntry) {
			return;
		}

		// get current user
		const user = await Clockify.getCurrentUser();
		if (!user) {
			return undefined;
		}

		// ask for description
		const description = await Dialogs.getDescription('What were you working on?', this.description);
		if (description) {
			await Clockify.updateTimeEntry(this.workspace.id, this.timeEntry.id, {
				description: description,
				start: this.timeEntry.timeInterval.start,
			});
		}

		// send stop request
		const end = new Date().toISOString();
		await Clockify.stopTimeEntryForUser(this.workspace.id, user.id, { end });

		// update status bar
		this.isTracking = false;
		this.timeEntry = undefined;
		await StatusBar.update();
		TreeView.refreshTimeentries();
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

	//#region start
	private static async getWorkspace(): Promise<Workspace | undefined> {
		// check if workspace ID is set in config
		const workspaceWorkspaceId = Config.get<string>('tracking.workspaceId');
		if (workspaceWorkspaceId) {
			return Clockify.getWorkspace(workspaceWorkspaceId);
		}

		// let the user select the workspace
		return Dialogs.selectWorkspace();
	}
	private static async getProject(): Promise<Project | undefined> {
		// skip if no workspace is set
		if (!this.workspace) {
			return undefined;
		}

		// check if project ID is set in config
		const workspaceProjectId = Config.get<string>('tracking.projectId');
		if (workspaceProjectId) {
			return Clockify.getProject(this.workspace.id, workspaceProjectId);
		}

		// let the user select the project
		const project = await Dialogs.selectProject(this.workspace.id, true);
		return project || undefined;
	}
	private static async getTask(): Promise<Task | undefined> {
		// skip if noc workspace and no project is set
		if (!this.workspace || !this.project) {
			return undefined;
		}

		// check if task ID is set in config
		const workspaceTaskId = Config.get<string>('tracking.taskId');
		if (workspaceTaskId) {
			return Clockify.getTask(this.workspace.id, this.project.id, workspaceTaskId);
		}

		// let the user select the task
		const task = await Dialogs.selectTask(this.workspace.id, this.project.id, true);
		return task || undefined;
	}
	//#endregion
	//#region update
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
	//#endregion
}
