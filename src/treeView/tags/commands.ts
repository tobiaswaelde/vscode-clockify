import * as vscode from 'vscode';
import { TagItem, TagsProvider } from './tags.provider';
import { providerStore } from '../stores';
import { getContext } from '../utils';
import { WorkspaceDto, TagRequest } from '../../api/interfaces';
import { getTagName } from '../../helpers/tag/getTagName';
import { addTag as apiAddTag } from '../../api/actions/tag';

export function registerTagsCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.tags.add', addTag),
		vscode.commands.registerCommand('clockify.tags.refresh', refreshTags)
	);
}

async function addTag(): Promise<void> {
	// 1. Tag name
	try {
		const context = getContext();
		const workspace = context.globalState.get<WorkspaceDto>('selectedWorkspace');
		if (!workspace) {
			return;
		}

		let newTag: TagRequest = {} as TagRequest;

		const tagName = await getTagName();
		newTag.name = tagName;

		// Add Tag
		const tag = await apiAddTag(workspace.id, newTag);
		if (tag) {
			const tagsProvider = providerStore.get<TagsProvider>('tags');
			tagsProvider.refresh();

			await vscode.window.showInformationMessage(`Tag '${tag.name}' added`);
		}
	} catch (err) {
		console.error(err);
	}
}

function refreshTags(element?: TagItem): void {
	const tagsProvider = providerStore.get<TagsProvider>('tags');
	tagsProvider.refresh();
}
