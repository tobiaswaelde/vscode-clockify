import { Membership } from './membership';
import { Weekday } from './weekday';

export type CurrentUserStatus = 'ACTIVE' | 'PENDING_EMAIL_VERIFICATION' | 'DELETED';
export type UserStatus = 'ACTIVE' | 'PENDING_EMAIL_VERIFICATION' | 'DELETED';
export type DashboardSelection = 'ME' | 'TEAM';
export type DashboardViewType = 'PROJECT' | 'BILLABILITY';

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

export type SummaryReportSettings = {
	group: string;
	subgroup: string;
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
