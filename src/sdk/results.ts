export function filterByArchivedState<T extends { archived?: boolean }>(
	items: T[],
	archived: boolean
): T[] {
	return items.filter((item) => Boolean(item.archived) === archived);
}

export function filterTasksByActivity<T extends { status: string }>(
	items: T[],
	isActive: boolean
): T[] {
	return items.filter((item) => (item.status === 'ACTIVE') === isActive);
}
