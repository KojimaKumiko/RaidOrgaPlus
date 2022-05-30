import con from "../connector";
import { homepageTermin } from "models/Types";
import { Aufstellung } from "models/Aufstellung";
import { Encounter } from "models/Encounter";

export default {
	isArchived,
	isLocked,
	putLocked,
	listActive,
	listArchived,
	newTermin,
	archive,
	anmelden,
	anmeldenLead,
	getErsatz,
	addErsatz,
	deleteErsatz,
	getAnmeldungForSpieler,
	getAnmeldungenForTermin,
	addBoss,
	addWing,
	addStrike,
	deleteTermin,
	getText,
	saveText,
	getHomepageTermine,
};

async function isArchived(termin: any): Promise<any> {
	return await con("termine/isArchived", "get", { termin }, true);
}

async function isLocked(termin: any): Promise<any> {
	return await con("termine/isLocked", "get", { termin }, true);
}

async function putLocked(termin: any, locked: any): Promise<any> {
	return await con("termine/isLocked", "put", { termin, locked }, true);
}

async function listActive(raid: any): Promise<any> {
	return await con("termine", "get", { raid }, true);
}

async function listArchived(raid: any): Promise<any> {
	return await con("termine", "get", { raid, archive: 1 }, true);
}

async function newTermin(raid: any, date: any, time: any, endtime: any): Promise<any> {
	return await con("termine", "post", { raid, date, time, endtime }, true);
}

async function deleteTermin(termin: any): Promise<any> {
	return await con("termine", "delete", { termin }, true);
}

async function archive(termin: any): Promise<any> {
	return await con("termine/archive", "put", { termin }, true);
}

async function anmelden(termin: any, type: any): Promise<any> {
	return await con("termine/anmeldungen", "put", { termin, type }, true);
}

async function anmeldenLead(spieler: any, termin: any, type: any): Promise<any> {
	return await con("termine/anmeldungenLead", "put", { termin, spieler, type }, true);
}

async function getAnmeldungForSpieler(termin: any): Promise<any> {
	return (await con<any>("termine/anmeldungen", "get", { termin }, true)).type;
}

async function getAnmeldungenForTermin(termin: any): Promise<any> {
	return await con("termine/anmeldungenAll", "get", { termin }, true);
}

async function addBoss(termin: number, boss: number): Promise<(Aufstellung & Encounter)[]> {
	return await con("termine/bosses", "post", { termin, boss }, true);
}

async function addWing(termin: number, wing: number): Promise<(Aufstellung & Encounter)[]> {
	return await con("termine/bosses", "post", { termin, wing }, true);
}

async function addStrike(termin: number, strike: number): Promise<(Aufstellung & Encounter)[]> {
	return await con("termine/bosses", "post", { termin, strike }, true);
}

async function getText(termin: any): Promise<string> {
	return await con<any>("termine/text", "get", { termin }, true);
}

async function saveText(termin: any, text: any): Promise<any> {
	return await con("termine/text", "put", { termin, text }, true);
}

async function getErsatz(termin: any): Promise<any> {
	return await con("termine/ersatz", "get", { termin }, true);
}

async function addErsatz(termin: any, user: any): Promise<any> {
	return await con("termine/ersatz", "post", { termin, user }, true);
}

async function deleteErsatz(termin: any, user: any): Promise<any> {
	return await con("termine/ersatz", "delete", { termin, user }, true);
}

async function getHomepageTermine(): Promise<homepageTermin[]> {
	return await con("termine", "get", {}, true);
}
