import { window } from 'vscode';
import { TreeView } from '../..';
import { Clockify } from '../../../../sdk';
import { Workspace } from '../../../../sdk/types/workspace';
import { showError } from '../../../../sdk/util';
import { GlobalState } from '../../../../util/global-state';
import { TagItem } from '../items/item';

export async function archiveTag(element: TagItem, archived?: boolean): Promise<void> {
	// check if workspace exists
	const workspace = GlobalState.get<Workspace>('selectedWorkspace');
	if (!workspace || !element.tag) {
		return showError('No workspace selected.');
	}

	// archive tag
	const updatedTag = await Clockify.updateTag(workspace.id, element.tag.id, {
		name: element.tag.name,
		archived: archived === undefined ? true : archived,
	});
	if (updatedTag) {
		window.showInformationMessage(
			`Tag '${updatedTag.name}' ${updatedTag.archived ? 'archived' : 'unarchived'}.`
		);
		TreeView.refreshTags();
	}
}
