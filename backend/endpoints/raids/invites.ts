import { Einladung } from "models/Einladung";
import { Spieler } from "models/Spieler";
import { playerInvite, raidInvite } from "models/Types";
import { queryV } from "../../../database/connector";
import { OkPacket } from "mysql";

export {
	invitePlayer,
	invitablePlayers as invitable,
	pendingInvitesForPlayer as pendingForPlayer,
	pendingInvitesForRaid as pendingForRaid,
	acceptInvite as accept,
	deleteInvite as delete,
	isInvited,
};

async function invitePlayer(user: number, raid: number): Promise<OkPacket> {
	const stmt =
		"INSERT INTO Einladung (fk_raid, fk_spieler) VALUES (?, ?) ON DUPLICATE KEY UPDATE fk_spieler = fk_spieler";
	try {
		return await queryV(stmt, [raid, user]);
	} catch (e) {
		throw e;
	}
}

async function invitablePlayers(raid: number): Promise<Spieler[]> {
	const stmt =
		"SELECT Spieler.id, Spieler.name, Spieler.accname FROM Spieler " +
		"WHERE NOT Spieler.id IN (" +
		"SELECT fk_spieler FROM Spieler_Raid WHERE fk_raid = ?" +
		") AND Spieler.id > 9 AND Spieler.role > 0 " +
		"ORDER BY Spieler.name";
	try {
		return await queryV(stmt, [raid, raid]);
	} catch (e) {
		throw e;
	}
}

async function pendingInvitesForPlayer(spieler: number): Promise<playerInvite[]> {
	const stmt =
		"SELECT Einladung.fk_raid as id, Raid.name as name FROM Einladung JOIN Raid ON Raid.id = Einladung.fk_raid WHERE fk_spieler = ?";
	try {
		return await queryV(stmt, spieler);
	} catch (e) {
		throw e;
	}
}

async function pendingInvitesForRaid(raid: number): Promise<raidInvite[]> {
	const stmt = "SELECT fk_spieler as spieler FROM Einladung WHERE fk_raid = ?";
	try {
		return await queryV(stmt, raid);
	} catch (e) {
		throw e;
	}
}

async function acceptInvite(raid: number, spieler: number): Promise<OkPacket> {
	const stmt = "INSERT INTO Spieler_Raid (fk_raid, fk_spieler) VALUES (?,?)";
	try {
		await deleteInvite(raid, spieler);
		return await queryV(stmt, [raid, spieler]);
	} catch (e) {
		throw e;
	}
}

async function deleteInvite(raid: number, spieler: number): Promise<OkPacket> {
	const stmt = "DELETE FROM Einladung WHERE fk_raid = ? AND fk_spieler = ?";
	try {
		return await queryV(stmt, [raid, spieler]);
	} catch (e) {
		throw e;
	}
}

async function isInvited(raid: number, spieler: number): Promise<boolean> {
	const stmt = "SELECT * FROM Einladung WHERE fk_raid = ? AND fk_spieler = ?";
	try {
		const response: Einladung[] = await queryV(stmt, [raid, spieler]);
		return response.length > 0;
	} catch (e) {
		throw e;
	}
}
