import { http } from '.';
import { Workspace, WorkspaceRequest } from './types';

/// <reference path="./index.ts" />
namespace Clockify {
	export class Workspaces {
		/**
		 * Find all workspaces for currently logged in user
		 */
		public static async getAll(): Promise<Workspace[]> {
			const res = await http.get('/workspaces');
			return res.data;
		}

		/**
		 * Add a new workspace
		 * @param newWorkspace New Workspace
		 */
		public static async add(newWorkspace: WorkspaceRequest): Promise<Workspace> {
			const res = await http.post('/workspaces', newWorkspace);
			return res.data;
		}
	}
}
