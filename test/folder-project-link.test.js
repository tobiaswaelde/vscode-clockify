const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');

function loadTypeScriptModule(relativePath, dependencies) {
	const output = ts.transpileModule(
		fs.readFileSync(path.join(root, relativePath), 'utf8'),
		{
			compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
		}
	).outputText;
	const loadedModule = { exports: {} };
	new Function('require', 'module', 'exports', output)(
		(specifier) => dependencies[specifier],
		loadedModule,
		loadedModule.exports
	);
	return loadedModule.exports;
}

function folder(name) {
	return { name, uri: { fsPath: `/work/${name}`, value: name } };
}

describe('tracking configuration scope', () => {
	function loadConfig({ folders, activeFolder, settings = {} }) {
		const vscode = {
			window: {
				activeTextEditor: activeFolder
					? { document: { uri: { value: 'active-document' } } }
					: undefined,
			},
			workspace: {
				workspaceFolders: folders,
				getWorkspaceFolder: () => activeFolder,
				getConfiguration: (_section, scope) => ({
					get: () => undefined,
					inspect: (key) => ({ workspaceFolderValue: settings[scope?.value]?.[key] }),
					update: async () => undefined,
				}),
			},
		};
		return loadTypeScriptModule('src/util/config.ts', { vscode }).Config;
	}

	it('uses the active editor folder, then the only open folder', () => {
		const first = folder('first');
		const second = folder('second');
		assert.equal(
			loadConfig({ folders: [first, second], activeFolder: second }).getTrackingScope(),
			second.uri
		);
		assert.equal(loadConfig({ folders: [first] }).getTrackingScope(), first.uri);
	});

	it('finds one explicitly linked auto-start folder in a multi-root workspace', () => {
		const first = folder('first');
		const second = folder('second');
		const Config = loadConfig({
			folders: [first, second],
			settings: {
				first: {
					'tracking.autostart': true,
					'tracking.projectId': 'project-1',
				},
			},
		});

		assert.equal(Config.getTrackingScope(), first.uri);
	});

	it('does not guess between multiple linked multi-root folders', () => {
		const folders = [folder('first'), folder('second')];
		const settings = Object.fromEntries(
			folders.map(({ name }) => [
				name,
				{ 'tracking.autostart': true, 'tracking.projectId': `project-${name}` },
			])
		);
		assert.equal(loadConfig({ folders, settings }).getTrackingScope(), undefined);
	});
});

describe('link project to workspace folder command', () => {
	function createCommand(folders, selectedFolder) {
		const calls = { errors: [], information: [], settings: [] };
		const ConfigurationTarget = { WorkspaceFolder: 3 };
		const vscode = {
			ConfigurationTarget,
			workspace: { workspaceFolders: folders },
			window: {
				showErrorMessage: (message) => calls.errors.push(message),
				showInformationMessage: (message) => calls.information.push(message),
				showQuickPick: async (items) => items.find(({ folder }) => folder === selectedFolder),
			},
		};
		const { linkWorkspaceFolder } = loadTypeScriptModule(
			'src/views/treeview/projects/commands/link-workspace-folder.ts',
			{
				vscode,
				'../../../../util/config': {
					Config: {
						set: async (...args) => calls.settings.push(args),
					},
				},
			}
		);
		return { calls, linkWorkspaceFolder };
	}

	it('stores project auto-start settings for the selected folder', async () => {
		const first = folder('first');
		const second = folder('second');
		const { calls, linkWorkspaceFolder } = createCommand([first, second], second);

		await linkWorkspaceFolder({
			project: { id: 'project-1', name: 'Project One', workspaceId: 'workspace-1' },
		});

		assert.deepEqual(calls.settings, [
			['tracking.workspaceId', 'workspace-1', 3, second.uri],
			['tracking.projectId', 'project-1', 3, second.uri],
			['tracking.taskId', undefined, 3, second.uri],
			['tracking.autostart', true, 3, second.uri],
		]);
		assert.match(calls.information[0], /Project One.*second/);
	});

	it('requires both a project and an open folder', async () => {
		const missingProject = createCommand([folder('first')]);
		await missingProject.linkWorkspaceFolder(undefined);
		assert.deepEqual(missingProject.calls.errors, ['No project selected.']);

		const missingFolder = createCommand([]);
		await missingFolder.linkWorkspaceFolder({
			project: { id: 'project-1', name: 'Project One', workspaceId: 'workspace-1' },
		});
		assert.deepEqual(missingFolder.calls.errors, [
			'Open a workspace folder before linking a Clockify project.',
		]);
		assert.equal(missingFolder.calls.settings.length, 0);
	});
});
