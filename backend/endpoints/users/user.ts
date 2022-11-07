import hash from "password-hash";
import { OkPacket } from "mysql";

import { query, queryV } from "../../../database/connector";
import { Spieler } from "models/Spieler";
import { ExtraAccount } from "models/ExtraAccount";
import { RoleHistory } from "../../../models/RoleHistory";

export {
	getForId as get,
	getAllForId,
	changeName,
	changeEmail,
	changePassword,
	hasProgressShared,
	setProgressShared,
	setIconLink,
	addExtraAccount,
	getExtraAccounts,
	getAllExtraAccounts,
	deleteExtraAccount,
	getUserByName,
	updateTheme,
	getFullRoleHistory,
};

async function getForId(userId: number): Promise<Spieler[]> {
	const stmt = "SELECT id, accname, name, role, discord, theme FROM Spieler WHERE id = ?";
	try {
		return await queryV(stmt, userId);
	} catch (e) {
		throw e;
	}
}

async function getAllForId(userId: number): Promise<Spieler[]> {
	const stmt = "SELECT * FROM Spieler WHERE id = ?";
	try {
		return await queryV(stmt, userId);
	} catch (e) {
		throw e;
	}
}

async function changeName(userId: number, name: string): Promise<OkPacket> {
	try {
		const stmt = "UPDATE Spieler SET name = ? WHERE id = ?";
		return await queryV(stmt, [name, userId]);
	} catch (e) {
		throw e;
	}
}

async function changeEmail(userId: number, email: string): Promise<OkPacket> {
	const stmt = "UPDATE Spieler SET email = ? WHERE id = ?";
	try {
		return await queryV(stmt, [email, userId]);
	} catch (e) {
		throw e;
	}
}

async function changePassword(userId: number, pwd: string): Promise<OkPacket> {
	const pwdHash = hash.generate(pwd);
	const stmt = "UPDATE Spieler SET password = ? WHERE id = ?";
	try {
		return await queryV(stmt, [pwdHash, userId]);
	} catch (e) {
		throw e;
	}
}

async function hasProgressShared(userId: number): Promise<boolean[]> {
	const stmt = "SELECT share FROM Spieler WHERE id = ?";
	try {
		const response: { share: boolean }[] = await queryV(stmt, userId);
		return response.map((r) => r.share);
	} catch (e) {
		throw e;
	}
}

async function setProgressShared(userId: number, value: boolean): Promise<OkPacket> {
	const stmt = "UPDATE Spieler SET share = ? WHERE id = ?";
	const share = value ? 1 : 0;
	try {
		return await queryV(stmt, [share, userId]);
	} catch (e) {
		throw e;
	}
}

async function setIconLink(userId: number, link: string): Promise<OkPacket> {
	const stmt = "UPDATE Spieler SET icon = ? WHERE id = ?";
	try {
		return await queryV(stmt, [link, userId]);
	} catch (e) {
		throw e;
	}
}

async function getExtraAccounts(userId: number): Promise<ExtraAccount[]> {
	const stmt = "SELECT id, accName FROM ExtraAccounts WHERE fk_spieler = ?";
	try {
		return await queryV(stmt, [userId]);
	} catch (e) {
		throw e;
	}
}

async function addExtraAccount(userId: number, accountName: string): Promise<{ id: number }> {
	const stmt = "INSERT INTO ExtraAccounts (accname, fk_spieler) VALUES (?, ?)";
	try {
		const response: OkPacket = await queryV(stmt, [accountName, userId]);
		return { id: response.insertId };
	} catch (e) {
		throw e;
	}
}

async function getAllExtraAccounts(): Promise<ExtraAccount[]> {
	const stmt = "SELECT * from ExtraAccounts";
	try {
		return await query(stmt);
	} catch (e) {
		throw e;
	}
}

async function deleteExtraAccount(id: number, userId: number): Promise<OkPacket> {
	const stmt = "DELETE FROM ExtraAccounts WHERE id = ? AND fk_spieler = ?";
	try {
		return await queryV(stmt, [id, userId]);
	} catch (e) {
		throw e;
	}
}

async function getUserByName(
	accName: string
): Promise<{ id: number; accname: string; name: string; accName: string }[]> {
	const stmt =
		"SELECT user.id, user.accname, user.name, extra.accName FROM Spieler user" +
		"LEFT JOIN ExtraAccounts extra ON user.id = extra.fk_spieler" +
		"WHERE user.accname = ? OR extra.accName = ?";
	try {
		return await queryV(stmt, [accName, accName]);
	} catch (e) {
		throw e;
	}
}

async function updateTheme(theme: number, id: number): Promise<OkPacket> {
	const stmt = "UPDATE Spieler SET theme = ? WHERE id = ?";
	try {
		return await queryV(stmt, [theme, id]);
	} catch (e) {
		throw e;
	}
}

async function getFullRoleHistory(): Promise<RoleHistory[]> {
	const stmt = "SELECT * FROM RoleHistory";
	try {
		return await query(stmt);
	} catch (e) {
		throw e;
	}
}
