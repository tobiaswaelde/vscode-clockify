export type EstimateType = 'AUTO' | 'MANUAL';

export type Estimate = {
	estimate: string;
	type: EstimateType;
};

export type EstimateRequest = {
	estimate: number;
	type: string;
};
