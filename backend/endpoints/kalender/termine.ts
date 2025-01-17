import { Raid } from 'models/Raid';
import { Termin } from 'models/Termin';
import { query } from "../../../database/connector";

export async function showTermineForNext7Days(): Promise<(Termin & Raid)[]> {
	const stmt = `
		SELECT Termin.id, Termin.date, Termin.time, Termin.endtime, Raid.name
		FROM Termin
		JOIN Raid ON Termin.fk_raid = Raid.id
		WHERE Termin.isArchived = 0 AND Termin.date >= CURDATE() AND Termin.date < DATE_ADD(CURDATE(), INTERVAL 7 DAY)
		ORDER BY Termin.date, Termin.time
	`;
	try {
		return await query(stmt);
	} catch (e) {
		throw e;
	}
}