import http from '../services/http.service';
import { UserDto } from '../interfaces/interfaces';

export async function getUser(): Promise<UserDto> {
	let user: UserDto = {} as UserDto;
	await http
		.get(`/user`)
		.then((res) => {
			user = res.data;
		})
		.catch((err) => {
			user = {} as UserDto;
		});
	return user;
}
