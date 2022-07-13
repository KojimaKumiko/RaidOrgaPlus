import fetch from "../connector";

import { ModRaid } from "models/Raid";
import { Spieler } from "models/Spieler";
import { User } from "models/Types";

export async function getUsers(): Promise<User[]> {
	const users = await fetch<User[]>("moderation/users", "get", {}, true);
	users.forEach((u) => (u.archiveDate = new Date(u.archiveDate)));
	return users;
}

export async function getRaids(): Promise<ModRaid[]> {
	return await fetch("moderation/raids", "get", {}, true);
}

export async function createRaid(name: string): Promise<void> {
	return await fetch("moderation/raids", "post", { name }, true);
}

export async function removeRaid(id: number, name: string): Promise<void> {
	return await fetch("moderation/raids", "delete", { id, name }, true);
}

export async function invitablePlayers(raidId: number): Promise<Spieler[]> {
	return await fetch("moderation/raids/invitable", "get", { raid: raidId }, true);
}

export async function addSpieler(raidId: number, spielerId: number, accname: string, raidName: string): Promise<void> {
	return await fetch(
		"moderation/raids/spieler",
		"post",
		{ raid: raidId, spieler: spielerId, accname, raidName },
		true
	);
}

export async function removeSpieler(
	raidId: number,
	raidName: string,
	spielerId: number,
	accname: string
): Promise<void> {
	return await fetch(
		"moderation/raids/spieler",
		"delete",
		{ raid: raidId, spieler: spielerId, raidName, accname },
		true
	);
}

export async function getSpielerForRaid(raidId: number): Promise<Spieler[]> {
	return await fetch("moderation/raids/spieler", "get", { raid: raidId }, true);
}

export async function setPlayerRole(raidId: number, spielerId: number, role: number, accname: string): Promise<void> {
	return await fetch("moderation/raids/role", "put", { raid: raidId, spieler: spielerId, role, accname }, true);
}

export async function setComment(spielerId: number, comment: string): Promise<void> {
	return await fetch("moderation/users/comment", "put", { spieler: spielerId, comment }, true);
}

export async function updateSpielerRole(spielerId: number, role: number): Promise<void> {
	return await fetch("moderation/users/role", "put", { spielerId, role }, true);
}

/**
 * Archives a user
 * @param userId the id of the user to archive.
 * @returns the archival date of the user.
 */
export async function archiveSpieler(userId: number): Promise<Date> {
	return await fetch("moderation/users/archive", "put", { userId }, true);
}

/**
 * restores a user
 * @param userId the id of the user to restore.
 */
export async function restoreUser(userId: number): Promise<void> {
	return await fetch("moderation/users/restore", "put", { userId }, true);
}
