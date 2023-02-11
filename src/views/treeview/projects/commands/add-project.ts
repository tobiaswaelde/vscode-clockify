import { Workspace } from '../../../../sdk/types/workspace';
import { GlobalState } from '../../../../util/global-state';

export async function addProject(): Promise<void> {
	// check if workspace exists
	const workspace = GlobalState.get<Workspace>('selectedWorkspace');
}
