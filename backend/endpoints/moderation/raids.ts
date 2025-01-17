import { Raid } from 'models/Raid';
import { Spieler } from 'models/Spieler';
import { query, queryV } from "../../../database/connector";
import { OkPacket } from 'mysql';

export async function getRaids(): Promise<Raid[]> {
	const stmt = 'SELECT id, name, active FROM Raid ORDER BY active DESC, name';
	try {
		return await query(stmt);
	} catch (e) {
		throw e;
	}
}

export async function listPlayers(raidId: number): Promise<Spieler[]> {
	const stmt = 'SELECT Spieler.id AS id, Spieler.name AS name, Spieler.accname AS accname, Spieler_Raid.role AS role, Spieler.discord FROM Spieler_Raid JOIN Spieler ON Spieler.id = Spieler_Raid.fk_spieler WHERE fk_raid = ? ORDER BY role DESC, name';
	try {
		return await queryV(stmt, raidId);
	} catch (e) {
		throw e;
	}
}

export async function createRaid(name: string): Promise<OkPacket> {
	const stmt = 'INSERT INTO Raid (name) VALUES (?)';
	try {
		return await queryV(stmt, name);
	} catch (e) {
		throw e;
	}
}

export async function deleteRaid(id: number): Promise<OkPacket> {
	const stmt = 'DELETE FROM Raid WHERE id = ?';
	try {
		return await queryV(stmt, id);
	}
	catch (e) {
		throw e;
	}
}

export async function addPlayer(raidId: number, spielerId: number): Promise<OkPacket> {
	const stmt = 'INSERT INTO Spieler_Raid (fk_raid, fk_spieler) VALUES (?,?)';
	try {
		return await queryV(stmt, [raidId, spielerId]);
	} catch (e) {
		throw e;
	}
}

export async function setPlayerRole(raidId: number, spielerId: number, role: number): Promise<OkPacket> {
	const stmt = 'UPDATE Spieler_Raid SET role = ? WHERE fk_raid = ? AND fk_spieler = ?';
	try {
		return await queryV(stmt, [role, raidId, spielerId]);
	} catch (e) {
		throw e;
	}
}

export async function removePlayer(raidId: number, spielerId: number): Promise<OkPacket> {
	const stmt = 'DELETE FROM Spieler_Raid WHERE fk_raid = ? AND fk_spieler = ?';
	try {
		return await queryV(stmt, [raidId, spielerId]);
	} catch (e) {
		throw e;
	}
}

export async function getRaidsAsLead(spielerId: number): Promise<number> {
	const stmt = 'SELECT count(*) AS count FROM Spieler_Raid WHERE role = 2 AND fk_spieler = ?';
	try {
		const result: { count: number }[] = await queryV(stmt, [spielerId]);
		return result.map(r => r.count)[0];
	}
	catch (e) {
		throw e;
	}
}