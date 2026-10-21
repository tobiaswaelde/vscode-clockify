const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');
const axios = require('axios');
const ts = require('typescript');

/**
 * Build an isolated SDK with real Axios interceptors and an in-memory transport.
 * @param {Function} handler The transport response or failure for each request.
 * @returns {object} The SDK, notification helper, request log, and notifications.
 */
function createSdk(handler) {
	const cache = new Map();
	const calls = [];
	const errors = [];
	const dependencies = {
		axios: {
			...axios,
			create: (options) => axios.create({
				...options,
				adapter: async (config) => {
					calls.push(config);
					return handler(config);
				},
			}),
		},
		vscode: { window: { showErrorMessage: (message) => errors.push(message) } },
	};
	dependencies.axios.default = dependencies.axios;

	/**
	 * Transpile and load a local TypeScript module with isolated dependencies.
	 * @param {string} relativePath The source path relative to the repository.
	 * @returns {object} The module exports.
	 */
	function load(relativePath) {
		const filename = path.resolve(__dirname, '..', relativePath);
		if (cache.has(filename)) {
			return cache.get(filename);
		}
		const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
			compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
		}).outputText;
		const loaded = { exports: {} };
		cache.set(filename, loaded.exports);
		new Function('require', 'module', 'exports', 'console', output)(
			(specifier) => specifier.startsWith('.')
				? load(path.relative(path.resolve(__dirname, '..'), path.resolve(path.dirname(filename), `${specifier}.ts`)))
				: dependencies[specifier] ?? require(specifier),
			loaded, loaded.exports, { error: () => undefined }
		);
		return loaded.exports;
	}

	const { Clockify } = load('src/sdk/index.ts');
	Clockify.authenticate('key-one');
	return { Clockify, showError: load('src/sdk/util.ts').showError, calls, errors };
}

/**
 * Return an Axios transport response or throw an HTTP error.
 * @param {object} config The Axios request configuration.
 * @param {unknown} data The response body.
 * @param {number} status The HTTP status.
 * @param {object} headers The response headers.
 * @returns {object} The response. Throws AxiosError for non-success statuses.
 */
function respond(config, data, status = 200, headers = {}) {
	const response = { config, data, status, headers, statusText: String(status) };
	if (status >= 400) {
		throw new axios.AxiosError('Request failed', 'ERR_BAD_RESPONSE', config, undefined, response);
	}
	return response;
}

/**
 * Advance the event loop until a deferred adapter has received its request.
 * @returns {Promise<void>} Resolves on the next event-loop turn.
 */
function nextTurn() {
	return new Promise((resolve) => setImmediate(resolve));
}

describe('Clockify user cache', () => {
	it('shares concurrent lookups and retains the successful user for unchanged credentials', async () => {
		const { Clockify, calls } = createSdk((config) => respond(config, { id: 'user-1' }));
		const users = await Promise.all([Clockify.getCurrentUser(), Clockify.getCurrentUser()]);
		assert.equal(users[0].id, 'user-1');
		assert.equal(users[0], users[1]);
		Clockify.authenticate('key-one');
		assert.equal(await Clockify.getCurrentUser(), users[0]);
		assert.equal(calls.length, 1);
	});

	it('retries failed lookups instead of caching failure', async () => {
		let failures = 1;
		const { Clockify, calls } = createSdk((config) =>
			respond(config, { id: 'user-1' }, failures-- > 0 ? 500 : 200));
		assert.equal(await Clockify.getCurrentUser(), undefined);
		assert.equal((await Clockify.getCurrentUser()).id, 'user-1');
		assert.equal(calls.length, 2);
	});

	it('discards delayed responses and failures from previous credentials', async () => {
		for (const failed of [false, true]) {
			let finishOld;
			const { Clockify, calls } = createSdk((config) => {
				if (config.headers['X-Api-Key'] === 'key-one') {
					return new Promise((resolve, reject) => {
						/**
						 * Settle the old credential's delayed transport response.
						 * @returns {void} Nothing.
						 */
						finishOld = () => failed ? reject(new Error('old failure')) : resolve(respond(config, { id: 'old-user' }));
					});
				}
				return respond(config, { id: 'new-user' });
			});
			const old = Clockify.getCurrentUser();
			await nextTurn();
			Clockify.authenticate('key-two');
			const current = await Clockify.getCurrentUser();
			finishOld();
			assert.equal(await old, undefined);
			assert.equal(current.id, 'new-user');
			assert.equal(await Clockify.getCurrentUser(), current);
			assert.equal(calls.length, 2);
		}
	});
});

