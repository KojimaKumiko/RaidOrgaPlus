import { queryV } from "../../../database/connector";
import { OkPacket } from 'mysql';
import { Build } from 'models/Build';
import { mapRoleStringToRoles } from "../../util/misc";

export async function getBuilds(user: number): Promise<Build[]> {
	const stmt = `
		SELECT fk_class AS classId, sub.abbr AS classAbbr, sub.name as className, base.color AS classColor, roles, prefer
		FROM Spieler_Build
		JOIN Klasse sub ON sub.id = Spieler_Build.fk_class
		JOIN Klasse base ON base.id = sub.fk_base
		WHERE fk_spieler = ? ORDER BY prefer DESC, base.id, sub.id;
	`;
	try {
		return ((await queryV<Build[]>(stmt, user))).map(classRoleMapper);
	} catch (e) {
		throw e;
	}
}

export async function addBuild(user: number, clss: number, role: string): Promise<OkPacket> {
	const stmt = 'INSERT INTO Spieler_Build (fk_spieler, fk_class, roles) VALUES (?,?,?) ';
	try {
		return await queryV(stmt, [user, clss, role]);
	} catch (e) {
		throw e;
	}
}

export async function deleteBuild(user: number, clss: number, role: string): Promise<OkPacket> {
	const stmt = 'DELETE FROM Spieler_Build WHERE fk_spieler = ? AND fk_class = ? AND roles = ?';
	try {
		return await queryV(stmt, [user, clss, role]);
	} catch (e) {
		throw e;
	}
}

export async function putPrefer(user: number, clss: number, role: string, pref: number): Promise<OkPacket> {
	const stmt = 'UPDATE Spieler_Build SET prefer = ? WHERE fk_spieler = ? AND fk_class = ? AND roles = ?';
	try {
		return await queryV(stmt, [pref, user, clss, role]);
	} catch (e) {
		throw e;
	}
}

function classRoleMapper(element): Build {
	const roles = (element.roles as string).split(",").map(mapRoleStringToRoles);
	return {
		class: {
			abbr: element.classAbbr, id: element.classId, color: element.classColor, name: element.className
		},
		role: roles,
		prefer: element.prefer
	} as Build;
}