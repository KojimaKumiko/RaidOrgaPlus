import * as _termin from "./termin";
import * as _ersatz from "../termine/ersatz";
import * as _aufstellung from "../aufstellungen/aufstellung";
import * as _roles from "../../authentication/role";
import * as _anmeldungen from "./anmeldungen";
import * as _homepage from "./homepage";
import { Request } from "express";
import { Authentication } from "models/Auth";
import { Spieler, SpielerTermin } from "models/Spieler";
import { Termin } from "models/Termin";
import { Aufstellung } from "models/Aufstellung";
import { Encounter } from "models/Encounter";
import { OkPacket } from "mysql";
import { ControllerEndpoint } from "models/ControllerEndpoint";
import { toBoolean } from "../../models/Util";
import { homepageTermin } from "../../../models/Types";
import { deleteEmbed, updateTerminEmbed } from "../../discord/termin";

const endpoints: ControllerEndpoint[] = [
	{ function: getTermine, path: "", method: "get", authed: true },
	{ function: postTermin, path: "", method: "post", authed: true },
	{ function: deleteTermin, path: "", method: "delete", authed: true },
	{ function: isArchived, path: "/isArchived", method: "get", authed: true },
	{ function: isLocked, path: "/isLocked", method: "get", authed: true },
	{ function: putLocked, path: "/isLocked", method: "put", authed: true },
	{ function: archive, path: "/archive", method: "put", authed: true },
	{ function: addBoss, path: "/bosses", method: "post", authed: true },
	{ function: putAnmeldung, path: "/anmeldungen", method: "put", authed: true },
	{ function: putAnmeldungLead, path: "/anmeldungenLead", method: "put", authed: true },
	{ function: getAnmeldung, path: "/anmeldungen", method: "get", authed: true },
	{ function: getAnmeldungenAll, path: "/anmeldungenAll", method: "get", authed: true },
	{ function: getText, path: "/text", method: "get", authed: true },
	{ function: saveText, path: "/text", method: "put", authed: true },
	{ function: getErsatz, path: "/ersatz", method: "get", authed: true },
	{ function: addErsatz, path: "/ersatz", method: "post", authed: true },
	{ function: deleteErsatz, path: "/ersatz", method: "delete", authed: true },
];
export default endpoints;

async function getTermine(
	req: Request,
	authentication: Authentication
): Promise<Termin[] | (Termin & SpielerTermin)[] | homepageTermin[]> {
	const raid = Number(req.query.raid);
	const archive = Number(req.query.archive);
	if (raid) {
		const role = _roles.forRaid(authentication, raid);
		if (role != null) {
			if (archive === 1) {
				return await _termin.listArchived(raid);
			} else {
				return await _termin.listActive(authentication.user, raid);
			}
		}
	} else {
		return await _homepage.getHomepageTermine(authentication.user);
	}
}

async function isArchived(req: Request, authentication: Authentication): Promise<boolean> {
	const termin = Number(req.query.termin);
	if (termin) {
		const role = await _roles.forTermin(authentication, termin);
		if (role != null) {
			return await _termin.isArchived(termin);
		}
	}
	return;
}

async function isLocked(req: Request, authentication: Authentication): Promise<boolean> {
	const termin = Number(req.query.termin);
	if (termin) {
		const role = await _roles.forTermin(authentication, termin);
		if (role != null) {
			return await _termin.isLocked(termin);
		}
	}
	return;
}

async function putLocked(req: Request, authentication: Authentication): Promise<OkPacket> {
	const termin = Number(req.body.termin);
	const locked = toBoolean(req.body.locked);
	if (termin && locked != null) {
		const role = await _roles.forTermin(authentication, termin);
		if (role > 0) {
			return await _termin.setLocked(termin, locked);
		}
	}
	return;
}

async function postTermin(req: Request, authentication: Authentication): Promise<OkPacket> {
	const raid = Number(req.body.raid);
	const date = req.body.date;
	const time = req.body.time;
	const endtime = req.body.endtime;
	if (raid && date && time) {
		const role = _roles.forRaid(authentication, raid);
		if (role > 0) {
			if (endtime) {
				return await _termin.newTerminWithEndTime(raid, date, time, endtime);
			} else {
				return await _termin.newTermin(raid, date, time);
			}
		}
	}
	return;
}

async function archive(req: Request, authentication: Authentication): Promise<OkPacket> {
	const termin = Number(req.body.termin);
	if (termin) {
		const role = await _roles.forTermin(authentication, termin);
		if (role > 0) {
			await deleteEmbed(termin);
			const response = await _termin.archive(termin);
			return response;
		}
	}
	return;
}

