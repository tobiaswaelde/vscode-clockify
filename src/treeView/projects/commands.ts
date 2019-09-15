import * as vscode from 'vscode';
import { ProjectDtoImpl } from '../../api/interfaces';
import { providerStore } from '../stores';
import { ProjectsProvider, ProjectItem } from './projects.provider';

export function registerProjectsCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('clockify.projects.selection', selectProject),
		vscode.commands.registerCommand('clockify.projects.add', addProject),
		vscode.commands.registerCommand('clockify.projects.refresh', refreshProjects)
	);
}

function selectProject(project: ProjectDtoImpl): void {
	//
}

async function addProject(): Promise<void> {
	//
}

function refreshProjects(element?: ProjectItem): void {
	const projectsProvider = providerStore.get<ProjectsProvider>('projects');
	projectsProvider.refresh(element);
}
