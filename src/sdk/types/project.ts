import { Estimate, EstimateRequest } from './estimate';
import { HourlyRate, HourlyRateRequest } from './hourly-rate';
import { Membership, MembershipRequest } from './membership';
import { TaskRequest } from './task';

export type Project = {
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
	clientId?: string;
	isPublic: boolean;
	estimate?: EstimateRequest;
	color: string;
	billable: boolean;
	hourlyRate?: HourlyRateRequest;
	memberships?: MembershipRequest[];
	tasks?: TaskRequest[];
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
