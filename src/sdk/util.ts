import { isCancel } from 'axios';
import * as vscode from 'vscode';

const lastNotifications = new Map<string, number>();

/** Identifies requests rejected during a Clockify API cooldown. */
export class RateLimitError extends Error {}

/**
 * Report API errors at most once per message per minute, ignoring cooldowns and cancellations.
 * @param {string} message The user-facing error description.
 * @param {unknown} error Optional underlying failure to log.
 * @returns {void} Nothing.
 */
export function showError(message: string, error?: unknown): void {
	if (error instanceof RateLimitError || isCancel(error)) {
		return;
	}

	const now = Date.now();
	for (const [text, notifiedAt] of lastNotifications) {
		if (now - notifiedAt >= 60000) {
			lastNotifications.delete(text);
		}
	}
	if (lastNotifications.has(message)) {
		return;
	}
	lastNotifications.set(message, now);
	vscode.window.showErrorMessage(message);

	if (error) {
		console.error(message, error);
	}
}
