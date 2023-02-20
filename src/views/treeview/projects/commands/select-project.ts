import { TreeView } from '../..';
import { Project } from '../../../../sdk/types/project';
import { GlobalState } from '../../../../util/global-state';

export async function selectProject(project?: Project): Promise<void> {
	const selectedProject = GlobalState.get<Project>('selectedProject');

	// skip if current project is already selected
	if (selectedProject && selectedProject.id === project?.id) {
		GlobalState.set('selectedProject', null);
	} else {
		GlobalState.set('selectedProject', project);
	}

	// refresh tree views
	TreeView.refreshProjects();
	TreeView.refreshTasks();
	TreeView.refreshTimeentries();
}
