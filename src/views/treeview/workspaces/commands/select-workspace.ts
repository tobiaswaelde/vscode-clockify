import { Workspace } from './../../../../sdk/types';
import { GlobalState } from '../../../../util/global-state';
import { commands } from 'vscode';
import { Commands } from '../../../../config/commands';

export async function selectWorkspace(workspace: Workspace): Promise<void> {
	const currentWorkspace = GlobalState.get('selectedWorkspace') as Workspace | undefined;

	// skip if workspace is already selected
	if (currentWorkspace && currentWorkspace.id === workspace.id) {
		return;
	}

	if (workspace) {
		GlobalState.set('selectedWorkspace', workspace);
		//TODO refesh tree views
	}
}
