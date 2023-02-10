import { ProjectsProvider } from '..';
import { GlobalState } from '../../../../util/global-state';
import { ProviderStore } from '../../../../util/stores/provider-store';
import { ProjectItem } from '../items/item';

export function refreshProjects(element?: ProjectItem): void {
	GlobalState.set('selectedProject', null);

	const projectsProvider = ProviderStore.get<ProjectsProvider>('projects');
	projectsProvider.refresh(element);
}
