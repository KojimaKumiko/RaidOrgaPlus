import { Role, ROLES } from "../../models/Rolle";

export function equalsIgnoreCase(text: string, search: string) {
	return text.localeCompare(search, undefined, { sensitivity: "base" }) === 0;
}

export function mapRoleStringToRoles(roleId: string) {
	let role: Role = { id: 0, name: "", abbr: "", visible: false, order: null };
	const id = Number(roleId);

	if (id > 0) {
		role = ROLES.find(r => r.id === id);
	}

	return role;
}