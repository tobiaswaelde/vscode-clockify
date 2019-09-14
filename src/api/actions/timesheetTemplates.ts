import http from '../../services/http.service';
import { TemplateDto, TemplatePatchRequest } from '../interfaces';

export async function getTemplates(workspaceId: string): Promise<TemplateDto[]> {
	let templates: TemplateDto[] = [];
	await http
		.get(`/v1/workspaces/${workspaceId}/templates`)
		.then((res) => {
			templates = res.data;
		})
		.catch((err) => {
			templates = [];
		});
	return templates;
}

export async function addTemplate(
	workspaceId: string,
	newTamplates: TemplatePatchRequest[]
): Promise<TemplateDto[]> {
	let templates: TemplateDto[] = [];
	await http
		.post(`/v1/workspaces/${workspaceId}/templates`, newTamplates)
		.then((res) => {
			templates = res.data;
		})
		.catch((err) => (templates = []));
	return templates;
}

export async function getTemplate(workspaceId: string, templateId: string): Promise<TemplateDto> {
	let template: TemplateDto = {} as TemplateDto;
	await http
		.get(`/v1/workspaces/${workspaceId}/templates/${templateId}`)
		.then((res) => {
			template = res.data;
		})
		.catch((err) => {
			template = {} as TemplateDto;
		});
	return template;
}

export async function deleteTemplate(
	workspaceId: string,
	templateId: string
): Promise<TemplateDto> {
	let template: TemplateDto = {} as TemplateDto;
	await http
		.delete(`/v1/workspaces/${workspaceId}/templates/${templateId}`)
		.then((res) => {
			template = res.data;
		})
		.catch((err) => {
			template = {} as TemplateDto;
		});
	return template;
}

export async function changeTemplate(
	workspaceId: string,
	templateId: string,
	newTemplate: TemplatePatchRequest
): Promise<TemplateDto> {
	let template: TemplateDto = {} as TemplateDto;
	await http
		.patch(`/v1/workspaces/${workspaceId}/templates/${templateId}`, newTemplate)
		.then((res) => {
			template = res.data;
		})
		.catch((err) => {
			template = {} as TemplateDto;
		});
	return template;
}
