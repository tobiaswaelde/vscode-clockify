import { ClientDto, ProjectDtoImpl } from '../interfaces/interfaces';

export function getClientFromProject(clients: ClientDto[], project: ProjectDtoImpl) {
	return clients.find((client) => client.id === project.clientId);
}
