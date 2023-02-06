import { TreeDataProvider } from 'vscode';

/**
 * Handles stores tree data providers
 */
export class ProviderStore {
	/** The store of tree data providers */
	static store = new Map<string, TreeDataProvider<any>>();

	/**
	 * Get tree data provider from store
	 * @param name The name of the tree data provider
	 * @returns The tree data provider
	 */
	public static get<T>(name: string): T {
		return this.store.get(name) as T;
	}

	/**
	 * Set tree data provider in the store
	 * @param name The name of the tree data provider
	 * @param value The tree data provider
	 */
	public static set<T>(name: string, value: TreeDataProvider<T>): void {
		this.store.set(name, value);
	}
}
