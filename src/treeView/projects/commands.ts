import * as vscode from 'vscode';
import { ProjectDtoImpl } from '../../api/interfaces';
import { providerStore } from '../stores';
import { ProjectsProvider, ProjectItem } from './projects.provider';
import { getContext, setContext, ContextValue } from '../utils';

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
	//
}

function refreshProjects(element?: ProjectItem): void {
	const projectsProvider = providerStore.get<ProjectsProvider>('projects');
	projectsProvider.refresh(element);
}
