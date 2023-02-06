import { IconType } from '../types/icon-type';
import { getFilePath } from './fs';

/**
 * Get the path(s) to the given icon
 * @param name The name of the icon
 * @param darkName The name of the icon for dark mode if other than light
 * @returns The icon paths or `undefined` if the input name is undefined
 */
export function getIconPath(name?: string, darkName?: string) {
	if (!name) {
		return undefined;
	}

	const lightIconPath = getFilePath('assets', 'icons', 'light', `${name}.svg`);
	const darkIconPath = getFilePath('assets', 'icons', 'dark', `${darkName ?? name}.svg`);

	return {
		light: lightIconPath,
		dark: darkIconPath,
	};
}

/**
 * Get the icon path for a specific value type
 * @param type The type of the value
 * @returns The path to the icon
 */
export function getValueTypeIconPath(type: IconType) {
	return getFilePath('assets', 'icons', 'valuetypes', `${type}.svg`);
}
