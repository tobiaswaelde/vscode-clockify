import * as path from 'path';
import { Context } from './context';

export function getFullPath(parentPath: string, name: string) {
	const paths = [parentPath, name].filter(Boolean);
	return path.join(...paths);
}

/**
 * Gets the absolute path to a file
 * @param filenamePaths The relative paths to the file starting from the project root
 * @returns The absolute path to the file
 */
export function getFilePath(...filenamePaths: string[]): string {
	const ctx = Context.get();
	const relativePath = path.join(...filenamePaths);
	return ctx.asAbsolutePath(relativePath);
}
