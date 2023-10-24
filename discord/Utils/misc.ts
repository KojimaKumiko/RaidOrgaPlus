export function equalsIgnoreCase(text: string, search: string): boolean {
	return text.localeCompare(search, undefined, { sensitivity: "base" }) === 0;
}

const accountNameRegex = /[a-zA-Z]+[a-zA-Z\s]*\.\d{4}/;

export const checkAccountName = (name: string): boolean => {
	return accountNameRegex.test(name);
};

export const getAccountName = (name: string): string | null => {
	if (checkAccountName(name)) {
		return accountNameRegex.exec(name)[0];
	} else {
		return null;
	}
};
