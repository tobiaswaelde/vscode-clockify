import { HourlyRate, HourlyRateRequest } from './hourly-rate';

export type MembershipStatus = 'PENDING' | 'ACTIVE' | 'DECLINED' | 'INACTIVE';

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
