import { window } from 'vscode';
import { Clockify } from './../../../../sdk/index';
import { Workspace } from './../../../../sdk/types/workspace';
import { showError } from '../../../../sdk/util';
import { GlobalState } from '../../../../util/global-state';
import { TagItem } from '../items/item';
import { Dialogs } from '../../../../util/dialogs';
import { TreeView } from '../..';

export async function renameTag(element: TagItem): Promise<void> {
	// check if workspace exists
	const workspace = GlobalState.get<Workspace>('selectedWorkspace');
	if (!workspace) {
		return showError('No workspace selected.');
	}

	// get the new name of the tag
	const name = await Dialogs.getTagName(element.tag.name);
	if (!name) {
		return;
	}

	// update tag
	const updatedTag = await Clockify.updateTag(workspace.id, element.tag.id, { name });
	if (updatedTag) {
		window.showInformationMessage('Tag updated.');
		TreeView.refreshTags();
	}
}
