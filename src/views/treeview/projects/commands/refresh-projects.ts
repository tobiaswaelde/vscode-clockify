import { ProjectsProvider } from '..';
import { ProviderStore } from '../../../../util/stores/provider-store';
import { ProjectItem } from '../items/item';

export function refreshProjects(element?: ProjectItem): void {
	const projectsProvider = ProviderStore.get<ProjectsProvider>('projects');
	projectsProvider.refresh(element);
}
