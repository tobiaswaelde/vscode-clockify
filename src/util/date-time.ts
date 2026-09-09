const LOCAL_DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/;

function pad(value: number): string {
	return value.toString().padStart(2, '0');
}

export function formatLocalDateTime(value: Date): string {
	return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(
		value.getHours()
	)}:${pad(value.getMinutes())}`;
}

export function parseLocalDateTime(value: string): Date | undefined {
	const match = LOCAL_DATE_TIME_PATTERN.exec(value.trim());
	if (!match) {
		return undefined;
	}

	const [, year, month, day, hour, minute] = match.map(Number);
	const parsed = new Date(year, month - 1, day, hour, minute, 0, 0);
	if (
		parsed.getFullYear() !== year ||
		parsed.getMonth() !== month - 1 ||
		parsed.getDate() !== day ||
		parsed.getHours() !== hour ||
		parsed.getMinutes() !== minute
	) {
		return undefined;
	}

	return parsed;
}
