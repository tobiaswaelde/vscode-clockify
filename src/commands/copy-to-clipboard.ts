import { env } from 'vscode';

/**
 * Copy the given value to the clipboard
 * @param {string} value The value to copy to the clipboard
 */
export async function copyToClipboard(value: string) {
	await env.clipboard.writeText(value);
}
