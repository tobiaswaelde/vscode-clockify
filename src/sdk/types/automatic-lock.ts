import { Weekday } from './weekday';

export type AutomaticLockPeriod = 'DAYS' | 'WEEKS' | 'MONTHS';
export type AutomaticLockType = 'WEEKLY' | 'MONTHLY' | 'OLDER_THAN';

export type AutomaticLock = {
	changeDay: Weekday;
	dayOfMonth: number;
	firstDay: Weekday;
	olderThanPeriod: AutomaticLockPeriod;
	olderThanValue: number;
	type: AutomaticLockType;
};
