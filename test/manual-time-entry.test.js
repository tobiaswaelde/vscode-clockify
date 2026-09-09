const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');

function loadTypeScriptModule(relativePath, dependencies) {
	const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
	const output = ts.transpileModule(source, {
		compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
	}).outputText;
	const loadedModule = { exports: {} };
	new Function('require', 'module', 'exports', output)(
		(specifier) => dependencies[specifier],
		loadedModule,
		loadedModule.exports
	);
	return loadedModule.exports;
}

function createCommand(options = {}) {
	const calls = { api: [], errors: [], information: [], refreshes: 0 };
	const workspace = {
		id: 'workspace-1',
		workspaceSettings: {
			canSeeTimeSheet: false,
			forceProjects: false,
			forceTasks: false,
			forceTags: false,
			forceDescription: false,
			...options.workspaceSettings,
		},
	};
	const project = options.project === undefined ? { id: 'project-1' } : options.project;
	const dialogs = {
		selectWorkspace: async () => workspace,
		selectProject: async () => project,
		selectTask: async () => ({ id: 'task-1' }),
		selectTags: async () => [{ id: 'tag-1' }],
		getDescription: async () => '  Worked on it  ',
		getDateTime: async (title) =>
			title.endsWith('Start') ? '2026-09-09 09:00' : '2026-09-09 10:30',
		getBillable: async () => true,
		...options.dialogs,
	};
	const { formatLocalDateTime, parseLocalDateTime } = loadTypeScriptModule(
		'src/util/date-time.ts',
		{}
	);
	const { requiresProject } = loadTypeScriptModule(
		'src/helpers/tracking-requirements.ts',
		{}
	);
	const dependencies = {
		vscode: {
			window: {
				showErrorMessage: (message) => calls.errors.push(message),
				showInformationMessage: (message) => calls.information.push(message),
			},
		},
		'../../../../sdk': {
			Clockify: {
				addTimeEntry: async (...args) => {
					calls.api.push(args);
					return options.apiResult === undefined ? { id: 'entry-1' } : options.apiResult;
				},
			},
		},
		'../../../../helpers/tracking-requirements': { requiresProject },
		'../../../../util/config': { Config: { get: () => false } },
		'../../../../util/date-time': { formatLocalDateTime, parseLocalDateTime },
		'../../../../util/dialogs': { Dialogs: dialogs },
		'../../../../util/global-state': {
			GlobalState: {
				get: (key) => (key === 'selectedWorkspace' ? workspace : project),
			},
		},
		'../..': { TreeView: { refreshTimeentries: () => calls.refreshes++ } },
	};
	const { addTimeEntry } = loadTypeScriptModule(
		'src/views/treeview/timeentries/commands/add-time-entry.ts',
		dependencies
	);
	return { addTimeEntry, calls };
}

describe('manual time entry command', () => {
	it('submits a completed entry and refreshes the view', async () => {
		const { addTimeEntry, calls } = createCommand();

		await addTimeEntry();

		assert.deepEqual(calls.api, [
			[
				'workspace-1',
				{
					start: new Date(2026, 8, 9, 9, 0).toISOString(),
					end: new Date(2026, 8, 9, 10, 30).toISOString(),
					description: 'Worked on it',
					projectId: 'project-1',
					taskId: 'task-1',
					tagIds: ['tag-1'],
					billable: true,
				},
			],
		]);
		assert.equal(calls.refreshes, 1);
		assert.deepEqual(calls.information, ['Manual time entry added.']);
	});

	it('rejects an end time that is not after the start time', async () => {
		const { addTimeEntry, calls } = createCommand({
			dialogs: { getDateTime: async () => '2026-09-09 09:00' },
		});

		await addTimeEntry();

		assert.deepEqual(calls.errors, ['End time must be after start time.']);
		assert.equal(calls.api.length, 0);
	});

	it('enforces a required description before calling the API', async () => {
		const { addTimeEntry, calls } = createCommand({
			workspaceSettings: { forceDescription: true },
			dialogs: { getDescription: async () => '   ' },
		});

		await addTimeEntry();

		assert.deepEqual(calls.errors, ['A description is required in this workspace.']);
		assert.equal(calls.api.length, 0);
	});

	it('does not report success when the API request fails', async () => {
		const { addTimeEntry, calls } = createCommand({ apiResult: null });

		await addTimeEntry();

		assert.equal(calls.api.length, 1);
		assert.equal(calls.refreshes, 0);
		assert.deepEqual(calls.information, []);
	});
});
