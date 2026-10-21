const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');
const { getReleaseIssues, closeReleasedIssues } = require('../scripts/close-released-issues');

const changelog = '# Changelog\n\n## 4.1.1\n\n- Fix rate limits. Issue: #92\n- Another fix. Issue: #92\n\n## 4.1.0\n\n- Older fix. Issue: #12\n';
const metadata = {
	version: '4.1.1', vsix: 'clockify-tracker-4.1.1.vsix',
	changelog, repository: 'tobiaswaelde/vscode-clockify',
};
const release = {
	isDraft: false,
	assets: [{ name: metadata.vsix, state: 'uploaded', size: 100 }],
};

describe('release issue closure', () => {
	it('reads unique explicit markers only from the published version', () => {
		assert.deepEqual(getReleaseIssues(changelog, '4.1.1'), ['92']);
		assert.deepEqual(getReleaseIssues(changelog, '4.1.0'), ['12']);
		assert.deepEqual(getReleaseIssues('## 4.1.1\n\nMention #92 without a marker.', '4.1.1'), []);
		assert.throws(() => getReleaseIssues(changelog, '4.1.2'), /Missing changelog section/);
	});

	it('verifies the release and uploaded VSIX before closing marked issues', () => {
		const calls = [];
		closeReleasedIssues(metadata, (command, args) => {
			calls.push({ command, args });
			return JSON.stringify(release);
		});
		assert.equal(calls.length, 2);
		assert.equal(calls[0].command, 'gh');
		assert.deepEqual(calls[0].args.slice(0, 3), ['release', 'view', 'v4.1.1']);
		assert.deepEqual(calls[1], {
			command: 'gh', args: ['issue', 'close', '92', '--repo', metadata.repository, '--reason', 'completed'],
		});
	});

	it('leaves issues open after publication failure or incomplete artifact upload', () => {
		for (const result of [undefined, { ...release, isDraft: true }, { ...release, assets: [] }, {
			...release, assets: [{ ...release.assets[0], state: 'open' }],
		}, { ...release, assets: [{ ...release.assets[0], size: 0 }] }]) {
			const calls = [];
			assert.throws(() => closeReleasedIssues(metadata, (command, args) => {
				calls.push(args);
				if (result === undefined) {
					throw new Error('Release failed');
				}
				return JSON.stringify(result);
			}));
			assert.equal(calls.length, 1);
			assert.equal(calls[0][0], 'release');
		}
	});

	it('runs closure only after successful release publication in the workflow', () => {
		const workflow = fs.readFileSync(path.resolve(__dirname, '../.github/workflows/github-release.yml'), 'utf8');
		assert.match(workflow, /issues: write/);
		assert.ok(workflow.indexOf('node scripts/close-released-issues.js') > workflow.indexOf('gh release create'));
		assert.doesNotMatch(workflow, /always\(\)|continue-on-error/);
	});
});
