import * as vscode from 'vscode';
import { TagQuickPickItem } from '../interfaces/customInterfaces';
import { getTags } from '../api/actions/tag';

export async function selectTags(workspaceId: string, throwError = true): Promise<string[]> {
	const tags = await getTags(workspaceId);

	let tagItems: TagQuickPickItem[] = [];
	tags.forEach((tag) => {
		let item = {
			label: tag.name,
			id: tag.id
		};
		tagItems.push(item);
	});

	// Select Tags
	const tagIds = await vscode.window
		.showQuickPick(tagItems, {
			ignoreFocusOut: true,
			placeHolder: 'Select Tags',
			canPickMany: true
		})
		.then((tags) => {
			if (tags === undefined) {
				if (throwError) {
					throw new Error('No tags selected');
				} else {
					return [];
				}
			}
			let result: string[] = [];
			tags.forEach((tag) => {
				result.push(tag.id);
			});
			return result;
		});

	return tagIds;
}
