import * as _aufstellung from '../aufstellungen/aufstellung';
import * as _element from '../aufstellungen/element';
import * as _roles from '../../authentication/role';
import * as _termin from '../termine/termin';
import * as _reports from '../reports/reports'
import { Request } from 'express';
import { Authentication } from 'models/Auth';
import { Aufstellung } from 'models/Aufstellung';
import { Encounter } from 'models/Encounter';
import { ControllerEndpoint } from 'models/ControllerEndpoint';

const endpoints: ControllerEndpoint[] = [
	{ function: setAufstellung, path: '/aufstellungen', method: 'post', authed: true },
];
export default endpoints;

async function setAufstellung(req: Request, authentication: Authentication): Promise<(Aufstellung & Encounter)[]> {
	const termin = Number(req.body.body.terminId);
	const data = req.body.body.aufstellungen;

	if (!(await _termin.doesTerminExist(termin))) {
		return [];
	}

	const role = await _roles.forTermin(authentication, termin);
	if (!role || role <= 0) {
		return [];
	}

	for (const boss of data) {
		let aufstellung: number = boss.aufstellungId;
		if (boss.aufstellungId == null) {
			if (boss.bossId == null) {
				continue;
			}
			try {
				const res = await _termin.addBoss(termin, Number(boss.bossId));
				aufstellung = res.insertId;
			} catch (e) {
				//Unable to insert, next boss
				continue;
			}
		}
		else {
			if (!(await _aufstellung.getForTermin(termin)).some(e => e.id === aufstellung)) {
				continue;
			}
		}

		if (boss.isCM === true || boss.isCM === false) {
			try {
				await _aufstellung.setCM(aufstellung, Boolean(boss.isCM));
			} catch (e) {
				//Ignore not possible to set CM.
			}
		}
		if (boss.success === true || boss.success === false) {
			try {
				await _aufstellung.setSuccess(aufstellung, Boolean(boss.success));
			} catch (e) {
				//Ignore not possible to set success.
			}
		}
		if (boss.reportLink != null) {
			try {
				const reportLink = String(boss.reportLink)
				if (reportLink.startsWith("https://dps.report/") || reportLink.startsWith("https://www.dps.report/")) {
					await _reports.writeReport(aufstellung, reportLink);
				}
			} catch (e) {
				//Ignore not possible to set success.
			}
		}

		for (const player of boss.positionen) {
			if (1 <= player.position && player.position <= 10) {

				try {
					await _element.setCompleteElement(aufstellung, Number(player.position), Number(player.classId), player.roleId.toString(), Number(player.spielerId))
				} catch (e) {
					// Ignore, next element
				}
			}
		}
	}

	return await _aufstellung.getForTermin(termin);
}
