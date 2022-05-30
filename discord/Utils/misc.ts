export function equalsIgnoreCase(text: string, search: string) {
	return text.localeCompare(search, undefined, { sensitivity: "base" }) === 0;
}