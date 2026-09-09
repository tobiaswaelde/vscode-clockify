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

function loadTypeScriptModule(relativePath) {
	const output = ts.transpileModule(read(relativePath), {
		compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
	}).outputText;
	const loadedModule = { exports: {} };
	new Function('module', 'exports', output)(loadedModule, loadedModule.exports);
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
