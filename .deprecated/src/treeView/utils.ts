import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { treeViewStore, providerStore } from './stores';

let _context: vscode.ExtensionContext;

export function messageTreeItem(
	msg: string,
	tooltip?: string,
	icon?: 'info' | 'alert',
	command?: vscode.Command
): any {
	const item = new vscode.TreeItem('', vscode.TreeItemCollapsibleState.None);
	item.tooltip = tooltip;
	item.description = msg;
	if (icon) {
		item.iconPath = {
			light: getFilePath('assets', 'light', `${icon}.svg`),
			dark: getFilePath('assets', 'dark', `${icon}.svg`)
		};
	} else {
		item.iconPath = undefined;
	}
	if (command) {
		item.command = command;
	}
	return item;
}

export function getFullPath(parentPath: string, name: string) {
	return [parentPath, name].filter(Boolean).join('/');
}
export function getFilePath(...filenameParts: string[]): string {
	// return getContext().asAbsolutePath(path.join(...filenameParts));
	return getContext().asAbsolutePath(path.join(...filenameParts));
}

export enum ContextValue {
	WorkspaceSelected = 'workspaces:selected',
	ClientSelected = 'clients:selected',
	ProjectSelected = 'projects:selected'
}

export function setContext(key: ContextValue, value: any): void {
	vscode.commands.executeCommand('setContext', 'clockify:' + key, value);
}
export function setContextObject(context: vscode.ExtensionContext) {
	_context = context;
}
export function getContext(): vscode.ExtensionContext {
	return _context;
}

export type FieldValue = {
	name: string;
	value: any;
};
export enum IconType {
	Array = 'array',
	Boolean = 'boolean',
	Bytes = 'bytes',
	Geopoint = 'geopoint',
	Map = 'map',
	Null = 'null',
	Number = 'number',
	Reference = 'reference',
	String = 'string',
	StringA = 'string-A',
	StringAbc = 'string-abc',
	Timestamp = 'timestamp'
}

export function createColorSvg(color: string) {
	try {
		// const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="${color}" /></svg>`;
		const svg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.4 20H2.63058C2.33058 20 2.03058 19.7 2.03058 19.4V0.600006C2.03058 0.300006 2.33058 0 2.63058 0H13.9C14.2 0 14.2741 0.0442007 14.3972 0.18629C14.4639 0.263199 14.5254 0.309343 14.6 0.399994L17.6 3.19998C17.7 3.29998 17.7 3.29999 17.8 3.39999C17.9 3.49999 18 3.69999 18 3.89999V19.4C18 19.7 17.7 20 17.4 20ZM14 0.899994V4H16.9L14 0.899994ZM17 4.89999H13.9C13.3 4.89999 13 4.49999 13 3.89999V0.899994H3.03058V19H17V4.89999ZM5.53058 4H10.5C10.8 4 11 4.2 11 4.5C11 4.8 10.8 5 10.5 5H5.53058C5.23058 5 5.03058 4.8 5.03058 4.5C5.03058 4.2 5.23058 4 5.53058 4ZM5.53058 7H14.5C14.8 7 15 7.2 15 7.5C15 7.8 14.8 8 14.5 8H5.53058C5.23058 8 5.03058 7.8 5.03058 7.5C5.03058 7.2 5.23058 7 5.53058 7ZM5.53058 10H14.5C14.8 10 15 10.2 15 10.5C15 10.8 14.8 11 14.5 11H5.53058C5.23058 11 5.03058 10.8 5.03058 10.5C5.03058 10.2 5.23058 10 5.53058 10ZM5.53058 13H14.5C14.8 13 15 13.2 15 13.5C15 13.8 14.8 14 14.5 14H5.53058C5.23058 14 5.03058 13.8 5.03058 13.5C5.03058 13.2 5.23058 13 5.53058 13ZM5.53058 16H14.5C14.8 16 15 16.2 15 16.5C15 16.8 14.8 17 14.5 17H5.53058C5.23058 17 5.03058 16.8 5.03058 16.5C5.03058 16.2 5.23058 16 5.53058 16Z" fill="${color}"/></svg>`;
		const filePath = getContext().asAbsolutePath(path.join('assets', 'colors', `${color}.svg`));
		// const filePath2 = getContext().asAbsolutePath(path.join('assets', 'colors', `_${color}.svg`));
		fs.writeFileSync(filePath, svg);
		// fs.writeFileSync(filePath2, svg2);
	} catch (err) {
		console.error(err);
	}
}

export function registerProvider<T>(name: string, provider: vscode.TreeDataProvider<T>) {
	const treeView = vscode.window.createTreeView(`clockify-${name}`, {
		treeDataProvider: provider
	});
	treeViewStore.add(name, treeView);
	providerStore.add(name, provider);
}
