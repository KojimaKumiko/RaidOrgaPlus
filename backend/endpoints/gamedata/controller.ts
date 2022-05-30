import * as _classes from "./classes";
import * as _encounter from "./encounter";
import * as _achievements from "./achievements";
import { Request } from "express";
import { Class } from "models/Klasse";
import { Encounter } from "models/Encounter";
import { Wing } from "models/Wing";
import { ControllerEndpoint } from "models/ControllerEndpoint";
import { wingStrike } from "../../../models/Types";

const endpoints: ControllerEndpoint[] = [
	{ function: getForBase, path: "/classes", method: "get", authed: false },
	{ function: getEncounter, path: "/encounter", method: "get", authed: false },
	{ function: getEncounterStrikes, path: "/encounter/strikes", method: "get", authed: false },
	{ function: getWings, path: "/wings", method: "get", authed: false },
	{ function: getWingsAndStrikes, path: "/wingsStrikes", method: "get", authed: false },
	{ function: getAchievements, path: "/achievements", method: "get", authed: false },
];
export default endpoints;

async function getForBase(req: Request): Promise<Class[]> {
	const base = Number(req.query.base);
	if (base) {
		return await _classes.getForBase(base);
	} else {
		return [];
	}
}

async function getEncounter(req: Request): Promise<Encounter[] | Encounter[][]> {
	const wing = Number(req.query.wing);
	const strike = Number(req.query.strike);
	const grouped = req.query.grouped;

	if (wing) {
		return await _encounter.listForWing(wing);
	} else if (strike) {
		// TODO: write method to get strikes
		return await _encounter.listForStrike(strike);
	} else if (grouped) {
		return await _encounter.listByWing();
	} else {
		return await _encounter.list();
	}
}

async function getEncounterStrikes(req: Request): Promise<Encounter[] | Encounter[][]> {
	const strike = Number(req.query.strike);
	const grouped = req.query.grouped;

	if (strike) {
		return await _encounter.listForStrike(strike);
	} else if (grouped) {
		return await _encounter.listByStrike();
	}
}

async function getWings(): Promise<Wing[]> {
	return await _encounter.getWings();
}

async function getWingsAndStrikes(): Promise<wingStrike[]> {
	const result: wingStrike[] = [];
	const wings = await _encounter.getWings();
	const strikes = await _encounter.getStrikes();

	wings.forEach(w => result.push({ ...w, isStrike: false }));
	strikes.forEach(w => result.push({ ...w, isStrike: true }));

	return result;
}

async function getAchievements(): Promise<any[]> {
	return await _achievements.getAchievements();
}
