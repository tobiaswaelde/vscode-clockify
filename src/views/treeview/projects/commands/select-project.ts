import { Project } from '../../../../sdk/types/project';
import { GlobalState } from '../../../../util/global-state';
import { refreshProjects } from './refresh-projects';

export async function selectProject(project: Project): Promise<void> {
	const selectedProject = GlobalState.get('selectedProject') as Project | undefined;

	// skip if current project is already selected
	if (selectedProject && selectedProject.id === project.id) {
		return;
	}

	if (project) {
		GlobalState.set('selectedProject', project);
		//TODO refresh tree views
	}
}
