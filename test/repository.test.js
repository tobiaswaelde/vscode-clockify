const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const manifest = require(path.join(root, 'package.json'));

function read(relativePath) {
	return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function loadTypeScriptModule(relativePath, dependencies = {}) {
	const output = ts.transpileModule(read(relativePath), {
		compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
	}).outputText;
	const loadedModule = { exports: {} };
	const requireDependency = (specifier) => {
		if (!(specifier in dependencies)) {
			throw new Error(`Missing test dependency: ${specifier}`);
		}
		return dependencies[specifier];
	};
	new Function('require', 'module', 'exports', output)(
		requireDependency,
		loadedModule,
		loadedModule.exports
	);
	return loadedModule.exports;
}

describe('text utilities', () => {
	it('replaces every line break in a tree-item description', () => {
		const { toSingleLine } = loadTypeScriptModule('src/util/text.ts');

		assert.equal(toSingleLine('first\nsecond\r\nthird\rfourth'), 'first second third fourth');
	});
});

describe('Clockify result filters', () => {
	const { filterByArchivedState, filterTasksByActivity } = loadTypeScriptModule(
		'src/sdk/results.ts'
	);

	it('separates active and archived resources', () => {
		const resources = [
			{ id: 'active', archived: false },
			{ id: 'legacy-active' },
			{ id: 'archived', archived: true },
		];

		assert.deepEqual(
			filterByArchivedState(resources, false).map(({ id }) => id),
			['active', 'legacy-active']
		);
		assert.deepEqual(
			filterByArchivedState(resources, true).map(({ id }) => id),
			['archived']
		);
	});

	it('separates active and completed tasks', () => {
		const tasks = [
			{ id: 'active', status: 'ACTIVE' },
			{ id: 'completed', status: 'DONE' },
		];

		assert.deepEqual(
			filterTasksByActivity(tasks, true).map(({ id }) => id),
			['active']
		);
		assert.deepEqual(
			filterTasksByActivity(tasks, false).map(({ id }) => id),
			['completed']
		);
	});
});

describe('tracking requirements', () => {
	const { requiresProject } = loadTypeScriptModule('src/helpers/tracking-requirements.ts');

	it('requires a project when Timesheet is enabled', () => {
		assert.equal(requiresProject({ canSeeTimeSheet: true, forceProjects: false }), true);
	});

	it('requires a project when the workspace forces projects', () => {
		assert.equal(requiresProject({ canSeeTimeSheet: false, forceProjects: true }), true);
	});

	it('keeps project-less timers available in workspaces without either requirement', () => {
		assert.equal(requiresProject({ canSeeTimeSheet: false, forceProjects: false }), false);
	});
});

describe('stopping a running timer', () => {
	function createTracking(overrides = {}) {
		const calls = { updates: [], stops: [] };
		const clockifyOverrides = overrides.Clockify || {};
		const Clockify = {
			getCurrentUser: async () => ({ id: 'user-1' }),
			updateTimeEntry: async (...args) => {
				calls.updates.push(args);
				return clockifyOverrides.updateTimeEntry
					? clockifyOverrides.updateTimeEntry(...args)
					: {};
			},
			stopTimeEntryForUser: async (...args) => {
				calls.stops.push(args);
				return clockifyOverrides.stopTimeEntryForUser
					? clockifyOverrides.stopTimeEntryForUser(...args)
					: {};
			},
			...Object.fromEntries(
				Object.entries(clockifyOverrides).filter(
					([name]) => !['updateTimeEntry', 'stopTimeEntryForUser'].includes(name)
				)
			),
		};
		const Dialogs = {
			getDescription: async () => undefined,
			selectProject: async () => undefined,
			...overrides.Dialogs,
		};
		const { requiresProject } = loadTypeScriptModule(
			'src/helpers/tracking-requirements.ts'
		);
		const { Tracking } = loadTypeScriptModule('src/helpers/tracking.ts', {
			'./../views/statusbar/index': { StatusBar: { update: async () => undefined } },
			'../sdk': { Clockify },
			'../util/config': { Config: { get: () => undefined } },
			'../util/dialogs': { Dialogs },
			'../views/treeview': { TreeView: { refreshTimeentries: () => undefined } },
			'../util/api-key': { ApiKey: { get: async () => 'api-key' } },
			'./tracking-requirements': { requiresProject },
		});

		Tracking.workspace = {
			id: 'workspace-1',
			workspaceSettings: { canSeeTimeSheet: true, forceProjects: true },
		};
		Tracking.timeEntry = {
			billable: false,
			description: 'Existing description',
			id: 'entry-1',
			projectId: null,
			tagIds: null,
			taskId: null,
			timeInterval: { start: '2026-09-09T08:00:00.000Z', end: null },
			userId: 'user-1',
			workspaceId: 'workspace-1',
		};
		Tracking.isTracking = true;

		return { calls, Tracking };
	}

	it('assigns a required project before stopping', async () => {
		const { calls, Tracking } = createTracking({
			Dialogs: { selectProject: async () => ({ id: 'project-1' }) },
		});

		await Tracking.stop();

		assert.equal(calls.updates.length, 1);
		assert.equal(calls.updates[0][2].projectId, 'project-1');
		assert.equal(calls.stops.length, 1);
		assert.equal(Tracking.isTracking, false);
		assert.equal(Tracking.timeEntry, undefined);
	});

	it('keeps the timer running when required project selection is cancelled', async () => {
		const { calls, Tracking } = createTracking();

		await Tracking.stop();

		assert.equal(calls.updates.length, 0);
		assert.equal(calls.stops.length, 0);
		assert.equal(Tracking.isTracking, true);
		assert.equal(Tracking.timeEntry.id, 'entry-1');
	});

	it('keeps the timer running when the stop request fails', async () => {
		const { calls, Tracking } = createTracking({
			Clockify: { stopTimeEntryForUser: async () => undefined },
			Dialogs: { selectProject: async () => ({ id: 'project-1' }) },
		});

		await Tracking.stop();

		assert.equal(calls.stops.length, 1);
		assert.equal(Tracking.isTracking, true);
		assert.equal(Tracking.timeEntry.id, 'entry-1');
		assert.equal(Tracking.timeEntry.projectId, 'project-1');
	});

	it('does not send a stop request when the required project update fails', async () => {
		const { calls, Tracking } = createTracking({
			Clockify: { updateTimeEntry: async () => undefined },
			Dialogs: { selectProject: async () => ({ id: 'project-1' }) },
		});

		await Tracking.stop();

		assert.equal(calls.updates.length, 1);
		assert.equal(calls.stops.length, 0);
		assert.equal(Tracking.isTracking, true);
		assert.equal(Tracking.timeEntry.projectId, null);
	});
});

describe('project rename command', () => {
	function createRenameProject({ workspace = { id: 'workspace-1' }, name, updateResult } = {}) {
		const calls = { errors: [], names: [], updates: [], information: [], refreshes: 0 };
		const { renameProject } = loadTypeScriptModule(
			'src/views/treeview/projects/commands/rename-project.ts',
			{
				vscode: {
					window: {
						showInformationMessage: (message) => calls.information.push(message),
					},
				},
				'../..': {
					TreeView: { refreshProjects: () => calls.refreshes++ },
				},
				'../../../../sdk': {
					Clockify: {
						updateProject: async (...args) => {
							calls.updates.push(args);
							return updateResult;
						},
					},
				},
				'../../../../sdk/util': {
					showError: (message) => calls.errors.push(message),
				},
				'../../../../util/dialogs': {
					Dialogs: {
						getProjectName: async (currentName) => {
							calls.names.push(currentName);
							return name;
						},
					},
				},
				'../../../../util/global-state': {
					GlobalState: { get: () => workspace },
				},
			}
		);
		return { calls, renameProject };
	}

	it('prefills and submits the trimmed project name', async () => {
		const { calls, renameProject } = createRenameProject({
			name: '  Renamed project  ',
			updateResult: { name: 'Renamed project' },
		});

		await renameProject({ project: { id: 'project-1', name: 'Original project' } });

		assert.deepEqual(calls.names, ['Original project']);
		assert.deepEqual(calls.updates, [
			['workspace-1', 'project-1', { name: 'Renamed project' }],
		]);
		assert.deepEqual(calls.information, ["Project 'Renamed project' updated."]);
		assert.equal(calls.refreshes, 1);
	});

	it('does not call the API when the dialog is cancelled or empty', async () => {
		for (const name of [undefined, '', '   ']) {
			const { calls, renameProject } = createRenameProject({ name });
			await renameProject({ project: { id: 'project-1', name: 'Original project' } });
			assert.equal(calls.updates.length, 0);
		}
	});

	it('reports missing workspace or project context', async () => {
		const missingWorkspace = createRenameProject({ workspace: null });
		await missingWorkspace.renameProject({ project: { id: 'project-1' } });
		assert.deepEqual(missingWorkspace.calls.errors, ['No workspace or project selected.']);

		const missingProject = createRenameProject();
		await missingProject.renameProject(undefined);
		assert.deepEqual(missingProject.calls.errors, ['No workspace or project selected.']);
	});

	it('does not report success or refresh after an API failure', async () => {
		const { calls, renameProject } = createRenameProject({ name: 'Renamed project' });

		await renameProject({ project: { id: 'project-1', name: 'Original project' } });

		assert.equal(calls.updates.length, 1);
		assert.equal(calls.information.length, 0);
		assert.equal(calls.refreshes, 0);
	});
});

describe('project delete command', () => {
	function createDeleteProject({
		workspace = { id: 'workspace-1' },
		confirmation = 'Yes',
		deleteResult,
	} = {}) {
		const calls = {
			confirmations: [],
			deletes: [],
			errors: [],
			information: [],
			refreshes: [],
		};
		const { deleteProject } = loadTypeScriptModule(
			'src/views/treeview/projects/commands/delete-project.ts',
			{
				vscode: {
					window: {
						showInformationMessage: (message) => calls.information.push(message),
					},
				},
				'../..': {
					TreeView: {
						refreshProjects: () => calls.refreshes.push('projects'),
						refreshTasks: () => calls.refreshes.push('tasks'),
						refreshTimeentries: () => calls.refreshes.push('timeentries'),
					},
				},
				'../../../../sdk': {
					Clockify: {
						deleteProject: async (...args) => {
							calls.deletes.push(args);
							return deleteResult;
						},
					},
				},
				'../../../../sdk/util': {
					showError: (message) => calls.errors.push(message),
				},
				'../../../../util/dialogs': {
					Dialogs: {
						askForConfirmation: async (message) => {
							calls.confirmations.push(message);
							return confirmation;
						},
					},
				},
				'../../../../util/global-state': {
					GlobalState: { get: () => workspace },
				},
			}
		);
		return { calls, deleteProject };
	}

	it('identifies and deletes the selected project, then refreshes dependent views', async () => {
		const { calls, deleteProject } = createDeleteProject({
			deleteResult: { id: 'project-1', name: 'Project One' },
		});

		await deleteProject({ project: { id: 'project-1', name: 'Project One' } });

		assert.deepEqual(calls.confirmations, ["Do you really want to delete project 'Project One'?"]);
		assert.deepEqual(calls.deletes, [['workspace-1', 'project-1']]);
		assert.deepEqual(calls.information, ["Project 'Project One' deleted."]);
		assert.deepEqual(calls.refreshes, ['projects', 'tasks', 'timeentries']);
	});

	it('does not call the API when deletion is cancelled', async () => {
		const { calls, deleteProject } = createDeleteProject({ confirmation: 'No' });

		await deleteProject({ project: { id: 'project-1', name: 'Project One' } });

		assert.equal(calls.deletes.length, 0);
		assert.equal(calls.refreshes.length, 0);
	});

	it('reports missing workspace or project context', async () => {
		const missingWorkspace = createDeleteProject({ workspace: null });
		await missingWorkspace.deleteProject({ project: { id: 'project-1' } });
		assert.deepEqual(missingWorkspace.calls.errors, ['No workspace or project selected.']);

		const missingProject = createDeleteProject();
		await missingProject.deleteProject(undefined);
		assert.deepEqual(missingProject.calls.errors, ['No workspace or project selected.']);
	});

	it('does not report success or refresh after an API failure', async () => {
		const { calls, deleteProject } = createDeleteProject();

		await deleteProject({ project: { id: 'project-1', name: 'Project One' } });

		assert.equal(calls.deletes.length, 1);
		assert.equal(calls.information.length, 0);
		assert.equal(calls.refreshes.length, 0);
	});
});

describe('API-key migration', () => {
	const { getLegacyApiKey } = loadTypeScriptModule('src/util/api-key-values.ts');

	it('migrates the most specific legacy setting', () => {
		assert.equal(
			getLegacyApiKey({
				globalValue: 'global',
				workspaceValue: 'workspace',
				workspaceFolderValue: 'folder',
			}),
			'folder'
		);
		assert.equal(getLegacyApiKey({ globalValue: 'global' }), 'global');
		assert.equal(getLegacyApiKey({}), undefined);
	});
});

describe('extension manifest', () => {
	it('keeps credentials out of public settings and avoids eager activation', () => {
		assert.equal(manifest.contributes.configuration.properties['clockify.apiKey'], undefined);
		assert.deepEqual(manifest.activationEvents, ['onStartupFinished']);
	});

	it('declares every menu command exactly once', () => {
		const declaredCommands = manifest.contributes.commands.map(({ command }) => command);
		assert.equal(new Set(declaredCommands).size, declaredCommands.length);

		for (const menuItems of Object.values(manifest.contributes.menus)) {
			for (const { command } of menuItems) {
				assert.ok(declaredCommands.includes(command), `${command} is not declared`);
			}
		}
	});

	it('registers a provider for every contributed view', () => {
		const extensionSource = read('src/extension.ts');
		const contributedViews = manifest.contributes.views['clockify-explorer'].map(({ id }) => id);
		const registeredViews = Array.from(
			extensionSource.matchAll(/registerProvider\('([^']+)'/g),
			({ 1: name }) => `clockify-${name}`
		);

		assert.deepEqual(registeredViews.sort(), contributedViews.sort());
	});
});

describe('workflow responsibilities', () => {
	const testsWorkflow = read('.github/workflows/tests.yml');
	const docsWorkflow = read('.github/workflows/docs.yml');
	const releasePrWorkflow = read('.github/workflows/release.yml');
	const githubReleaseWorkflow = read('.github/workflows/github-release.yml');

	it('runs tests and quality checks only in the tests workflow', () => {
		assert.match(testsWorkflow, /yarn test/);
		assert.match(testsWorkflow, /yarn typecheck/);
		assert.match(testsWorkflow, /yarn lint/);
		assert.match(testsWorkflow, /yarn package/);

		for (const releaseWorkflow of [releasePrWorkflow, githubReleaseWorkflow]) {
			assert.doesNotMatch(releaseWorkflow, /yarn test|yarn lint|docs:build/);
		}
	});

	it('deploys documentation only from the docs workflow', () => {
		assert.match(docsWorkflow, /yarn docs:build/);
		assert.match(docsWorkflow, /actions\/deploy-pages@/);
		assert.doesNotMatch(testsWorkflow, /docs:build|deploy-pages/);
		assert.doesNotMatch(releasePrWorkflow, /docs:build|deploy-pages/);
		assert.doesNotMatch(githubReleaseWorkflow, /docs:build|deploy-pages/);
	});

	it('packages releases only from the GitHub release workflow', () => {
		assert.match(githubReleaseWorkflow, /yarn package:vsix/);
		assert.doesNotMatch(testsWorkflow, /package:vsix|gh release/);
		assert.doesNotMatch(docsWorkflow, /package:vsix|gh release/);
	});
});
