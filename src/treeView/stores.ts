import * as vscode from 'vscode';

export abstract class Store<T> {
	abstract store: Map<string, T>;
	abstract get(name: string): T | undefined;
	abstract add(name: string, value: T): void;
}

class ProviderStore implements Store<vscode.TreeDataProvider<any>> {
	store = new Map<string, vscode.TreeDataProvider<any>>();

	get<P>(name: string): P {
		return (this.store.get(name) as unknown) as P;
	}

	add<P>(name: string, provider: vscode.TreeDataProvider<P>): void {
		this.store.set(name, provider);
	}
}

class TreeViewStore implements Store<vscode.TreeView<any>> {
	store = new Map<string, vscode.TreeView<any>>();

	get<P>(name: string): vscode.TreeView<P> {
		return this.store.get(name)!;
	}

	add<P>(name: string, provider: vscode.TreeView<P>): void {
		this.store.set(name, provider);
	}
}

export const providerStore = new ProviderStore();
export const treeViewStore = new TreeViewStore();
