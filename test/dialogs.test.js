const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');

function loadDialogs({ quickPicks = [], inputs = [], api = {} } = {}) {
	const calls = { quickPicks: [], api: [], commands: [], information: [] };
	const output = ts.transpileModule(
		fs.readFileSync(path.join(root, 'src/util/dialogs.ts'), 'utf8'),
		{
			compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
		}
	).outputText;
	const loadedModule = { exports: {} };
	const Clockify = new Proxy(api, {
		get(target, property) {
			if (property in target) {
				return target[property];
			}
			return async (...args) => {
				calls.api.push([property, ...args]);
				return [];
			};
		},
	});
	const dependencies = {
		vscode: {
			commands: {
				executeCommand: async (command) => calls.commands.push(command),
			},
			window: {
				showErrorMessage: async () => undefined,
				showInformationMessage: (message) => calls.information.push(message),
				showInputBox: async () => inputs.shift(),
				showQuickPick: async (items) => {
					calls.quickPicks.push(items);
					const selection = quickPicks.shift();
					return typeof selection === 'string'
						? items.find((item) =>
								typeof item === 'string'
									? item === selection
									: item.id === selection || item.label === selection
							  )
						: selection;
				},
			},
		},
		'../config/colors': { PROJECT_COLORS: [{ name: 'Blue', value: '#03A9F4' }] },
		'../config/commands': {
			Commands: {
				workspacesRefresh: 'workspaces.refresh',
				clientsRefresh: 'clients.refresh',
				projectsRefresh: 'projects.refresh',
				tasksRefresh: 'tasks.refresh',
			},
		},
		'../sdk': { Clockify },
	};
	new Function('require', 'module', 'exports', output)(
		(specifier) => dependencies[specifier],
		loadedModule,
		loadedModule.exports
	);
	return { Dialogs: loadedModule.exports.Dialogs, calls };
}

describe('add actions in selection quick picks', () => {
	it('creates and returns a workspace from the workspace picker', async () => {
		const workspace = { id: 'workspace-2', name: 'New workspace' };
		const { Dialogs, calls } = loadDialogs({
			quickPicks: ['__clockify_add__'],
			inputs: ['  New workspace  '],
			api: {
				getWorkspaces: async () => [{ id: 'workspace-1', name: 'Existing' }],
				addWorkspace: async (...args) => {
					calls.api.push(['addWorkspace', ...args]);
					return workspace;
				},
			},
		});

		assert.equal(await Dialogs.selectWorkspace(), workspace);
		assert.equal(calls.quickPicks[0].at(-1).label, '$(add) Add Workspace');
		assert.deepEqual(calls.api, [['addWorkspace', { name: 'New workspace' }]]);
		assert.deepEqual(calls.commands, ['workspaces.refresh']);
	});

	it('keeps No Client first and creates a client from the final add action', async () => {
		const client = { id: 'client-2', name: 'New client' };
		const { Dialogs, calls } = loadDialogs({
			quickPicks: ['__clockify_add__'],
			inputs: ['New client'],
			api: {
				getClients: async () => [{ id: 'client-1', name: 'Existing' }],
				addClient: async (...args) => {
					calls.api.push(['addClient', ...args]);
					return client;
				},
			},
		});

		assert.equal(await Dialogs.selectClient('workspace-1', true), client);
		assert.equal(calls.quickPicks[0][0].label, 'No Client');
		assert.equal(calls.quickPicks[0].at(-1).label, '$(add) Add Client');
		assert.deepEqual(calls.api, [
			['addClient', 'workspace-1', { name: 'New client' }],
		]);
	});

	it('creates a fully configured project from the project picker', async () => {
		const project = { id: 'project-2', name: 'New project' };
		const { Dialogs, calls } = loadDialogs({
			quickPicks: [
				'__clockify_add__',
				'none',
				'Blue',
				'Private',
				'Non-billable',
			],
			inputs: ['New project'],
			api: {
				getProjects: async () => [],
				getClients: async () => [],
				addProject: async (...args) => {
					calls.api.push(['addProject', ...args]);
					return project;
				},
			},
		});

		assert.equal(await Dialogs.selectProject('workspace-1'), project);
		assert.deepEqual(calls.api, [
			[
				'addProject',
				'workspace-1',
				{
					clientId: undefined,
					name: 'New project',
					color: '#03A9F4',
					isPublic: false,
					billable: false,
				},
			],
		]);
		assert.deepEqual(calls.commands, ['projects.refresh']);
	});

	it('creates a task from the task picker and returns undefined when creation is cancelled', async () => {
		const task = { id: 'task-2', name: 'New task' };
		const created = loadDialogs({
			quickPicks: ['__clockify_add__'],
			inputs: ['New task'],
			api: {
				getTasks: async () => [],
				addTask: async (...args) => {
					created.calls.api.push(['addTask', ...args]);
					return task;
				},
			},
		});
		assert.equal(await created.Dialogs.selectTask('workspace-1', 'project-1'), task);
		assert.deepEqual(created.calls.api, [
			['addTask', 'workspace-1', 'project-1', { name: 'New task' }],
		]);

		const cancelled = loadDialogs({
			quickPicks: ['__clockify_add__'],
			inputs: ['   '],
			api: { getTasks: async () => [] },
		});
		assert.equal(
			await cancelled.Dialogs.selectTask('workspace-1', 'project-1'),
			undefined
		);
		assert.deepEqual(cancelled.calls.api, []);
	});
});
