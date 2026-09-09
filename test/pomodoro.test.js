const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');

function createPomodoro({ entry, settings = {}, focused = true, selection } = {}) {
	const calls = { errors: [], information: [], starts: [], stops: [] };
	const Tracking = {
		isTracking: Boolean(entry),
		timeEntry: entry,
		stop: async (...args) => {
			calls.stops.push(args);
			Tracking.isTracking = false;
			Tracking.timeEntry = undefined;
			return true;
		},
		startFromTimeEntry: async (...args) => {
			calls.starts.push(args);
			Tracking.isTracking = true;
			Tracking.timeEntry = {
				...args[0],
				id: `continued-${calls.starts.length}`,
				description: args[1] ?? args[0].description,
				timeInterval: { start: new Date().toISOString(), end: null },
			};
			return true;
		},
	};
	const source = fs.readFileSync(path.join(root, 'src/helpers/pomodoro.ts'), 'utf8');
	const output = ts.transpileModule(source, {
		compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
	}).outputText;
	const loadedModule = { exports: {} };
	const dependencies = {
		vscode: {
			window: {
				state: { focused },
				showErrorMessage: (message) => calls.errors.push(message),
				showInformationMessage: async (message) => {
					calls.information.push(message);
					return selection;
				},
			},
		},
		'../util/config': {
			Config: {
				get: (key) =>
					({
						'pomodoro.enabled': true,
						'pomodoro.focusMinutes': 25,
						'pomodoro.shortBreakMinutes': 5,
						'pomodoro.longBreakMinutes': 15,
						'pomodoro.sessionsBeforeLongBreak': 4,
						'pomodoro.automaticBreaks': false,
						...settings,
					})[key],
			},
		},
		'./tracking': { Tracking },
	};
	new Function('require', 'module', 'exports', output)(
		(specifier) => dependencies[specifier],
		loadedModule,
		loadedModule.exports
	);
	return { Pomodoro: loadedModule.exports.Pomodoro, Tracking, calls };
}

function timeEntry(description = 'Focused work') {
	return {
		id: 'entry-1',
		workspaceId: 'workspace-1',
		projectId: 'project-1',
		taskId: 'task-1',
		tagIds: ['tag-1'],
		billable: true,
		description,
		timeInterval: { start: '2000-01-01T00:00:00.000Z', end: null },
	};
}

describe('Pomodoro timer', () => {
	it('notifies for an elapsed external Clockify work timer', async () => {
		const { Pomodoro, calls } = createPomodoro({ entry: timeEntry() });

		await Pomodoro.update();

		assert.match(calls.information[0], /focus interval complete.*5-minute break/);
		assert.deepEqual(calls.stops, []);
	});

	it('does not notify from an unfocused VS Code window', async () => {
		const { Pomodoro, calls } = createPomodoro({ entry: timeEntry(), focused: false });

		await Pomodoro.update();

		assert.deepEqual(calls.information, []);
	});

	it('automatically replaces completed work with a tracked break', async () => {
		const entry = timeEntry();
		const { Pomodoro, calls } = createPomodoro({
			entry,
			settings: { 'pomodoro.automaticBreaks': true },
		});

		await Pomodoro.update();

		assert.deepEqual(calls.stops, [[false]]);
		assert.equal(calls.starts.length, 1);
		assert.equal(calls.starts[0][0], entry);
		assert.equal(calls.starts[0][1], 'Pomodoro break');
		assert.match(calls.information.at(-1), /5-minute break started/);
	});

	it('uses the configured long break after the configured number of sessions', async () => {
		const entry = timeEntry();
		const { Pomodoro, calls } = createPomodoro({
			entry,
			settings: { 'pomodoro.automaticBreaks': true },
		});
		Pomodoro.completedSessions = 3;

		await Pomodoro.update();

		assert.equal(calls.starts[0][1], 'Pomodoro long break');
		assert.match(calls.information.at(-1), /15-minute break started/);
	});

	it('automatically stops an elapsed break and resumes the saved work entry', async () => {
		const work = timeEntry();
		const breakEntry = { ...work, id: 'break-1', description: 'Pomodoro break' };
		const { Pomodoro, calls } = createPomodoro({
			entry: breakEntry,
			settings: { 'pomodoro.automaticBreaks': true },
		});
		Pomodoro.workEntry = work;

		await Pomodoro.update();

		assert.deepEqual(calls.stops, [[false]]);
		assert.deepEqual(calls.starts, [[work]]);
		assert.match(calls.information.at(-1), /Work timer resumed/);
	});
});
