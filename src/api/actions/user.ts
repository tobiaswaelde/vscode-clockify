import http from '../../services/http.service';
import { UserDto } from '../interfaces';
import { ApiError } from '../errors';

export async function getUser(): Promise<UserDto> {
	let user: UserDto = {} as UserDto;
	await http
		.get(`/user`)
		.then((res) => {
			user = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
			//// user = {} as UserDto;
		});
	return user;
}
