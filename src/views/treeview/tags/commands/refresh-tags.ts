import { TagsProvider } from '..';
import { ProviderStore } from '../../../../util/stores/provider-store';
import { TagItem } from '../items/item';

export function refreshTags(element?: TagItem): void {
	const tagsProvider = ProviderStore.get<TagsProvider>('tags');
	tagsProvider.refresh(element);
}
