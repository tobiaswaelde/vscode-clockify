export type TrackingWorkspaceSettings = {
	canSeeTimeSheet: boolean;
	forceProjects: boolean;
};

export function requiresProject(settings: TrackingWorkspaceSettings): boolean {
	return settings.canSeeTimeSheet || settings.forceProjects;
}
