import { TasksProvider } from '..';
import { ProviderStore } from '../../../../util/stores/provider-store';
import { TaskItem } from '../items/item';

export function refreshTasks(element?: TaskItem): void {
	const tasksProvider = ProviderStore.get<TasksProvider>('tasks');
	tasksProvider.refresh(element);
}
