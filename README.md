# Clockify

[![Tests](https://img.shields.io/github/actions/workflow/status/tobiaswaelde/vscode-clockify/tests.yml?branch=main&style=for-the-badge&label=Tests)](https://github.com/tobiaswaelde/vscode-clockify/actions/workflows/tests.yml)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy_Me_a_Coffee-Support-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=000000)](https://www.buymeacoffee.com/tobiaswaelde)

Implements [Clockify](https://clockify.me/) time tracker in VSCode.

![Clockify logo](assets/logo/logo-full.png)

> **⚠️ Marketplace releases are currently paused**
>
> [Microsoft is retiring global Azure DevOps Personal Access Tokens (PATs) on December 1, 2026](https://code.visualstudio.com/api/working-with-extensions/publishing-extension). These tokens were previously used to publish this extension. The officially recommended secretless replacement currently requires an Azure subscription and Azure Pipelines, so new versions are distributed as VSIX files through GitHub Releases for now.
>
> **Community help wanted:** If you have experience with secure, sustainable VS Code Marketplace publishing and can help bring current releases back to the Marketplace, please [open an issue](https://github.com/tobiaswaelde/vscode-clockify/issues/new) and share your approach.

## Functions
You can manage your workspaces, clients, projects, tasks and time entries. You can start and stop a timer on the status bar or automatically by adjusting the settings for the workspace in which you want to enable the auto tracking.

Workspace, client, project and task selection dialogs include an **Add** action, so missing items can be created without leaving the current workflow.

Use **Clockify: Add Manual Time Entry** or the **Add** button in the Time Entries view to record a completed interval with project, task, tags, description and billing status.

Use **Link Project to Workspace Folder** from a project's context menu to store the Clockify workspace/project IDs and enable auto-start for that local folder. Single-folder windows apply the link directly; multi-root windows ask which folder to link.

When the optional **Atlassian for VS Code** extension is installed, Jira issue context menus—including related Jira issues shown for Bitbucket pull requests—include **Start Clockify Timer**. The timer description is populated as `ISSUE-KEY: Summary`; an already running timer is left untouched.

Optional Pomodoro support observes the active Clockify entry even when it was started in the browser. VS Code can notify at focus/break boundaries or automatically stop work, track a `Pomodoro break`, and resume the prior entry. Browser-extension Pomodoro preferences are browser-local and cannot be read through the Clockify API, so VS Code uses the settings below.

## Installation

### Latest release from GitHub

1. Download the `.vsix` file from the [latest GitHub release](https://github.com/tobiaswaelde/vscode-clockify/releases/latest).
2. In VS Code, open the Extensions view (`Ctrl+Shift+X`).
3. Select **Views and More Actions** (`...`) and then **Install from VSIX...**.
4. Select the downloaded file and reload VS Code when prompted.

Alternatively, install the downloaded file from the command line:

```sh
code --install-extension /path/to/clockify-tracker-x.y.z.vsix
```

Automatic updates are disabled by default for extensions installed from a VSIX. Repeat these steps when a new release becomes available.

### Marketplace version

The last version published to the Marketplace remains available. Launch VS Code Quick Open (`Ctrl+P`), paste the following command, and press enter:

```
ext install tobiaswaelde.clockify-tracker
```

You can also search for "Clockify" in the Extensions view. Until Marketplace publishing resumes, this version may be older than the latest GitHub release.

## Preview
![Clockify TreeView screenshot](docs/images/treeview-preview.png)

## Getting Started
[Getting Started](docs/index.md)

## Releasing

Releases are managed with [Changesets](https://github.com/changesets/changesets):

1. Add a changeset for every user-facing change.
2. Merge the change into `main`. The `Release PR` workflow creates or updates the `Version Packages` pull request.
3. Merge the `Version Packages` pull request. The `GitHub Release` workflow packages the extension, creates a `v<version>` GitHub release and attaches the installable VSIX file.

## Development

Use Node.js 22 and Yarn 1. Install dependencies with `yarn install --frozen-lockfile`, then run:

```sh
yarn test
yarn typecheck
yarn lint
yarn package
yarn docs:build
```

Tests and quality checks run in `tests.yml`, releases run in the release workflows, and documentation is deployed independently by `docs.yml`.

## Configuration

*All keys starting with `clockify.`*

The API key entered through **Clockify: Set API key** is stored in VS Code SecretStorage and is not written to user or workspace settings.

| Settings key                   | Type    | Default value | Description                                                                                                         |
| ------------------------------ | ------- | ------------- | ------------------------------------------------------------------------------------------------------------------- |
| defaultWorkspaceId             | string  | ` `           | The ID of the default workspace in which start tracking (if no workspace ID is set in the workspaces settings.json) |
| fetchLimit                     | number  | `200`         | Limit the number of items that will be fetched for displaying in the tree view.                                     |
| hideSensitiveData              | boolean | `false`       | Hide sensitive data. Can be useful for screenshots.                                                                 |
| showIds                        | boolean | `false`       | Show IDs of the data.                                                                                               |
| workspaces.showNumberOfMembers | boolean | `true`        | Show the number of members for each workspace.                                                                      |
| tracking.workspaceId           | string  | ` `           | The ID of the default workspace. Supports workspace-folder scope.                                                   |
| tracking.projectId             | string  | ` `           | The ID of the default project in the workspace. `clockify.tracking.workspaceId` must be set. Supports folder scope. |
| tracking.taskId                | string  | ` `           | The ID of the default task in the workspace. `clockify.tracking.workspaceId` must be set. Supports folder scope.    |
| tracking.billable              | boolean | `false`       | Check if Time Entry is billable.                                                                                    |
| tracking.autostart             | boolean | `false`       | Start tracking when opening the IDE. Supports workspace-folder scope.                                               |
| tracking.autostop              | boolean | `true`        | When this VS Code window closes, stop only a timer that was started by this window.                                  |
| pomodoro.enabled               | boolean | `false`       | Enable Pomodoro handling for the active Clockify timer.                                                              |
| pomodoro.focusMinutes          | integer | `25`          | Focus interval length in minutes.                                                                                    |
| pomodoro.shortBreakMinutes     | integer | `5`           | Short break length in minutes.                                                                                       |
| pomodoro.longBreakMinutes      | integer | `15`          | Long break length in minutes.                                                                                        |
| pomodoro.sessionsBeforeLongBreak | integer | `4`         | Completed focus intervals before a long break.                                                                       |
| pomodoro.automaticBreaks       | boolean | `false`       | Automatically stop work, track the break, and resume the prior entry.                                                |
