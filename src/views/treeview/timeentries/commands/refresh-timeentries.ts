import { TimeentriesProvider } from '..';
import { ProviderStore } from '../../../../util/stores/provider-store';
import { TimeentryItem } from '../items/item';

export function refreshTimeentries(element?: TimeentryItem): void {
	const timeentriesProvider = ProviderStore.get<TimeentriesProvider>('timeentries');
	timeentriesProvider.refresh(element);
}
