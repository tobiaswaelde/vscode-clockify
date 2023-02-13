import { Project } from '../../../../sdk/types/project';
import { GlobalState } from '../../../../util/global-state';
import { refreshTasks } from '../../tasks/commands/refresh-tasks';
import { refreshProjects } from './refresh-projects';

export async function selectProject(project?: Project): Promise<void> {
	const selectedProject = GlobalState.get<Project>('selectedProject');

	// skip if current project is already selected
	if (selectedProject && selectedProject.id === project?.id) {
		GlobalState.set('selectedProject', null);
	} else {
		GlobalState.set('selectedProject', project);
	}

	if (project) {
		GlobalState.set('selectedProject', project);
		//TODO refresh tree views
	}

	refreshProjects();
	refreshTasks();
}
