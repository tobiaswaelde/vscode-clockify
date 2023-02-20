import { window } from 'vscode';
import { Workspace } from './../../../../sdk/types/workspace';
import { TagItem } from '../items/item';
import { GlobalState } from '../../../../util/global-state';
import { showError } from '../../../../sdk/util';
import { Dialogs } from '../../../../util/dialogs';
import { Clockify } from '../../../../sdk';
import { TreeView } from '../..';

export async function deleteTag(element: TagItem): Promise<void> {
	// check if workspace exists
	const workspace = GlobalState.get<Workspace>('selectedWorkspace');
	if (!workspace || !element.tag) {
		return showError('No workspace selected.');
	}

	// ask the user if he really wants to delete the tag
	const res = await Dialogs.askForConfirmation('Do you really want to delete the selected tag?');
	if (res !== 'Yes') {
		return;
	}

	// delete tag
	const deletedTag = await Clockify.deleteTag(workspace.id, element.tag.id);
	if (deletedTag) {
		window.showInformationMessage(`Tag '${deletedTag.name}' deleted.`);
		TreeView.refreshTags();
	}
}
