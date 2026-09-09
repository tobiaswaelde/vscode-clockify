# Changelog

## 4.1.0

### Minor Changes

- b05a61c: Add configurable Pomodoro notifications and automatic tracked breaks for active Clockify timers.
- f9f1884: Add a guided command for creating completed manual time entries.
- 41975ee: Add inline creation actions to workspace, client, project, and task selection dialogs.
- eb86b0f: Add task rename and delete actions to the Tasks tree-view context menu.
- c39462a: Start a Clockify timer from Jira issues shown by the official Atlassian VS Code extension.
- c648fa6: Link local workspace folders to Clockify projects for folder-aware automatic tracking.

### Patch Changes

- 283091c: Implement project renaming from the Projects tree-view context menu.
- fec9845: Implement confirmed project deletion from the Projects tree-view context menu.
- c9b3170: Prevent one VS Code window from auto-stopping a timer that was started by another window or application.

## 4.0.5

### Patch Changes

- e2f287b: Prompt for a required project before stopping project-less timers and retain the running state when Clockify rejects an update or stop request.
- 5e9a3c1: Store API keys securely, avoid unauthenticated startup polling, clean up extension resources correctly, filter inactive items, and fix tree-view text handling.
- 8cdc4a2: Require a project before starting timers in workspaces that use Timesheet or enforce project selection.

## 4.0.4

### Patch Changes

- 53df4d6: Remove the deprecated legacy extension source and attach installable VSIX packages automatically to GitHub Releases.
- 3fb3fee: Add documentation, deployment and release automation.

*Changelog created using the [Simple Changelog](https://marketplace.visualstudio.com/items?itemName=tobiaswaelde.vscode-simple-changelog) extension for VS Code.*

## [4.0.3] - 2023-03-22
### Fixed
- status bar item


## [4.0.2] - 2023-02-25
### Added
- Commands to start/stop tracking


## [4.0.1] - 2023-02-23
### Changed
- ask user to select a default workspace


## [4.0.0] - 2023-02-05
### Added
- Changelog