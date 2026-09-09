import { StatusBar } from './../views/statusbar/index';
import { TimeEntryImpl } from './../sdk/types/time-entry';
import { Workspace } from './../sdk/types/workspace';
import { Clockify } from '../sdk';
import { Config } from '../util/config';
import { Dialogs } from '../util/dialogs';
import { Project } from '../sdk/types/project';
import { Task } from '../sdk/types/task';
import { TreeView } from '../views/treeview';
import { ApiKey } from '../util/api-key';
import { requiresProject } from './tracking-requirements';
import { Uri } from 'vscode';

export class Tracking {
	public static isTracking: boolean = false;
	public static timeEntry?: TimeEntryImpl;
	public static description?: string;
	public static workspace?: Workspace;
	public static project?: Project;
	public static task?: Task;
	public static billable?: boolean;
	private static updateInProgress?: Promise<void>;
	private static startedTimeEntryId?: string;
	private static configurationScope?: Uri;

	/**
	 * Initilaize tracking API
	 */
	public static async initialize() {
		this.configurationScope = Config.getTrackingScope();
		// check for autostart tracking
		const autostart =
			Config.get<boolean>('tracking.autostart', this.configurationScope) || false;
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
		const autostop =
			Config.get<boolean>('tracking.autostop', this.configurationScope) || false;
		if (!autostop || !this.startedTimeEntryId) {
			return;
		}

		await this.update();
		if (this.timeEntry?.id !== this.startedTimeEntryId) {
			return;
		}

		console.log('[tracking] automatically stop tracking...');
		await this.stop();
	}

	/**
	 * Start tracking
	 */
	public static async start() {
		if (!(await ApiKey.get())) {
			return;
		}

		// skip is tracker is already active
		if (this.isTracking) {
			return;
		}
		this.configurationScope = Config.getTrackingScope();

		const start = new Date().toISOString();

		this.workspace = await this.getWorkspace();
		if (!this.workspace) {
			return;
		}
		const projectRequired = requiresProject(this.workspace.workspaceSettings);
		this.project = await this.getProject(projectRequired);
		if (projectRequired && !this.project) {
			return;
		}
		this.task = await this.getTask();
		this.description = await Dialogs.getDescription('What are you working on?');
		this.billable = Config.get<boolean>('tracking.billable', this.configurationScope);

		// add time entry
		const timeEntry = await Clockify.addTimeEntry(this.workspace.id, {
			start,
			description: this.description,
			projectId: this.project?.id,
			taskId: this.task?.id,
			billable: this.billable,
		});
		if (!timeEntry) {
			return;
		}
		this.startedTimeEntryId = timeEntry.id;
		await this.update();
		TreeView.refreshTimeentries();
	}

	/**
	 * Stop current running timer
	 */
	public static async stop() {
		if (!this.workspace || !this.timeEntry) {
			return;
		}
		const workspace = this.workspace;
		const timeEntry = this.timeEntry;

		if (requiresProject(workspace.workspaceSettings) && !timeEntry.projectId) {
			this.project = await this.getProject(true);
			if (!this.project) {
				return;
			}
		}

		// get current user
		const user = await Clockify.getCurrentUser();
		if (!user) {
			return undefined;
		}

		// ask for description
		const description = await Dialogs.getDescription(
			'What were you working on?',
			timeEntry.description
		);
		const projectId = this.project?.id ?? timeEntry.projectId;
		const shouldUpdate = description !== undefined || projectId !== timeEntry.projectId;
		if (shouldUpdate) {
			const nextDescription = description ?? timeEntry.description;
			const nextTaskId = this.task?.id ?? timeEntry.taskId;
			const updatedTimeEntry = await Clockify.updateTimeEntry(workspace.id, timeEntry.id, {
				description: nextDescription,
				billable: timeEntry.billable,
				projectId,
				tagIds: timeEntry.tagIds || undefined,
				taskId: nextTaskId,
				start: timeEntry.timeInterval.start,
			});
			if (!updatedTimeEntry) {
				return;
			}
			timeEntry.description = nextDescription;
			timeEntry.projectId = projectId;
			timeEntry.taskId = nextTaskId;
			this.description = nextDescription;
		}

		// send stop request
		const end = new Date().toISOString();
		const stoppedTimeEntry = await Clockify.stopTimeEntryForUser(workspace.id, user.id, { end });
		if (!stoppedTimeEntry) {
			return;
		}

		// update status bar
		this.isTracking = false;
		this.timeEntry = undefined;
		this.startedTimeEntryId = undefined;
		await StatusBar.update();
		TreeView.refreshTimeentries();
	}

	/**
	 * check if tracker is running
	 */
	public static update(): Promise<void> {
		if (!this.updateInProgress) {
			this.updateInProgress = this.performUpdate().finally(() => {
				this.updateInProgress = undefined;
			});
		}

		return this.updateInProgress;
	}

	private static async performUpdate(): Promise<void> {
		if (!(await ApiKey.get())) {
			this.isTracking = false;
			this.timeEntry = undefined;
			return;
		}

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
			if (this.startedTimeEntryId && timeEntry.id !== this.startedTimeEntryId) {
				this.startedTimeEntryId = undefined;
			}
			this.isTracking = true;
			this.timeEntry = timeEntry;
			this.description = timeEntry.description;
			this.billable = timeEntry.billable;
			await Promise.all([this.updateWorkspace(), this.updateProject(), this.updateTask()]);
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
	private static async getProject(required: boolean = false): Promise<Project | undefined> {
		// skip if no workspace is set
		if (!this.workspace) {
			return undefined;
		}

		// check if project ID is set in config
		const workspaceProjectId = Config.get<string>(
			'tracking.projectId',
			this.configurationScope
		);
		if (workspaceProjectId) {
			return Clockify.getProject(this.workspace.id, workspaceProjectId);
		}

		// let the user select the project
		const project = await Dialogs.selectProject(this.workspace.id, !required);
		return project || undefined;
	}
	private static async getTask(): Promise<Task | undefined> {
		// skip if noc workspace and no project is set
		if (!this.workspace || !this.project) {
			return undefined;
		}

		// check if task ID is set in config
		const workspaceTaskId = Config.get<string>('tracking.taskId', this.configurationScope);
		if (workspaceTaskId) {
			return Clockify.getTask(this.workspace.id, this.project.id, workspaceTaskId);
		}

		// let the user select the task
		const task = await Dialogs.selectTask(this.workspace.id, this.project.id, true);
		return task || undefined;
	}
	//#endregion

	private static async getWorkspaceId(): Promise<string | undefined> {
		const workspaceWorkspaceId = Config.get<string>(
			'tracking.workspaceId',
			this.configurationScope
		);
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
		const workspaceId = await this.getWorkspaceId();
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
		if (!this.timeEntry) {
			return;
		}
		if (!this.timeEntry.projectId) {
			this.project = undefined;
			return;
		}
		if (this.project?.id === this.timeEntry.projectId) {
			return;
		}

		const { workspaceId, projectId } = this.timeEntry;
		this.project = await Clockify.getProject(workspaceId, projectId);
	}
	private static async updateTask() {
		if (!this.timeEntry) {
			return;
		}
		if (!this.timeEntry.projectId || !this.timeEntry.taskId) {
			this.task = undefined;
			return;
		}
		if (this.task?.id === this.timeEntry.taskId) {
			return;
		}

		const { workspaceId, projectId, taskId } = this.timeEntry;
		this.task = await Clockify.getTask(workspaceId, projectId, taskId);
	}
	//#endregion
}
