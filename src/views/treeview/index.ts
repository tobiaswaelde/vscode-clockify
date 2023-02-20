import { ProviderStore } from '../../util/stores/provider-store';
import { ClientsProvider } from './clients';
import { ClientItem } from './clients/items/item';
import { ProjectsProvider } from './projects';
import { ProjectItem } from './projects/items/item';
import { TagsProvider } from './tags';
import { TagItem } from './tags/items/item';
import { TasksProvider } from './tasks';
import { TaskItem } from './tasks/items/item';
import { TimeentriesProvider } from './timeentries';
import { TimeentryItem } from './timeentries/items/item';
import { WorkspacesProvider } from './workspaces';
import { WorkspaceItem } from './workspaces/items/item';

export class TreeView {
	public static refresh() {
		this.refreshWorkspaces();
		this.refreshClients();
		this.refreshProjects();
		this.refreshTasks();
		this.refreshTags();
		this.refreshTimeentries();
	}

	public static refreshWorkspaces(element?: WorkspaceItem): void {
		const workspacesProvider = ProviderStore.get<WorkspacesProvider>('workspaces');
		workspacesProvider.refresh(element);
		this.refreshClients();
		this.refreshProjects();
		this.refreshTasks();
		this.refreshTags();
		this.refreshTimeentries();
	}

	public static refreshClients(element?: ClientItem) {
		const clientsProvider = ProviderStore.get<ClientsProvider>('clients');
		clientsProvider.refresh(element);
		this.refreshProjects();
	}

	public static refreshProjects(element?: ProjectItem) {
		const projectsProvider = ProviderStore.get<ProjectsProvider>('projects');
		projectsProvider.refresh(element);
	}

	public static refreshTasks(element?: TaskItem) {
		const tasksProvider = ProviderStore.get<TasksProvider>('tasks');
		tasksProvider.refresh(element);
	}

	public static refreshTags(element?: TagItem) {
		const tagsProvider = ProviderStore.get<TagsProvider>('tags');
		tagsProvider.refresh(element);
	}

	public static refreshTimeentries(element?: TimeentryItem) {
		const timeentriesProvider = ProviderStore.get<TimeentriesProvider>('timeentries');
		timeentriesProvider.refresh(element);
	}
}
