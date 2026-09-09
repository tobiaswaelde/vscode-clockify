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
	const requireDependency = (specifier) => dependencies[specifier];
	new Function('require', 'module', 'exports', output)(
		requireDependency,
		loadedModule,
		loadedModule.exports
	);
	return loadedModule.exports;
}

function createTaskCommand(commandName, options = {}) {
	const calls = { api: [], confirmations: [], errors: [], information: [], refreshes: [] };
	const workspace = options.workspace === undefined ? { id: 'workspace-1' } : options.workspace;
	const project = options.project === undefined ? { id: 'project-1' } : options.project;
	const apiMethod = commandName === 'rename-task' ? 'updateTask' : 'deleteTask';
	const dependencies = {
		vscode: {
			window: { showInformationMessage: (message) => calls.information.push(message) },
		},
		'../..': {
			TreeView: {
				refreshTasks: () => calls.refreshes.push('tasks'),
				refreshTimeentries: () => calls.refreshes.push('timeentries'),
			},
		},
		'../../../../sdk': {
			Clockify: {
				[apiMethod]: async (...args) => {
					calls.api.push(args);
					return options.apiResult;
				},
			},
		},
		'../../../../sdk/util': {
			showError: (message) => calls.errors.push(message),
		},
		'../../../../util/dialogs': {
			Dialogs: {
				getTaskName: async () => options.name,
				askForConfirmation: async (message) => {
					calls.confirmations.push(message);
					return options.confirmation;
				},
			},
		},
		'../../../../util/global-state': {
			GlobalState: {
				get: (key) => (key === 'selectedWorkspace' ? workspace : project),
			},
		},
	};
	const loaded = loadTypeScriptModule(
		`src/views/treeview/tasks/commands/${commandName}.ts`,
		dependencies
	);
	return { calls, command: loaded[commandName === 'rename-task' ? 'renameTask' : 'deleteTask'] };
}

describe('task rename command', () => {
	it('renames a task and refreshes dependent views', async () => {
		const { calls, command } = createTaskCommand('rename-task', {
			name: '  Renamed task  ',
			apiResult: { name: 'Renamed task' },
		});
		await command({ task: { id: 'task-1', name: 'Original task' } });

		assert.deepEqual(calls.api, [
			['workspace-1', 'project-1', 'task-1', { name: 'Renamed task' }],
		]);
		assert.deepEqual(calls.information, ["Task 'Renamed task' updated."]);
		assert.deepEqual(calls.refreshes, ['tasks', 'timeentries']);
	});

	it('does nothing when the name is empty or the API fails', async () => {
		const empty = createTaskCommand('rename-task', { name: '   ' });
		await empty.command({ task: { id: 'task-1', name: 'Original task' } });
		assert.equal(empty.calls.api.length, 0);

		const failed = createTaskCommand('rename-task', { name: 'Renamed task' });
		await failed.command({ task: { id: 'task-1', name: 'Original task' } });
		assert.equal(failed.calls.information.length, 0);
		assert.equal(failed.calls.refreshes.length, 0);
	});
});

describe('task delete command', () => {
	it('confirms and deletes a task, then refreshes dependent views', async () => {
		const { calls, command } = createTaskCommand('delete-task', {
			confirmation: 'Yes',
			apiResult: { name: 'Task One' },
		});
		await command({ task: { id: 'task-1', name: 'Task One' } });

		assert.deepEqual(calls.confirmations, ["Do you really want to delete task 'Task One'?"]);
		assert.deepEqual(calls.api, [['workspace-1', 'project-1', 'task-1']]);
		assert.deepEqual(calls.information, ["Task 'Task One' deleted."]);
		assert.deepEqual(calls.refreshes, ['tasks', 'timeentries']);
	});

	it('does nothing when deletion is cancelled or the API fails', async () => {
		const cancelled = createTaskCommand('delete-task', { confirmation: 'No' });
		await cancelled.command({ task: { id: 'task-1', name: 'Task One' } });
		assert.equal(cancelled.calls.api.length, 0);

		const failed = createTaskCommand('delete-task', { confirmation: 'Yes' });
		await failed.command({ task: { id: 'task-1', name: 'Task One' } });
		assert.equal(failed.calls.information.length, 0);
		assert.equal(failed.calls.refreshes.length, 0);
	});

	it('validates workspace, project, and task context', async () => {
		for (const options of [{ workspace: null }, { project: null }]) {
			const context = createTaskCommand('delete-task', options);
			await context.command({ task: { id: 'task-1', name: 'Task One' } });
			assert.deepEqual(context.calls.errors, ['No workspace, project, or task selected.']);
		}

		const missingTask = createTaskCommand('delete-task');
		await missingTask.command(undefined);
		assert.deepEqual(missingTask.calls.errors, ['No workspace, project, or task selected.']);
	});
});
