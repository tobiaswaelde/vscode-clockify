import { TreeDataProvider, window } from 'vscode';
import { ProviderStore } from './provider-store';
import { TreeViewStore } from './tree-view-store';

/**
 * Create a tree view for the given provider and stores both in the corresponding stores.
 * @param name The name of the provider
 * @param provider The provider
 */
export function registerProvider<T>(name: string, provider: TreeDataProvider<T>) {
	// create tree view
	const viewId = `clockify-${name}`;
	const treeView = window.createTreeView(viewId, {
		treeDataProvider: provider,
	});

	// register values in stores
	TreeViewStore.set(name, treeView);
	ProviderStore.set(name, provider);
}
