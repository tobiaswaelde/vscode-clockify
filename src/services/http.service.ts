import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

axios.defaults.baseURL = API_BASE_URL;

function authenticate(apiKey: string) {
	axios.defaults.headers.common['X-Api-Key'] = apiKey;
}

export default {
	get: axios.get,
	post: axios.post,
	patch: axios.patch,
	delete: axios.delete,
	authenticate
};
