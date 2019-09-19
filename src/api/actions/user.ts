import http from '../../services/http.service';
import { UserDto } from '../interfaces';
import { ApiError } from '../errors';

/**
 * Get currently logged in user's info
 */
export async function getUser(): Promise<UserDto> {
	let query = `/user`;
	let user: UserDto = {} as UserDto;
	await http
		.get(query)
		.then((res) => {
			user = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});
	return user;
}

/**
 * Find all users on workspace
 * @param workspaceId Workspace ID
 */
export async function getUsersForWorkspace(workspaceId: string): Promise<UserDto[]> {
	let query = `/workspace/${workspaceId}/users`;
	let users: UserDto[] = [];
	await http
		.get(query)
		.then((res) => {
			users = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});

	return users;
}
