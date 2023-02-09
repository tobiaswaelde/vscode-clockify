import { AutomaticLock } from './automatic-lock';
import { HourlyRate } from './hourly-rate';
import { Membership } from './membership';

export type AdminOnlyPages = 'PROJECT' | 'TEAM' | 'REPORTS';

export type Round = {
	minutes: string;
	round: string;
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
