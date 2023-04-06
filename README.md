# Clockify

<!-- github build status badge -->
[![Build](https://github.com/tobiaswaelde/vscode-clockify/actions/workflows/build.yml/badge.svg?branch=master&event=status)](https://github.com/tobiaswaelde/vscode-clockify/actions/workflows/build.yml)
<!-- sonarqube project badges -->
[![Quality Gate Status](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_vscode-clockify_AYbOBTvPMsG9aSOZ5fmh&metric=alert_status&token=sqb_9f7ec553b50e159bbb9385e6bd27fb095d33d4ea)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_vscode-clockify_AYbOBTvPMsG9aSOZ5fmh)
[![Security Rating](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_vscode-clockify_AYbOBTvPMsG9aSOZ5fmh&metric=security_rating&token=sqb_9f7ec553b50e159bbb9385e6bd27fb095d33d4ea)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_vscode-clockify_AYbOBTvPMsG9aSOZ5fmh)
[![Vulnerabilities](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_vscode-clockify_AYbOBTvPMsG9aSOZ5fmh&metric=vulnerabilities&token=sqb_9f7ec553b50e159bbb9385e6bd27fb095d33d4ea)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_vscode-clockify_AYbOBTvPMsG9aSOZ5fmh)
[![Bugs](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_vscode-clockify_AYbOBTvPMsG9aSOZ5fmh&metric=bugs&token=sqb_9f7ec553b50e159bbb9385e6bd27fb095d33d4ea)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_vscode-clockify_AYbOBTvPMsG9aSOZ5fmh)
[![Lines of Code](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_vscode-clockify_AYbOBTvPMsG9aSOZ5fmh&metric=ncloc&token=sqb_9f7ec553b50e159bbb9385e6bd27fb095d33d4ea)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_vscode-clockify_AYbOBTvPMsG9aSOZ5fmh)
[![Duplicated Lines (%)](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_vscode-clockify_AYbOBTvPMsG9aSOZ5fmh&metric=duplicated_lines_density&token=sqb_9f7ec553b50e159bbb9385e6bd27fb095d33d4ea)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_vscode-clockify_AYbOBTvPMsG9aSOZ5fmh)
[![Maintainability Rating](https://sq.srv.tobiaswaelde.com/api/project_badges/measure?project=tobiaswaelde_vscode-clockify_AYbOBTvPMsG9aSOZ5fmh&metric=sqale_rating&token=sqb_9f7ec553b50e159bbb9385e6bd27fb095d33d4ea)](https://sq.srv.tobiaswaelde.com/dashboard?id=tobiaswaelde_vscode-clockify_AYbOBTvPMsG9aSOZ5fmh)

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
[Getting Started](https://github.com/tobiaswaelde/vscode-clockify/wiki/Home)


## Configuration

*All keys starting with `simpleChangelog.`*

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