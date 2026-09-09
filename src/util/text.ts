/**
 * Convert text to a single line for compact VS Code UI elements.
 */
export function toSingleLine(value: string): string {
	return value.replace(/[\r\n]+/g, ' ');
}
