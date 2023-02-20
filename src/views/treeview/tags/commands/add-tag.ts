import { window } from 'vscode';
import { TreeView } from '../..';
import { Clockify } from '../../../../sdk';
import { Workspace } from '../../../../sdk/types/workspace';
import { Dialogs } from '../../../../util/dialogs';
import { GlobalState } from '../../../../util/global-state';

export async function addTag(): Promise<void> {
	// get workspace
	const workspace =
		GlobalState.get<Workspace>('selectedWorkspace') || (await Dialogs.selectWorkspace());
	if (!workspace) {
		return;
	}

	// get name
	const name = await Dialogs.getTagName();
	if (!name) {
		return;
	}

	// add tag
	const tag = await Clockify.addTag(workspace.id, { name });
	if (tag) {
		TreeView.refreshTags();
		window.showInformationMessage(`Tag '${tag.name}' added.`);
	}
}
