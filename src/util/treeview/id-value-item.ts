import { Commands } from '../../config/commands';
import { sensify } from '../data';
import { FieldValueItem } from './field-value-item';

export class IdValueItem extends FieldValueItem {
	/**
	 * A tree item displaying an ID value
	 * @param contextValue The context value of the item
	 * @param value The ID
	 */
	constructor(public contextValue: string, value: string) {
		super(
			contextValue,
			{ name: 'ID', value: sensify(value), icon: 'bytes' },
			'Click to copy ID to clipboard',
			{
				title: 'copy-to-clipboard',
				tooltip: 'Copy to Clipboard',
				command: Commands.copyToClipboard,
				arguments: [value],
			}
		);
	}
}
