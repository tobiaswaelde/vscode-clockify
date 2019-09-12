# Functions

## Status Bar
- Show current tracker time
- on click: Show menu

## Menu
- Start tracking
- Stop tracking
- Show Dashboard
- Change API-Key
- Select Workspace

## Settings
- API-Key
- Workspace
- Autostart?

## Procedures
- Start tracking
  - input: What are you working on?
  - input: Project/Task
  - input: Tags

## Workspace
- Client
  - Add Client `POST /workspaces/{workspaceId}/clients`
    - name: `string`
  - Get Clients `GET /workspaces/{workspaceId}/clients`
- Project
  - Add Project `POST /workspaces/{workspaceId}/projects`
    - name: `string`
    - clientId: `string`
    - isPublic: `boolean`
  - Get Projects `GET /workspaces/{workspaceId}/projects`
- Tag
  - Add Tag `POST /workspaces/{workspaceId}/tags`
    - name: `string`
  - Get Tags: `GET /workspaces/{workspaceId}/tags`
- Task
  - Add Task `POST /workspaces/{workspaceId}/projects/{projectId}/tasks`
    - name: `string`
    - projectId: `string`
    - assigneeId: `string` (optional)
    - estimate: `string` (optional)
  - Get Tasks `GET /workspaces/{workspaceId}/projects/{projectId}/tasks`
- Time entry
  - Add Time entry `POST /workspaces/{workspaceId}/time-entries`
    - start: `datetime`
    - billable: `boolean`
    - description: `string`
    - projectId: `string`
    - taskId: `string`
    - tagIds: `string[]`
  - Get Time entries `GET /workspaces/{workspaceId}/time-entries/{id}`
- User
  - Get user `GET /user`
- Workspace
  - Add Workspace `POST /workspaces`
    - name: `string`
  - Get Workspaces `GET /workspaces`<