import con from "../connector";
import { ModRaid } from "models/Raid";
import { Spieler } from "models/Spieler";
import { User } from "models/Types";

export default {
	getUsers,
	getRaids,
	createRaid,
	removeRaid,
	invitablePlayers,
	addSpieler,
	removeSpieler,
	setPlayerRole,
	getSpielerForRaid,
	setComment,
	updateSpielerRole,
	archiveSpieler,
	restoreUser,
};

async function getUsers(): Promise<User[]> {
	const users = await con<User[]>("moderation/users", "get", {}, true);
	users.forEach(u => u.archiveDate = new Date(u.archiveDate));
	return users;
}

async function getRaids(): Promise<ModRaid[]> {
	return await con("moderation/raids", "get", {}, true);
}

async function createRaid(name: string): Promise<void> {
	return await con("moderation/raids", "post", { name }, true);
}

async function removeRaid(id: number, name: string): Promise<void> {
	return await con("moderation/raids", "delete", { id, name }, true);
}

async function invitablePlayers(raidId: number): Promise<Spieler[]> {
	return await con("moderation/raids/invitable", "get", { raid: raidId }, true);
}

async function addSpieler(raidId: number, spielerId: number, accname: string, raidName: string): Promise<void> {
	return await con("moderation/raids/spieler", "post", { raid: raidId, spieler: spielerId, accname, raidName }, true);
}

async function removeSpieler(raidId: number, raidName: string, spielerId: number, accname: string): Promise<void> {
	return await con(
		"moderation/raids/spieler",
		"delete",
		{ raid: raidId, spieler: spielerId, raidName, accname },
		true
	);
}

async function getSpielerForRaid(raidId: number): Promise<Spieler[]> {
	return await con("moderation/raids/spieler", "get", { raid: raidId }, true);
}

async function setPlayerRole(raidId: number, spielerId: number, role: number, accname: string): Promise<void> {
	return await con("moderation/raids/role", "put", { raid: raidId, spieler: spielerId, role, accname }, true);
}

async function setComment(spielerId: number, comment: string): Promise<void> {
	return await con("moderation/users/comment", "put", { spieler: spielerId, comment }, true);
}

async function updateSpielerRole(spielerId: number, role: number): Promise<void> {
	return await con("moderation/users/role", "put", { spielerId, role }, true);
}

/**
 * Archives a user
 * @param userId the id of the user to archive.
 * @returns the archival date of the user.
 */
async function archiveSpieler(userId: number): Promise<Date> {
	return await con("moderation/users/archive", "put", { userId }, true);
}

/**
 * restores a user
 * @param userId the id of the user to restore.
 */
async function restoreUser(userId: number): Promise<void> {
	return await con("moderation/users/restore", "put", { userId }, true);
}
