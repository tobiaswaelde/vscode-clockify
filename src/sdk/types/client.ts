export type Client = {
	id: string;
	workspaceId: string;
	name: string;
	email?: string;
	address?: string;
	archived?: boolean;
	note?: string;
};

export type ClientRequest = {
	name: string;
};
