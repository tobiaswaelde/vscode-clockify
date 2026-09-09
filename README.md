# Clockify

[![CI](https://img.shields.io/github/actions/workflow/status/tobiaswaelde/vscode-clockify/ci.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/tobiaswaelde/vscode-clockify/actions/workflows/ci.yml)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy_Me_a_Coffee-Support-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=000000)](https://www.buymeacoffee.com/tobiaswaelde)

Implements [Clockify](https://clockify.me/) time tracker in VSCode.

![Clockify logo](assets/logo/logo-full.png)

## Functions
You can manage your workspaces, clients, projects, tasks and time entries. You can start and stop a timer on the status bar or automatically by adjusting the settings for the workspace in which you want to enable the auto tracking.

## Installation
Launch VS Code Quick Open (`Ctrl+P`), paste the following command, and press enter:
```
ext install tobiaswaelde.clockify-tracker
```

Or you can just search for "Clockify" in the Extensions view.

## Preview
![Clockify TreeView screenshot](docs/images/treeview-preview.png)

## Getting Started
[Getting Started](docs/index.md)

## Releasing

Releases are managed with [Changesets](https://github.com/changesets/changesets):

1. Add a changeset for every user-facing change.
2. Merge the change into `main`. The `Release PR` workflow creates or updates the `Version Packages` pull request.
3. Merge the `Version Packages` pull request. The `Publish` workflow publishes the packaged extension to the VS Code Marketplace using GitHub OIDC.

Trusted publishing must be configured once for the `tobiaswaelde` publisher in the [Visual Studio Marketplace publisher management page](https://marketplace.visualstudio.com/manage/publishers/). Trust the `tobiaswaelde/vscode-clockify` repository and the `.github/workflows/publish.yml` workflow. No long-lived Marketplace token is required.


## Configuration

*All keys starting with `clockify.`*

| Settings key                   | Type    | Default value | Description                                                                                                         |
| ------------------------------ | ------- | ------------- | ------------------------------------------------------------------------------------------------------------------- |
| apiKey                         | string  | ` `           | The clockify API key.                                                                                               |
| defaultWorkspaceId             | string  | ` `           | The ID of the default workspace in which start tracking (if no workspace ID is set in the workspaces settings.json) |
| fetchLimit                     | number  | `200`         | Limit the number of items that will be fetched for displaying in the tree view.                                     |
| hideSensitiveData              | boolean | `false`       | Hide sensitive data. Can be useful for screenshots.                                                                 |
| showIds                        | boolean | `false`       | Show IDs of the data.                                                                                               |
| workspaces.showNumberOfMembers | boolean | `true`        | Show the number of members for each workspace.                                                                      |
| tracking.workspaceId           | string  | ` `           | The ID of the default workspace.                                                                                    |
| tracking.projectId             | string  | ` `           | The ID of the default project in the workspace. `clockify.tracking.workspaceId` must be set.                        |
| tracking.taskId                | string  | ` `           | The ID of the default task in the workspace. `clockify.tracking.workspaceId` must be set.                           |
| tracking.billable              | boolean | `false`       | Check if Time Entry is billable.                                                                                    |
| tracking.autostart             | boolean | `false`       | Start tracking with opening the IDE.                                                                                |
| tracking.autostop              | boolean | `true`        | Stop tracking with closing the IDE.                                                                                 |
