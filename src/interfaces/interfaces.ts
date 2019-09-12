export interface AutomaticLockDto {
	changeDay: string;
	dayOfMonth: number;
	firstDay: string;
	olderThanPeriod: string;
	olderThanValue: number;
	type: string;
}
export interface ClientDto {
	id: string;
	name: string;
	workspaceId: string;
}
export interface ClientRequest {
	name: string;
}
export interface CurrentUserDto {
	activeWorkspace: string;
	defaultWorkspace: string;
	email: string;
	id: string;
	memberships: [
		{
			hourlyRate: {
				amount: number;
				currency: string;
			};
			membershipStatus: string;
			membershipType: string;
			targetId: string;
			userId: string;
		}
	];
	name: string;
	profilePicture: string;
	settings: {
		collapseAllProjectLists: boolean;
		dashboardPinToTop: boolean;
		dashboardSelection: string;
		dashboardViewType: string;
		dateFormat: string;
		isCompactViewOn: boolean;
		longRunning: boolean;
		projectListCollapse: number;
		sendNewsletter: boolean;
		summaryReportSettings: {
			group: string;
			subgroup: string;
		};
		timeFormat: string;
		timeTrackingManual: boolean;
		timeZone: string;
		weekStart: string;
		weeklyUpdates: boolean;
	};
	status: string;
}
export interface EstimateDto {
	estimate: string;
	type: string;
}
export interface EstimateRequest {
	estimate: number;
	type: string;
}
export interface HourlyRateDto {
	amount: number;
	currency: string;
}
export interface HourlyRateRequest {
	amount: number;
	currency: string;
}
export interface MembershipDto {
	hourlyRate: {
		amount: number;
		currency: string;
	};
	membershipStatus: string;
	membershipType: string;
	targetId: string;
	userId: string;
}
export interface MembershipRequest {
	userId: string;
	hourlyRate: {
		amount: number;
		currency: string;
	};
	targetId: string;
	membershipType: string;
	membershipStatus: string;
}
export interface ProjectDtoImpl {
	archived: boolean;
	billable: boolean;
	clientId: string;
	clientName: string;
	color: string;
	duration: string;
	estimate: {
		estimate: string;
		type: string;
	};
	hourlyRate: {
		amount: number;
		currency: string;
	};
	id: string;
	memberships: [
		{
			hourlyRate: {
				amount: number;
				currency: string;
			};
			membershipStatus: string;
			membershipType: string;
			targetId: string;
			userId: string;
		}
	];
	name: string;
	public: boolean;
	workspaceId: string;
}
export interface ProjectId {
	id: string;
}
export interface ProjectRequest {
	name: string;
	clientId: string;
	isPublic: boolean;
	estimate: {
		estimate: number;
		type: string;
	};
	color: string;
	billable: boolean;
	hourlyRate: {
		amount: number;
		currency: string;
	};
	memberships: [
		{
			userId: string;
			hourlyRate: {
				amount: number;
				currency: string;
			};
			targetId: string;
			membershipType: string;
			membershipStatus: string;
		}
	];
	tasks: [
		{
			id: string;
			name: string;
			assigneeId: string;
			estimate: string;
			status: string;
		}
	];
}
export interface ProjectSummaryDto {
	color: string;
	id: string;
	name: string;
}
export interface ProjectTaskTupleDto {
	projectId: string;
	taskId: string;
}
export interface ProjectTaskTupleRequest {
	projectId: string;
	taskId: string;
}
export interface Round {
	minutes: string;
	round: string;
}
export interface StopTimeEntryRequest {
	end: string;
}
export interface SummaryReportSettingsDto {
	group: string;
	subgroup: string;
}
export interface TagDto {
	id: string;
	name: string;
	workspaceId: string;
}
export interface TagId {
	id: string;
}
export interface TagRequest {
	name: string;
}
export interface TaskDto {
	assigneeId: string;
	estimate: string;
	id: string;
	name: string;
	projectId: string;
	status: string;
}
export interface TaskId {
	id: string;
}
export interface TaskRequest {
	id: string;
	name: string;
	assigneeId: string;
	estimate: string;
	status: string;
}
export interface TemplateDto {
	id: string;
	name: string;
	projectsAndTasks: [
		{
			projectId: string;
			taskId: string;
		}
	];
	userId: string;
	workspaceId: string;
}
export interface TemplatePatchRequest {
	name: string;
}
export interface TemplateRequest {
	name: string;
	projectsAndTasks: [
		{
			projectId: string;
			taskId: string;
		}
	];
}
export interface TimeEntriesDurationRequest {
	start: string;
	end: string;
}
export interface TimeEntry {
	billable: boolean;
	isLocked: boolean;
	projectId: {
		id: string;
	};
	tagIds: [
		{
			id: string;
		}
	];
	taskId: {
		id: string;
	};
	timeInterval: object;
}
export interface TimeEntryBulkEditRequest {
	timeEntries: [
		{
			id: string;
			start: string;
			billable: boolean;
			description: string;
			projectId: string;
			userId: string;
			taskId: string;
			end: string;
			tagIds: [string];
			timeInterval: {
				start: string;
				end: string;
			};
			workspaceId: string;
			isLocked: boolean;
		}
	];
	timeEntryIds: [string];
	timeEntryList: [
		{
			billable: boolean;
			isLocked: boolean;
			projectId: {
				id: string;
			};
			tagIds: [
				{
					id: string;
				}
			];
			taskId: {
				id: string;
			};
			timeInterval: object;
		}
	];
	changeFields: [string];
}
export interface TimeEntryDtoImpl {
	billable: boolean;
	description: string;
	id: string;
	isLocked: boolean;
	projectId: string;
	tagIds: [string];
	taskId: string;
	timeInterval: {
		duration: string;
		end: Date;
		start: Date;
	};
	userId: string;
	workspaceId: string;
}
export interface TimeEntryIdsRequest {
	timeEntryIds: [string];
}
export interface TimeEntryRequest {
	id: string;
	start: string;
	billable: boolean;
	description: string;
	projectId: string;
	userId: string;
	taskId: string;
	end: string;
	tagIds: [string];
	timeInterval: {
		start: string;
		end: string;
	};
	workspaceId: string;
	isLocked: boolean;
}
export interface TimeEntrySummaryDto {
	billable: boolean;
	clientId: string;
	clientName: string;
	description: string;
	hourlyRate: {
		amount: number;
		currency: string;
	};
	id: string;
	isLocked: boolean;
	project: {
		color: string;
		id: string;
		name: string;
	};
	tags: [
		{
			id: string;
			name: string;
			workspaceId: string;
		}
	];
	task: {
		assigneeId: string;
		estimate: string;
		id: string;
		name: string;
		projectId: string;
		status: string;
	};
	timeInterval: {
		duration: string;
		end: Date;
		start: Date;
	};
	totalBillable: number;
	user: {
		email: string;
		id: string;
		name: string;
	};
}
export interface TimeInterval {}
export interface TimeIntervalDto {
	duration: string;
	end: Date;
	start: Date;
}
export interface UpdateTimeEntryRequest {
	start: string;
	billable: boolean;
	description: string;
	projectId: string;
	taskId: string;
	end: string;
	tagIds: [string];
}
export interface UserDto {
	activeWorkspace: string;
	defaultWorkspace: string;
	email: string;
	id: string;
	memberships: [
		{
			hourlyRate: {
				amount: number;
				currency: string;
			};
			membershipStatus: string;
			membershipType: string;
			targetId: string;
			userId: string;
		}
	];
	name: string;
	profilePicture: string;
	settings: {
		collapseAllProjectLists: boolean;
		dashboardPinToTop: boolean;
		dashboardSelection: string;
		dashboardViewType: string;
		dateFormat: string;
		isCompactViewOn: boolean;
		longRunning: boolean;
		projectListCollapse: number;
		sendNewsletter: boolean;
		summaryReportSettings: {
			group: string;
			subgroup: string;
		};
		timeFormat: string;
		timeTrackingManual: boolean;
		timeZone: string;
		weekStart: string;
		weeklyUpdates: boolean;
	};
	status: string;
}
export interface UserSettingsDto {
	collapseAllProjectLists: boolean;
	dashboardPinToTop: boolean;
	dashboardSelection: string;
	dashboardViewType: string;
	dateFormat: string;
	isCompactViewOn: boolean;
	longRunning: boolean;
	projectListCollapse: number;
	sendNewsletter: boolean;
	summaryReportSettings: {
		group: string;
		subgroup: string;
	};
	timeFormat: string;
	timeTrackingManual: boolean;
	timeZone: string;
	weekStart: string;
	weeklyUpdates: boolean;
}
export interface UserSummaryDto {
	email: string;
	id: string;
	name: string;
}
export interface WorkspaceDto {
	hourlyRate: {
		amount: number;
		currency: string;
	};
	id: string;
	imageUrl: string;
	memberships: [
		{
			hourlyRate: {
				amount: number;
				currency: string;
			};
			membershipStatus: string;
			membershipType: string;
			targetId: string;
			userId: string;
		}
	];
	name: string;
	workspaceSettings: {
		adminOnlyPages: [string];
		automaticLock: {
			changeDay: string;
			dayOfMonth: number;
			firstDay: string;
			olderThanPeriod: string;
			olderThanValue: number;
			type: string;
		};
		canSeeTimeSheet: boolean;
		defaultBillableProjects: boolean;
		forceDescription: boolean;
		forceProjects: boolean;
		forceTags: boolean;
		forceTasks: boolean;
		lockTimeEntries: string;
		onlyAdminsCreateProject: boolean;
		onlyAdminsCreateTag: boolean;
		onlyAdminsSeeAllTimeEntries: boolean;
		onlyAdminsSeeBillableRates: boolean;
		onlyAdminsSeeDashboard: boolean;
		onlyAdminsSeePublicProjectsEntries: boolean;
		projectFavorites: boolean;
		projectGroupingLabel: string;
		projectPickerSpecialFilter: boolean;
		round: {
			minutes: string;
			round: string;
		};
		timeRoundingInReports: boolean;
		trackTimeDownToSecond: boolean;
	};
}
export interface WorkspaceRequest {
	name: string;
}
export interface WorkspaceSettingsDto {
	adminOnlyPages: [string];
	automaticLock: {
		changeDay: string;
		dayOfMonth: number;
		firstDay: string;
		olderThanPeriod: string;
		olderThanValue: number;
		type: string;
	};
	canSeeTimeSheet: boolean;
	defaultBillableProjects: boolean;
	forceDescription: boolean;
	forceProjects: boolean;
	forceTags: boolean;
	forceTasks: boolean;
	lockTimeEntries: string;
	onlyAdminsCreateProject: boolean;
	onlyAdminsCreateTag: boolean;
	onlyAdminsSeeAllTimeEntries: boolean;
	onlyAdminsSeeBillableRates: boolean;
	onlyAdminsSeeDashboard: boolean;
	onlyAdminsSeePublicProjectsEntries: boolean;
	projectFavorites: boolean;
	projectGroupingLabel: string;
	projectPickerSpecialFilter: boolean;
	round: {
		minutes: string;
		round: string;
	};
	timeRoundingInReports: boolean;
	trackTimeDownToSecond: boolean;
}
