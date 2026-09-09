const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');

function createIntegration(isTracking = false) {
	const calls = { errors: [], warnings: [], starts: [], updates: 0 };
	const Tracking = {
		isTracking,
		update: async () => calls.updates++,
		start: async (...args) => calls.starts.push(args),
	};
	const source = fs.readFileSync(path.join(root, 'src/integrations/atlassian.ts'), 'utf8');
	const output = ts.transpileModule(source, {
		compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
	}).outputText;
	const loadedModule = { exports: {} };
	const dependencies = {
		vscode: {
			window: {
				showErrorMessage: (message) => calls.errors.push(message),
				showWarningMessage: (message) => calls.warnings.push(message),
			},
		},
		'../helpers/tracking': { Tracking },
	};
	new Function('require', 'module', 'exports', output)(
		(specifier) => dependencies[specifier],
		loadedModule,
		loadedModule.exports
	);
	return { ...loadedModule.exports, calls };
}

describe('Atlassian Jira integration', () => {
	it('extracts descriptions from official Jira tree nodes', () => {
		const { getJiraIssueDescription } = createIntegration();

		assert.equal(
			getJiraIssueDescription({ issue: { key: ' TEST-42 ', summary: ' Fix the timer ' } }),
			'TEST-42: Fix the timer'
		);
		assert.equal(
			getJiraIssueDescription({ key: 'TEST-43', summary: 'Flat command context' }),
			'TEST-43: Flat command context'
		);
		assert.equal(getJiraIssueDescription({ label: 'Not an issue' }), undefined);
	});

	it('starts an idle timer with the Jira issue description', async () => {
		const { startTrackingJiraIssue, calls } = createIntegration();

		await startTrackingJiraIssue({
			issue: { key: 'TEST-42', summary: 'Fix the timer' },
		});

		assert.equal(calls.updates, 1);
		assert.deepEqual(calls.starts, [['TEST-42: Fix the timer']]);
		assert.deepEqual(calls.warnings, []);
	});

	it('does not replace an existing timer or accept a non-issue node', async () => {
		const running = createIntegration(true);
		await running.startTrackingJiraIssue({
			issue: { key: 'TEST-42', summary: 'Fix the timer' },
		});
		assert.equal(running.calls.starts.length, 0);
		assert.equal(running.calls.warnings.length, 1);

		const invalid = createIntegration();
		await invalid.startTrackingJiraIssue({ label: 'Group' });
		assert.equal(invalid.calls.updates, 0);
		assert.deepEqual(invalid.calls.errors, [
			'The selected Atlassian item does not contain a Jira issue.',
		]);
	});
});
