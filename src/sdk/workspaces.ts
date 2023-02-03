import { BaseApi } from '.';
import { Workspace, WorkspaceRequest } from './types';

export namespace Clockify {
	export class Workspaces extends BaseApi {
		/**
		 * Find all workspaces for currently logged in user
		 */
		public static async getAll(): Promise<Workspace[]> {
			const res = await this.http.get('/workspaces');
			return res.data;
		}

		/**
		 * Add a new workspace
		 * @param newWorkspace New Workspace
		 */
		public static async add(newWorkspace: WorkspaceRequest): Promise<Workspace> {
			const res = await this.http.post('/workspaces', newWorkspace);
			return res.data;
		}
	}
}
