import { IconType } from '../types/icon-type';
import { getFilePath } from './fs';
import * as fs from 'fs';

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

/**
 * Get colored project icon
 * @param color The color
 * @returns The path to the icon
 */
export function getColoredProjectIcon(color: string): string {
	const svg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.4 20H2.63058C2.33058 20 2.03058 19.7 2.03058 19.4V0.600006C2.03058 0.300006 2.33058 0 2.63058 0H13.9C14.2 0 14.2741 0.0442007 14.3972 0.18629C14.4639 0.263199 14.5254 0.309343 14.6 0.399994L17.6 3.19998C17.7 3.29998 17.7 3.29999 17.8 3.39999C17.9 3.49999 18 3.69999 18 3.89999V19.4C18 19.7 17.7 20 17.4 20ZM14 0.899994V4H16.9L14 0.899994ZM17 4.89999H13.9C13.3 4.89999 13 4.49999 13 3.89999V0.899994H3.03058V19H17V4.89999ZM5.53058 4H10.5C10.8 4 11 4.2 11 4.5C11 4.8 10.8 5 10.5 5H5.53058C5.23058 5 5.03058 4.8 5.03058 4.5C5.03058 4.2 5.23058 4 5.53058 4ZM5.53058 7H14.5C14.8 7 15 7.2 15 7.5C15 7.8 14.8 8 14.5 8H5.53058C5.23058 8 5.03058 7.8 5.03058 7.5C5.03058 7.2 5.23058 7 5.53058 7ZM5.53058 10H14.5C14.8 10 15 10.2 15 10.5C15 10.8 14.8 11 14.5 11H5.53058C5.23058 11 5.03058 10.8 5.03058 10.5C5.03058 10.2 5.23058 10 5.53058 10ZM5.53058 13H14.5C14.8 13 15 13.2 15 13.5C15 13.8 14.8 14 14.5 14H5.53058C5.23058 14 5.03058 13.8 5.03058 13.5C5.03058 13.2 5.23058 13 5.53058 13ZM5.53058 16H14.5C14.8 16 15 16.2 15 16.5C15 16.8 14.8 17 14.5 17H5.53058C5.23058 17 5.03058 16.8 5.03058 16.5C5.03058 16.2 5.23058 16 5.53058 16Z" fill="${color}"/></svg>`;

	const filePath = getFilePath('assets', 'icons', 'colors', `${color}.svg`);

	if (!fs.existsSync(filePath)) {
		fs.writeFileSync(filePath, svg);
		return filePath;
	} else {
		return filePath;
	}
}
