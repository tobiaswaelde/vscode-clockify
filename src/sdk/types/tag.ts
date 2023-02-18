export type Tag = {
	id: string;
	name: string;
	workspaceId: string;
	archived: boolean;
};

export type TagId = {
	id: string;
};

export type TagRequest = {
	name: string;
	archived?: boolean;
};
