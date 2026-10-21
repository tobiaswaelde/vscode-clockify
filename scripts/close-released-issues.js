const { execFileSync } = require('node:child_process');
const { readFileSync } = require('node:fs');

/**
 * Read explicit issue markers from only the requested release's changelog section.
 * @param {string} changelog The Changesets changelog.
 * @param {string} version The published package version.
 * @returns {string[]} Unique issue numbers marked for this release.
 */
function getReleaseIssues(changelog, version) {
	const section = changelog.split(/^## /m).find((text) => text.split(/\r?\n/, 1)[0] === version);
	if (section === undefined) {
		throw new Error(`Missing changelog section for ${version}`);
	}
	return [...new Set(Array.from(section.matchAll(/\bIssue: #([1-9]\d*)\b/g), (match) => match[1]))];
}

/**
 * Close marked issues only after verifying the release and uploaded installable artifact.
 * @param {object} metadata The release version, VSIX filename, changelog, and repository.
 * @param {Function} run The command runner, injectable for isolated tests.
 * @returns {void} Nothing. Throws on missing publication, artifact, or failed GitHub commands.
 */
function closeReleasedIssues({ version, vsix, changelog, repository }, run = execFileSync) {
	const issues = getReleaseIssues(changelog, version);
	const release = JSON.parse(run('gh', [
		'release', 'view', `v${version}`, '--repo', repository, '--json', 'isDraft,assets',
	], { encoding: 'utf8' }));
	if (release.isDraft !== false || !release.assets.some((asset) =>
		asset.name === vsix && asset.state === 'uploaded' && asset.size > 0
	)) {
		throw new Error('Release must be published with an uploaded VSIX before closing issues');
	}

	for (const issue of issues) {
		run('gh', ['issue', 'close', issue, '--repo', repository, '--reason', 'completed'], {
			stdio: 'inherit',
		});
	}
}

if (require.main === module) {
	const { version } = require('../package.json');
	closeReleasedIssues({
		version,
		vsix: `clockify-tracker-${version}.vsix`,
		changelog: readFileSync('CHANGELOG.md', 'utf8'),
		repository: process.env.GITHUB_REPOSITORY,
	});
}

module.exports = { getReleaseIssues, closeReleasedIssues };
