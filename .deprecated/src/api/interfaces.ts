import {
	AutomaticLock_Day,
	AutomaticLock_Period,
	AutomaticLock_Type,
	CurrentUser_Status,
	Estimate_Type,
	Membership_MembershipStatus,
	Task_Status,
	User_Status,
	UserSettings_DashboardSelection,
	UserSettings_DashboardViewType,
	UserSettings_WeekStart,
	WorkspaceSettings_AdminOnlyPages
} from './enumerations';

export interface AutomaticLockDto {
	changeDay: AutomaticLock_Day;
	dayOfMonth: number;
	firstDay: AutomaticLock_Day;
	olderThanPeriod: AutomaticLock_Period;
	olderThanValue: number;
	type: AutomaticLock_Type;
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
	memberships: MembershipDto[];
	name: string;
	profilePicture: string;
	settings: UserSettingsDto;
	status: CurrentUser_Status;
}
export interface EstimateDto {
	estimate: string;
	type: Estimate_Type;
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
	hourlyRate: HourlyRateDto;
	membershipStatus: Membership_MembershipStatus;
	membershipType: string;
	targetId: string;
	userId: string;
}
export interface MembershipRequest {
	userId: string;
	hourlyRate: HourlyRateRequest;
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
	estimate: EstimateDto;
	hourlyRate: HourlyRateDto;
	id: string;
	memberships: MembershipDto[];
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
	estimate: EstimateRequest;
	color: string;
	billable: boolean;
	hourlyRate: HourlyRateRequest;
	memberships: MembershipRequest[];
	tasks: TaskRequest[];
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
	status: Task_Status;
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
	projectsAndTasks: ProjectTaskTupleDto[];
	userId: string;
	workspaceId: string;
}
export interface TemplatePatchRequest {
	name: string;
}
export interface TemplateRequest {
	name: string;
	projectsAndTasks: ProjectTaskTupleRequest[];
}
export interface TimeEntriesDurationRequest {
	start: string;
	end: string;
}
export interface TimeEntry {
	billable: boolean;
	isLocked: boolean;
	projectId: ProjectId;
	tagIds: TagId[];
	taskId: TaskId;
	timeInterval: TimeInterval;
}
export interface TimeEntryBulkEditRequest {
	timeEntries: TimeEntryRequest[];
	timeEntryIds: string[];
	timeEntryList: TimeEntry[];
	changeFields: string[];
}
export interface TimeEntryDtoImpl {
	billable: boolean;
	description: string;
	id: string;
	isLocked: boolean;
	projectId: string;
	tagIds: string[];
	taskId: string;
	timeInterval: TimeIntervalDto;
	userId: string;
	workspaceId: string;
}
export interface TimeEntryIdsRequest {
	timeEntryIds: string[];
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
	tagIds: string[];
	timeInterval: TimeEntriesDurationRequest;
	workspaceId: string;
	isLocked: boolean;
}
export interface TimeEntrySummaryDto {
	billable: boolean;
	clientId: string;
	clientName: string;
	description: string;
	hourlyRate: HourlyRateDto;
	id: string;
	isLocked: boolean;
	project: ProjectSummaryDto;
	tags: TagDto[];
	task: TaskDto;
	timeInterval: TimeIntervalDto;
	totalBillable: number;
	user: UserSummaryDto;
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
	tagIds: string[];
}
export interface UserDto {
	activeWorkspace: string;
	defaultWorkspace: string;
	email: string;
	id: string;
	memberships: MembershipDto[];
	name: string;
	profilePicture: string;
	settings: UserSettingsDto;
	status: User_Status;
}
export interface UserSettingsDto {
	collapseAllProjectLists: boolean;
	dashboardPinToTop: boolean;
	dashboardSelection: UserSettings_DashboardSelection;
	dashboardViewType: UserSettings_DashboardViewType;
	dateFormat: string;
	isCompactViewOn: boolean;
	longRunning: boolean;
	projectListCollapse: number;
	sendNewsletter: boolean;
	summaryReportSettings: SummaryReportSettingsDto;
	timeFormat: string;
	timeTrackingManual: boolean;
	timeZone: string;
	weekStart: UserSettings_WeekStart;
	weeklyUpdates: boolean;
}
export interface UserSummaryDto {
	email: string;
	id: string;
	name: string;
}
export interface WorkspaceDto {
	hourlyRate: HourlyRateDto;
	id: string;
	imageUrl: string;
	memberships: MembershipDto[];
	name: string;
	workspaceSettings: WorkspaceSettingsDto;
}
export interface WorkspaceRequest {
	name: string;
}
export interface WorkspaceSettingsDto {
	adminOnlyPages: WorkspaceSettings_AdminOnlyPages[];
	automaticLock: AutomaticLockDto;
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
}
