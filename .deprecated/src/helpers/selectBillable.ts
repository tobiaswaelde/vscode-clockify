import * as vscode from 'vscode';

export async function selectBillable(throwError = true): Promise<boolean> {
	const billable = await vscode.window
		.showQuickPick(['Billable', 'Non-billable'], {
			ignoreFocusOut: true,
			placeHolder: 'Billable?'
		})
		.then((billable) => {
			if (billable === undefined) {
				if (throwError) {
					throw new Error('No billable type selected');
				} else {
					return false;
				}
			}
			return billable === 'Billable';
		});

	return billable;
}
