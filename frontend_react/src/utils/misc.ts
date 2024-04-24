import { element } from 'models/Types';
import config from './config.json';
import { Role, ROLES } from 'models/Rolle';

type environment = "development" | "production";

export function getCurrentEnvironment(): environment {
	return process.env.NODE_ENV as environment;
}

export function getURL(): string {
	return config[getCurrentEnvironment()];
}

export function fixRoles(elements: element[]): void {
	elements.forEach(e => {
		let roles = [] as Role[];
		e.roleIds.split(", ").forEach(r => {
			roles.push(ROLES.find(g => g.id === Number(r)) ?? { id: 0 } as Role);
		});
		e.roles = roles;
	})
}