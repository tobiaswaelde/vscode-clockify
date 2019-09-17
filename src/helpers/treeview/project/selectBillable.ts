import * as vscode from 'vscode';

export async function selectBillable(): Promise<boolean> {
	const billable = await vscode.window
		.showQuickPick(['Billable', 'Non-billable'], {
			ignoreFocusOut: true,
			placeHolder: 'Billable?'
		})
		.then((billable) => {
			if (billable === undefined) {
				throw new Error('No billable type selected');
			}
			return billable === 'Billable';
		});

	return billable;
}
