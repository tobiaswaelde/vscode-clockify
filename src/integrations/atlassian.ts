import { window } from 'vscode';
import { Tracking } from '../helpers/tracking';

interface JiraIssue {
	key?: unknown;
	summary?: unknown;
}

function asJiraIssue(value: unknown): JiraIssue | undefined {
	return typeof value === 'object' && value !== null ? (value as JiraIssue) : undefined;
}

export function getJiraIssueDescription(context: unknown): string | undefined {
	const node = asJiraIssue(context);
	const issue = asJiraIssue(node && 'issue' in node ? node.issue : node);
	const key = typeof issue?.key === 'string' ? issue.key.trim() : '';
	const summary = typeof issue?.summary === 'string' ? issue.summary.trim() : '';
	if (!key || !summary) {
		return undefined;
	}

	return `${key}: ${summary}`;
}

export async function startTrackingJiraIssue(context: unknown): Promise<void> {
	const description = getJiraIssueDescription(context);
	if (!description) {
		window.showErrorMessage('The selected Atlassian item does not contain a Jira issue.');
		return;
	}

	await Tracking.update();
	if (Tracking.isTracking) {
		window.showWarningMessage('A Clockify timer is already running. Stop it before starting Jira work.');
		return;
	}

	await Tracking.start(description);
}
