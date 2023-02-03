export type Weekday =
	| 'MONDAY'
	| 'TUESDAY'
	| 'WEDNESDAY'
	| 'THURSDAY'
	| 'FRIDAY'
	| 'SATURDAY'
	| 'SUNDAY';
export type AutomaticLockPeriod = 'DAYS' | 'WEEKS' | 'MONTHS';
export type AutomaticLockType = 'WEEKLY' | 'MONTHLY' | 'OLDER_THAN';
export type CurrentUserStatus = 'ACTIVE' | 'PENDING_EMAIL_VERIFICATION' | 'DELETED';
export type EstimateType = 'AUTO' | 'MANUAL';
export type MembershipStatus = 'PENDING' | 'ACTIVE' | 'DECLINED' | 'INACTIVE';
export type TaskStatus = 'ACTIVE' | 'DONE';
export type UserStatus = 'ACTIVE' | 'PENDING_EMAIL_VERIFICATION' | 'DELETED';
export type DashboardSelection = 'ME' | 'TEAM';
export type DashboardViewType = 'PROJECT' | 'BILLABILITY';
export type AdminOnlyPages = 'PROJECT' | 'TEAM' | 'REPORTS';

export type AutomaticLock = {
	changeDay: Weekday;
	dayOfMonth: number;
	firstDay: Weekday;
	olderThanPeriod: AutomaticLockPeriod;
	olderThanValue: number;
	type: AutomaticLockType;
};
export type Client = {
	id: string;
	name: string;
	workspaceId: string;
};
export type ClientRequest = {
	name: string;
};
export type CurrentUser = {
	activeWorkspace: string;
	defaultWorkspace: string;
	email: string;
	id: string;
	memberships: Membership[];
	name: string;
	profilePicture: string;
	settings: UserSettings;
	status: CurrentUserStatus;
};
export type Estimate = {
	estimate: string;
	type: EstimateType;
};
export type EstimateRequest = {
	estimate: number;
	type: string;
};
export type HourlyRate = {
	amount: number;
	currency: string;
};
export type HourlyRateRequest = {
	amount: number;
	currency: string;
};
export type Membership = {
	hourlyRate: HourlyRate;
	membershipStatus: MembershipStatus;
	membershipType: string;
	targetId: string;
	userId: string;
};
export type MembershipRequest = {
	userId: string;
	hourlyRate: HourlyRateRequest;
	targetId: string;
	membershipType: string;
	membershipStatus: string;
};
export type ProjectImpl = {
	archived: boolean;
	billable: boolean;
	clientId: string;
	clientName: string;
	color: string;
	duration: string;
	estimate: Estimate;
	hourlyRate: HourlyRate;
	id: string;
	memberships: Membership[];
	name: string;
	public: boolean;
	workspaceId: string;
};
export type ProjectId = {
	id: string;
};
export type ProjectRequest = {
	name: string;
	clientId: string;
	isPublic: boolean;
	estimate: EstimateRequest;
	color: string;
	billable: boolean;
	hourlyRate: HourlyRateRequest;
	memberships: MembershipRequest[];
	tasks: TaskRequest[];
};
export type ProjectSummary = {
	color: string;
	id: string;
	name: string;
};
export type ProjectTaskTuple = {
	projectId: string;
	taskId: string;
};
export type ProjectTaskTupleRequest = {
	projectId: string;
	taskId: string;
};
export type Round = {
	minutes: string;
	round: string;
};
export type StopTimeEntryRequest = {
	end: string;
};
export type SummaryReportSettings = {
	group: string;
	subgroup: string;
};
export type Tag = {
	id: string;
	name: string;
	workspaceId: string;
};
export type TagId = {
	id: string;
};
export type TagRequest = {
	name: string;
};
export type Task = {
	assigneeId: string;
	estimate: string;
	id: string;
	name: string;
	projectId: string;
	status: TaskStatus;
};
export type TaskId = {
	id: string;
};
export type TaskRequest = {
	id: string;
	name: string;
	assigneeId: string;
	estimate: string;
	status: string;
};
export type Template = {
	id: string;
	name: string;
	projectsAndTasks: ProjectTaskTuple[];
	userId: string;
	workspaceId: string;
};
export type TemplatePatchRequest = {
	name: string;
};
export type TemplateRequest = {
	name: string;
	projectsAndTasks: ProjectTaskTupleRequest[];
};
export type TimeEntriesDurationRequest = {
	start: string;
	end: string;
};
export type TimeEntry = {
	billable: boolean;
	isLocked: boolean;
	projectId: ProjectId;
	tagIds: TagId[];
	taskId: TaskId;
	timeInterval: TimeInterval;
};
export type TimeEntryBulkEditRequest = {
	timeEntries: TimeEntryRequest[];
	timeEntryIds: string[];
	timeEntryList: TimeEntry[];
	changeFields: string[];
};
export type TimeEntryImpl = {
	billable: boolean;
	description: string;
	id: string;
	isLocked: boolean;
	projectId: string;
	tagIds: string[];
	taskId: string;
	timeInterval: TimeInterval;
	userId: string;
	workspaceId: string;
};
export type TimeEntryIdsRequest = {
	timeEntryIds: string[];
};
export type TimeEntryRequest = {
	id: string;
	start: string;
	billable: boolean;
	description: string;
	projectId: string;
	userId: string;
	taskId: string;
	end: string;
	tagIds: string[];
	timeInterval: TimeEntriesDurationRequest;
	workspaceId: string;
	isLocked: boolean;
};
export type TimeEntrySummary = {
	billable: boolean;
	clientId: string;
	clientName: string;
	description: string;
	hourlyRate: HourlyRate;
	id: string;
	isLocked: boolean;
	project: ProjectSummary;
	tags: Tag[];
	task: Task;
	timeInterval: TimeInterval;
	totalBillable: number;
	user: UserSummary;
};
export type TimeInterval = {
	duration: string;
	end: Date;
	start: Date;
};
export type UpdateTimeEntryRequest = {
	start: string;
	billable: boolean;
	description: string;
	projectId: string;
	taskId: string;
	end: string;
	tagIds: string[];
};
export type User = {
	activeWorkspace: string;
	defaultWorkspace: string;
	email: string;
	id: string;
	memberships: Membership[];
	name: string;
	profilePicture: string;
	settings: UserSettings;
	status: UserStatus;
};
export type UserSettings = {
	collapseAllProjectLists: boolean;
	dashboardPinToTop: boolean;
	dashboardSelection: DashboardSelection;
	dashboardViewType: DashboardViewType;
	dateFormat: string;
	isCompactViewOn: boolean;
	longRunning: boolean;
	projectListCollapse: number;
	sendNewsletter: boolean;
	summaryReportSettings: SummaryReportSettings;
	timeFormat: string;
	timeTrackingManual: boolean;
	timeZone: string;
	weekStart: Weekday;
	weeklyUpdates: boolean;
};
export type UserSummary = {
	email: string;
	id: string;
	name: string;
};
export type Workspace = {
	hourlyRate: HourlyRate;
	id: string;
	imageUrl: string;
	memberships: Membership[];
	name: string;
	workspaceSettings: WorkspaceSettings;
};
export type WorkspaceRequest = {
	name: string;
};
export type WorkspaceSettings = {
	adminOnlyPages: AdminOnlyPages[];
	automaticLock: AutomaticLock;
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
	round: Round;
	timeRoundingInReports: boolean;
	trackTimeDownToSecond: boolean;
};
