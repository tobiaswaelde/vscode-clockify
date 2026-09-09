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
