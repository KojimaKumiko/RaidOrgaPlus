import con from "../connector";
import { homepageTermin } from "models/Types";
import { Aufstellung } from "models/Aufstellung";
import { Encounter } from "models/Encounter";
import { Termin } from "models/Termin";
import { Spieler, SpielerTermin } from "models/Spieler";

export async function isArchived(termin: any, signal?: AbortSignal): Promise<any> {
	return await con("termine/isArchived", "get", { termin }, true, signal);
}

export async function isLocked(termin: any, signal?: AbortSignal): Promise<any> {
	return await con("termine/isLocked", "get", { termin }, true, signal);
}

export async function putLocked(termin: any, locked: any, signal?: AbortSignal): Promise<any> {
	return await con("termine/isLocked", "put", { termin, locked }, true, signal);
}

export async function listActive(raid: any, signal?: AbortSignal): Promise<(Termin & SpielerTermin)[]> {
	return await con("termine", "get", { raid }, true, signal);
}

export async function listArchived(raid: any, signal?: AbortSignal): Promise<Termin[]> {
	return await con("termine", "get", { raid, archive: 1 }, true, signal);
}

export async function newTermin(raid: any, date: any, time: any, endtime: any, signal?: AbortSignal): Promise<any> {
	return await con("termine", "post", { raid, date, time, endtime }, true, signal);
}

export async function deleteTermin(termin: any, signal?: AbortSignal): Promise<any> {
	return await con("termine", "delete", { termin }, true, signal);
}

export async function archive(termin: any, signal?: AbortSignal): Promise<any> {
	return await con("termine/archive", "put", { termin }, true, signal);
}

export async function anmelden(termin: any, type: any, signal?: AbortSignal): Promise<any> {
	return await con("termine/anmeldungen", "put", { termin, type }, true, signal);
}

export async function anmeldenLead(spieler: any, termin: any, type: any, signal?: AbortSignal): Promise<any> {
	return await con("termine/anmeldungenLead", "put", { termin, spieler, type }, true, signal);
}

export async function getAnmeldungForSpieler(termin: any, signal?: AbortSignal): Promise<number | null> {
	return (await con<any>("termine/anmeldungen", "get", { termin }, true, signal)).type;
}

export async function getAnmeldungenForTermin(termin: any, signal?: AbortSignal): Promise<(Spieler & SpielerTermin)[]> {
	return await con("termine/anmeldungenAll", "get", { termin }, true, signal);
}

export async function addBoss(
	termin: number,
	boss: number,
	signal?: AbortSignal
): Promise<(Aufstellung & Encounter)[]> {
	return await con("termine/bosses", "post", { termin, boss }, true, signal);
}

export async function addWing(
	termin: number,
	wing: number,
	signal?: AbortSignal
): Promise<(Aufstellung & Encounter)[]> {
	return await con("termine/bosses", "post", { termin, wing }, true, signal);
}

export async function addStrike(
	termin: number,
	strike: number,
	signal?: AbortSignal
): Promise<(Aufstellung & Encounter)[]> {
	return await con("termine/bosses", "post", { termin, strike }, true, signal);
}

export async function getText(termin: any, signal?: AbortSignal): Promise<string> {
	return await con<any>("termine/text", "get", { termin }, true, signal);
}

export async function saveText(termin: any, text: any, signal?: AbortSignal): Promise<any> {
	return await con("termine/text", "put", { termin, text }, true, signal);
}

export async function getErsatz(termin: any, signal?: AbortSignal): Promise<any> {
	return await con("termine/ersatz", "get", { termin }, true, signal);
}

export async function addErsatz(termin: any, user: any, signal?: AbortSignal): Promise<any> {
	return await con("termine/ersatz", "post", { termin, user }, true, signal);
}

export async function deleteErsatz(termin: any, user: any, signal?: AbortSignal): Promise<any> {
	return await con("termine/ersatz", "delete", { termin, user }, true, signal);
}

export async function getHomepageTermine(signal?: AbortSignal): Promise<homepageTermin[]> {
	return await con("termine", "get", {}, true, signal);
}

export async function getTermin(id: number, signal?: AbortSignal): Promise<Termin> {
	return await con("termine", "get", { id }, true, signal);
}