describe('Clockify rate limits', () => {
	for (const header of ['120', new Date(1700000120000).toUTCString()]) {
		it(`honors Retry-After ${header} across reads and writes`, async (t) => {
			let now = 1700000000000;
			t.mock.method(Date, 'now', () => now);
			let limited = true;
			const { Clockify, calls, errors } = createSdk((config) => limited
				? respond(config, {}, 429, { 'retry-after': header })
				: respond(config, { id: 'user-1' }));
			assert.equal(await Clockify.addTimeEntry('workspace-1', { start: 'today' }), undefined);
			await Clockify.getProjects('workspace-1');
			await Clockify.getCurrentUser();
			await Clockify.stopTimeEntryForUser('workspace-1', 'user-1', { end: 'today' });
			now += 119999;
			await Clockify.getTags('workspace-1', {});
			assert.equal(calls.length, 1);
			assert.equal(errors.length, 1);
			assert.match(errors[0], /rate limit.*paused/);
			limited = false;
			now++;
			assert.equal((await Clockify.getCurrentUser()).id, 'user-1');
			assert.equal(calls.length, 2);
			assert.deepEqual(calls.map((call) => call.method), ['post', 'get']);
		});
	}

	for (const header of [undefined, '', 'invalid', '-1', 'Infinity', '1e308', new Date(0).toUTCString()]) {
		it(`backs off exponentially for invalid or absent Retry-After (${header})`, async (t) => {
			let now = 1700000000000;
			t.mock.method(Date, 'now', () => now);
			let limited = true;
			const { Clockify, calls } = createSdk((config) => limited
				? respond(config, {}, 429, { 'retry-after': header })
				: respond(config, []));
			await Clockify.getProjects('workspace-1');
			let expectedCalls = 1;
			for (const delay of [30000, 60000, 120000, 240000, 300000, 300000]) {
				now += delay - 1;
				await Clockify.getProjects('workspace-1');
				assert.equal(calls.length, expectedCalls);
				now++;
				await Clockify.getProjects('workspace-1');
				assert.equal(calls.length, ++expectedCalls);
			}
			now += 300000;
			limited = false;
			await Clockify.getProjects('workspace-1');
			limited = true;
			await Clockify.getProjects('workspace-1');
			expectedCalls += 2;
			now += 30000;
			await Clockify.getProjects('workspace-1');
			assert.equal(calls.length, expectedCalls + 1);
		});
	}

	it('resets cooldowns when credentials change', async () => {
		const { Clockify, calls } = createSdk((config) => config.headers['X-Api-Key'] === 'key-one'
			? respond(config, {}, 429, { 'retry-after': '120' })
			: respond(config, { id: 'new-user' }));
		await Clockify.getCurrentUser();
		Clockify.authenticate('key-two');
		assert.equal((await Clockify.getCurrentUser()).id, 'new-user');
		assert.equal(calls.length, 2);
	});

	it('bundles equal notifications for one minute but reports distinct failures', (t) => {
		let now = 1700000000000;
		t.mock.method(Date, 'now', () => now);
		const { showError, errors } = createSdk(() => undefined);
		showError('First');
		showError('First');
		showError('Second');
		now += 59999;
		showError('First');
		assert.deepEqual(errors, ['First', 'Second']);
		now++;
		showError('First');
		assert.deepEqual(errors, ['First', 'Second', 'First']);
	});
});

describe('running timer requests', () => {
	it('queries only the running timer and distinguishes absence from failure', async () => {
		let result = [{ id: 'entry-1' }];
		let status = 200;
		const { Clockify, calls } = createSdk((config) => config.url === '/user'
			? respond(config, { id: 'user-1' })
			: respond(config, result, status));
		assert.equal((await Clockify.getRunningTimeEntry('workspace-1')).id, 'entry-1');
		assert.match(calls[1].url, /workspace-1\/user\/user-1\/time-entries\?in-progress=1&page-size=1$/);
		result = [];
		assert.equal(await Clockify.getRunningTimeEntry('workspace-1'), null);
		status = 500;
		assert.equal(await Clockify.getRunningTimeEntry('workspace-1'), undefined);
		assert.equal(calls.filter((call) => call.url === '/user').length, 1);
	});

	it('does not query entries when the user lookup fails', async () => {
		const { Clockify, calls } = createSdk((config) => respond(config, {}, 500));
		assert.equal(await Clockify.getRunningTimeEntry('workspace-1'), undefined);
		assert.equal(calls.length, 1);
	});
});