async function addBoss(req: Request, authentication: Authentication): Promise<(Aufstellung & Encounter)[]> {
	const termin = Number(req.body.termin);
	const boss = Number(req.body.boss);
	const wing = Number(req.body.wing);
	const strike = Number(req.body.strike);

	if (termin) {
		const role = await _roles.forTermin(authentication, termin);
		if (role > 0) {
			if (boss) {
				return _termin.addBoss(termin, boss).then(async (res: OkPacket) => {
					await _aufstellung.loadBlanko(res.insertId);
					return await _aufstellung.getForTermin(termin);
				});
			} else if (wing) {
				return _termin.addWing(termin, wing).then(async (res: OkPacket) => {
					const minId = res.insertId;
					const maxId = minId + res.affectedRows - 1;
					for (let i = minId; i <= maxId; i++) {
						await _aufstellung.loadBlanko(i);
					}
					return await _aufstellung.getForTermin(termin);
				});
			} else if (strike) {
				return _termin.addStrike(termin, strike).then(async (res: OkPacket) => {
					const minId = res.insertId;
					const maxId = minId + res.affectedRows - 1;
					for (let i = minId; i <= maxId; i++) {
						await _aufstellung.loadBlanko(i);
					}
					return await _aufstellung.getForTermin(termin);
				});
			}
		}
	}
	return [];
}

async function putAnmeldung(req: Request, authentication: Authentication): Promise<OkPacket> {
	const termin = Number(req.body.termin);
	const type = Number(req.body.type);
	if (termin && (type || type === 0)) {
		const role = await _roles.forTermin(authentication, termin);
		if (role != null) {
			const response = await _anmeldungen.anmelden(authentication.user, termin, type);
			updateTerminEmbed(termin);
			return response;
		}
	}
	return;
}

async function putAnmeldungLead(req: Request, authentication: Authentication): Promise<OkPacket> {
	const termin = Number(req.body.termin);
	const type = Number(req.body.type);
	const spieler = Number(req.body.spieler);
	if (termin && spieler && (type || type === 0)) {
		const role = await _roles.forTermin(authentication, termin);
		if (role > 0) {
			const response = await _anmeldungen.anmelden(spieler, termin, type);
			updateTerminEmbed(termin);
			return response;
		}
	}
	return;
}

async function getAnmeldung(req: Request, authentication: Authentication): Promise<{ type: number }> {
	const termin = Number(req.query.termin);
	if (termin) {
		return await _anmeldungen.getAnmeldungForSpieler(authentication.user, termin);
	}
	return;
}

async function getAnmeldungenAll(req: Request, authentication: Authentication): Promise<(Spieler & SpielerTermin)[]> {
	const termin = Number(req.query.termin);
	if (termin) {
		const role = await _roles.forTermin(authentication, termin);
		if (role != null) {
			return await _anmeldungen.getAnmeldungenForTermin(termin);
		}
	}
	return [];
}

async function deleteTermin(req: Request, authentication: Authentication): Promise<OkPacket> {
	const termin = Number(req.body.termin);
	if (termin) {
		const role = await _roles.forTermin(authentication, termin);
		if (role > 0) {
			await deleteEmbed(termin);
			const response = await _termin.delete(termin);
			return response;
		}
	}
	return;
}

async function getText(req: Request, authentication: Authentication): Promise<string> {
	const termin = Number(req.query.termin);
	if (termin) {
		const role = await _roles.forTermin(authentication, termin);
		if (role != null) {
			return (await _termin.getText(termin))[0];
		}
	}
	return;
}

async function saveText(req: Request, authentication: Authentication): Promise<OkPacket> {
	const termin = Number(req.body.termin);
	const text = req.body.text;
	if (termin && (text || text === "")) {
		const role = await _roles.forTermin(authentication, termin);
		if (role > 0) {
			return await _termin.saveText(termin, text);
		}
	}
	return;
}

async function getErsatz(req: Request, authentication: Authentication): Promise<Spieler[]> {
	const termin = Number(req.query.termin);
	if (termin) {
		const role = await _roles.forTermin(authentication, termin);
		if (role != null) {
			return await _ersatz.getErsatz(termin);
		}
	}
}

async function addErsatz(req: Request, authentication: Authentication): Promise<OkPacket> {
	const termin = Number(req.body.termin);
	const user = Number(req.body.user);
	if (termin && user) {
		const role = await _roles.forTermin(authentication, termin);
		if (role > 0) {
			return await _ersatz.addErsatz(user, termin);
		}
	}
}

async function deleteErsatz(req: Request, authentication: Authentication): Promise<OkPacket> {
	const termin = Number(req.body.termin);
	const user = Number(req.body.user);
	if (termin && user) {
		const role = await _roles.forTermin(authentication, termin);
		if (role > 0) {
			return await _ersatz.deleteErsatz(user, termin);
		}
	}
}
