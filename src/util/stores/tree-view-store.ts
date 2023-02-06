import { TreeView } from 'vscode';

/**
 * Handles stored tree views
 */
export class TreeViewStore {
	/** The store of tree views */
	static store = new Map<string, TreeView<any>>();

	/**
	 * Get tree view from the store
	 * @param name The name of the tree view
	 * @returns The tree view
	 */
	public static get<T>(name: string): TreeView<T> {
		return this.store.get(name)!;
	}

	/**
	 * Set tree view in the store
	 * @param name The name of the tree view
	 * @param value The tree view
	 */
	public static set<T>(name: string, value: TreeView<T>): void {
		this.store.set(name, value);
	}
}
