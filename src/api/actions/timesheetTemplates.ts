import http from '../../services/http.service';
import { TemplateDto, TemplatePatchRequest } from '../interfaces';
import { ApiError } from '../errors';

/**
 * Get templates for current user on specified workspace
 * @param workspaceId Workspace ID
 * @param name If provided, clients will be filtered by name
 * @param cleansed If provided, returned templates will contain only project-task pairs which on which user can track time. Example: If project which was used in template, gets archived meanwhile, it will not be returned since you can't track time on archived project.
 * @param hydrated If provided, returned template's project and task will be returned in full and not just their ids.Note that if you request hydrated entity version, projectId and taskId will be changed to project and task inrequest response.
 * @param page page
 * @param pageSize page-size
 */
export async function getTemplates(
	workspaceId: string,
	name?: string,
	cleansed?: boolean,
	hydrated?: boolean,
	page: number = 1,
	pageSize: number = 50
): Promise<TemplateDto[]> {
	let query = `/v1/workspaces/${workspaceId}/templates`;
	let queryParamsSet = false;
	//#region QUERY PARAMETERS
	if (name) {
		query += `${queryParamsSet ? '&' : '?'}name=${name}`;
		queryParamsSet = true;
	}
	if (cleansed) {
		query += `${queryParamsSet ? '&' : '?'}cleansed=${cleansed}`;
		queryParamsSet = true;
	}
	if (hydrated) {
		query += `${queryParamsSet ? '&' : '?'}hydrated=${hydrated}`;
		queryParamsSet = true;
	}
	if (page) {
		query += `${queryParamsSet ? '&' : '?'}page=${page}`;
		queryParamsSet = true;
	}
	if (pageSize) {
		query += `${queryParamsSet ? '&' : '?'}page-size=${pageSize}`;
		queryParamsSet = true;
	}
	//#endregion

	let templates: TemplateDto[] = [];
	await http
		.get(query)
		.then((res) => {
			templates = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});
	return templates;
}

/**
 * Save templates to workspace
 * It is possible to create multiple templates at once with this request.
 * @param workspaceId Workspace ID
 * @param newTamplates New Templated
 */
export async function addTemplate(
	workspaceId: string,
	newTamplates: TemplatePatchRequest[]
): Promise<TemplateDto[]> {
	let query = `/v1/workspaces/${workspaceId}/templates`;
	let templates: TemplateDto[] = [];
	await http
		.post(query, newTamplates)
		.then((res) => {
			templates = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});
	return templates;
}

/**
 * Get template from workspace
 * @param workspaceId Workspace ID
 * @param templateId Template ID
 * @param cleansed If provided, returned templates will contain only project-task pairs which on which user can track time. Example: If project which was used in template, gets archived meanwhile, it will not be returned since you can't track time on archived project.
 * @param hydrated If provided, returned template's project and task will be returned in full and not just their ids.Note that if you request hydrated entity version, projectId and taskId will be changed to project and task inrequest response.
 */
export async function getTemplate(
	workspaceId: string,
	templateId: string,
	cleansed?: boolean,
	hydrated?: boolean
): Promise<TemplateDto> {
	let query = `/v1/workspaces/${workspaceId}/templates/${templateId}`;
	let queryParamsSet = false;
	//#region QUERY PARAMETERS
	if (cleansed) {
		query += `${queryParamsSet ? '&' : '?'}cleansed=${cleansed}`;
		queryParamsSet = true;
	}
	if (hydrated) {
		query += `${queryParamsSet ? '&' : '?'}hydrated=${hydrated}`;
		queryParamsSet = true;
	}
	//#endregion

	let template: TemplateDto = {} as TemplateDto;
	await http
		.get(query)
		.then((res) => {
			template = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});
	return template;
}

/**
 * Delete saved template
 * @param workspaceId Workspace ID
 * @param templateId Template ID
 */
export async function deleteTemplate(
	workspaceId: string,
	templateId: string
): Promise<TemplateDto> {
	let query = `/v1/workspaces/${workspaceId}/templates/${templateId}`;
	let template: TemplateDto = {} as TemplateDto;
	await http
		.delete(query)
		.then((res) => {
			template = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});
	return template;
}

/**
 * Change saved template name
 * New name must be different from any existing template for user on workspace.
 * @param workspaceId Workspace ID
 * @param templateId Template ID
 * @param newTemplate New Template
 */
export async function changeTemplate(
	workspaceId: string,
	templateId: string,
	newTemplate: TemplatePatchRequest
): Promise<TemplateDto> {
	let query = `/v1/workspaces/${workspaceId}/templates/${templateId}`;
	let template: TemplateDto = {} as TemplateDto;
	await http
		.patch(query, newTemplate)
		.then((res) => {
			template = res.data;
		})
		.catch((error) => {
			throw new ApiError(error);
		});
	return template;
}
