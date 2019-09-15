import * as vscode from 'vscode';
import { ProjectDtoImpl, ProjectRequest, WorkspaceDto } from '../../api/interfaces';
import { providerStore } from '../stores';
import { ProjectsProvider, ProjectItem } from './projects.provider';
import { getContext, setContext, ContextValue } from '../utils';
import { getProjectName } from '../../helpers/project/getProjectName';
import { selectClient } from '../../helpers/project/selectClient';
import { selectColor } from '../../helpers/project/selectColor';
import { selectVisibility } from '../../helpers/project/selectVisibility';
import { selectBillable } from '../../helpers/project/selectBillable';
import { addProject as apiAddProject } from '../../api/actions/project';

export function registerProjectsCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.projects.selection', selectProject),
		vscode.commands.registerCommand('clockify.projects.add', addProject),
		vscode.commands.registerCommand('clockify.projects.refresh', refreshProjects)
	);
}

async function selectProject(project: ProjectDtoImpl): Promise<void> {
	const context = getContext();
	const currentProject = context.globalState.get<ProjectDtoImpl>('selectedProject')!;

	if (currentProject && currentProject.id === project.id) {
		return;
	}

	//> Get Providers
	const projectsProvider = providerStore.get<ProjectsProvider>('projects');
	// tasks

	//> Set context
	setContext(ContextValue.ProjectSelected, false);

	//> Empty selection to show 'Loading...'
	if (project) {
		context.globalState.update('selectedProject', null);
	}

	//> Call refresh() on all providers
	projectsProvider.refresh();

	if (project) {
		setTimeout(() => {
			//> Update globalState
			context.globalState.update('selectedProject', project);

			//> Call refresh() on all providers
			projectsProvider.refresh();
		}, 250);
	}

	await vscode.window.showInformationMessage(`Project '${project.name}' selected`);
}

async function addProject(): Promise<void> {
	// 1. Project name
	// 2. Select Client
	// 3. Select Color
	// 4. isPublic
	// 5. isBillable
	try {
		const context = getContext();
		const workspace = context.globalState.get<WorkspaceDto>('selectedWorkspace')!;

		let newProject: ProjectRequest = {} as ProjectRequest;

		const projectName = await getProjectName();
		newProject.name = projectName;

		const clientId = await selectClient(workspace.id);
		if (clientId !== 'none') {
			newProject.clientId = clientId;
		}

		const color = await selectColor();
		newProject.color = color;

		const isPublic = await selectVisibility();
		newProject.isPublic = isPublic;

		const isBillable = await selectBillable();
		newProject.billable = isBillable;

		// Add project
		const project = await apiAddProject(workspace.id, newProject);
		if (project) {
			const projectsProvider = providerStore.get<ProjectsProvider>('projects');
			projectsProvider.refresh();
			await vscode.window.showInformationMessage(`Project '${project.name}' added`);
		}
	} catch (err) {
		console.error(err);
	}
}

function refreshProjects(element?: ProjectItem): void {
	const projectsProvider = providerStore.get<ProjectsProvider>('projects');
	projectsProvider.refresh(element);
}
