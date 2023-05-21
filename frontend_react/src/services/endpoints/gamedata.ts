import fetch from "../connector";

import { Encounter } from "models/Encounter";
import { wingStrike } from "../../../../models/Types";
import { Class } from "../../../../models/Klasse";

export async function listEncounter(signal?: AbortSignal): Promise<Encounter[]> {
	return await fetch("gamedata/encounter", "get", {}, false, signal);
}

export async function listEncounterGrouped(signal?: AbortSignal): Promise<Encounter[][]> {
	return await fetch("gamedata/encounter", "get", { grouped: 1 }, false, signal);
}

export async function listEncounterGroupedStrikes(signal?: AbortSignal): Promise<Encounter[][]> {
	return await fetch("gamedata/encounter/strikes", "get", { grouped: 1 }, false, signal);
}

export async function listEncounterForWing(wing: number, signal?: AbortSignal): Promise<Encounter[]> {
	return await fetch("gamedata/encounter", "get", { wing }, false, signal);
}

export async function listEncounterForStrike(strike: number, signal?: AbortSignal): Promise<Encounter[]> {
	return await fetch("gamedata/encounter", "get", { strike }, false, signal);
}

export async function getClassesForBase(base: number, signal?: AbortSignal): Promise<Class[]> {
	return await fetch("gamedata/classes", "get", { base }, false, signal);
}

export async function getWings(signal?: AbortSignal): Promise<any> {
	return await fetch("gamedata/wings", "get", {}, false, signal);
}

export async function getWingsAndStrikes(signal?: AbortSignal): Promise<wingStrike[]> {
	return await fetch("gamedata/wingsStrikes", "get", {}, false, signal);
}

export async function getAchievementList(signal?: AbortSignal): Promise<any> {
	return await fetch("gamedata/achievements", "get", {}, false, signal);
}
