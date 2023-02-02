import * as vscode from 'vscode';
import { PROJECT_COLORS } from '../../../config/constants';
import { ColorQuickPickItem } from '../../../interfaces/customInterfaces';

export async function selectColor(): Promise<string> {
	const colors = PROJECT_COLORS;

	let colorItems: ColorQuickPickItem[] = [];
	colors.forEach((color) => {
		let item: ColorQuickPickItem = {
			label: color.name,
			value: color.value
		};
		colorItems.push(item);
	});

	// Select color
	const color = await vscode.window
		.showQuickPick(colorItems, { ignoreFocusOut: true, placeHolder: 'Select color' })
		.then((color) => {
			if (color === undefined) {
				throw new Error();
			}
			return color.value;
		});

	return color;
}
