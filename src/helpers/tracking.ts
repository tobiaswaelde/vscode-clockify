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
	public static billable?: boolean;

	/**
	 * Initilaize tracking API
	 */
	public static async initialize() {
		// check for autostart tracking
		const autostart = Config.get<boolean>('tracking.autostart') || false;
		if (autostart) {
			await this.update();
			if (this.isTracking) {
				return;
			}
			console.log('[tracking] automatically start tracking...');
			await this.start();
		} else {
			await this.update();
		}
	}

	/**
	 * Clean up tracking API
	 */
	public static async dispose() {
		// check autostop tracking
		const autostop = Config.get<boolean>('tracking.autostop') || false;
		if (autostop) {
			console.log('[tracking] automatically stop tracking...');
			await this.update();
			await this.stop();
		}
	}

	/**
	 * Start tracking
	 */
	public static async start() {
		// skip is tracker is already active
		if (this.isTracking) {
			return;
		}

		const start = new Date().toISOString();

		this.workspace = await this.getWorkspace();
		if (!this.workspace) {
			return;
		}
		this.project = await this.getProject();
		this.task = await this.getTask();
		this.description = await Dialogs.getDescription('What are you working on?');
		this.billable = Config.get<boolean>('tracking.billable');

		// add time entry
		await Clockify.addTimeEntry(this.workspace.id, {
			start,
			description: this.description,
			projectId: this.project?.id,
			taskId: this.task?.id,
			billable: this.billable,
		});
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
				projectId: this.project?.id,
				tagIds: this.timeEntry.tagIds || undefined,
				taskId: this.task?.id,
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

	/**
	 * check if tracker is running
	 */
	public static async update() {
		if (!this.workspace) {
			const workspaceId = await this.getWorkspaceId();
			if (workspaceId) {
				this.workspace = await Clockify.getWorkspace(workspaceId);
			} else {
				this.workspace = await Dialogs.selectWorkspace();
			}
			if (!this.workspace) {
				return;
			}
		}

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

	/**
	 * Show dialogs to select project, task and description
	 */
	public static async updateInformation() {
		if (!this.workspace || !this.timeEntry) {
			return;
		}

		this.project = await this.getProject();
		this.task = await this.getTask();
		this.description = await Dialogs.getDescription('What are you working on?');

		await Clockify.updateTimeEntry(this.workspace.id, this.timeEntry.id, {
			description: this.description,
			billable: this.timeEntry.billable,
			projectId: this.project?.id,
			tagIds: this.timeEntry.tagIds || undefined,
			taskId: this.task?.id,
			start: this.timeEntry.timeInterval.start,
		});

		TreeView.refreshTimeentries();
	}

	//#region start
	private static async getWorkspace(): Promise<Workspace | undefined> {
		// check if workspace ID is set in config
		const workspaceId = await this.getWorkspaceId();
		if (workspaceId) {
			return Clockify.getWorkspace(workspaceId);
		}

		// let the user select the workspace
		return Dialogs.selectWorkspace('Select the workspace to start tracking.');
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

	private static async getWorkspaceId(): Promise<string | undefined> {
		const workspaceWorkspaceId = Config.get<string>('tracking.workspaceId');
		if (workspaceWorkspaceId) {
			return workspaceWorkspaceId;
		}

		const defaultWorkspaceId = Config.get<string>('defaultWorkspaceId');
		if (defaultWorkspaceId) {
			return defaultWorkspaceId;
		}

		const workspaces = await Clockify.getWorkspaces();
		if (workspaces.length > 0) {
			return workspaces[0].id;
		}

		return undefined;
	}

	//#region update
	private static async getRunningTimeEntry(): Promise<TimeEntryImpl | undefined> {
		// check workspace
		const workspaceId = this.getWorkspaceId();
		if (!this.workspace || !workspaceId) {
			return undefined;
		}

		// get current user
		const user = await Clockify.getCurrentUser();
		if (!user) {
			return undefined;
		}

		// find running time entries in workspace
		const timeentries = await Clockify.getTimeEntriesForUser(this.workspace.id, user.id);
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

		const { workspaceId, projectId, taskId } = this.timeEntry;
		this.task = await Clockify.getTask(workspaceId, projectId, taskId);
	}
	//#endregion
}
