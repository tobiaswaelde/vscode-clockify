import http from '../services/http.service';
import { TemplateDto, TemplatePatchRequest } from '../interfaces/interfaces';

export function getTemplates(workspaceId: string): TemplateDto[] {
	let templates: TemplateDto[] = [];
	return templates;
}

export function addTemplate(workspaceId: string, newTamplate: TemplatePatchRequest): TemplateDto[] {
	let templates: TemplateDto[] = [];
	return templates;
}

export function getTemplate(workspaceId: string, templateId: string): TemplateDto {
	let template: TemplateDto = {} as TemplateDto;
	return template;
}

export function deleteTemplate(workspaceId: string, templateId: string): TemplateDto {
	let template: TemplateDto = {} as TemplateDto;
	return template;
}

export function changeTemplate(
	workspaceId: string,
	templateId: string,
	newTemplate: TemplatePatchRequest
): TemplateDto {
	let template: TemplateDto = {} as TemplateDto;
	return template;
}
