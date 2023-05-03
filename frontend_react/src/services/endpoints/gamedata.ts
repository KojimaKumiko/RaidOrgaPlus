import fetch from "../connector";

import { Encounter } from "models/Encounter";
import { wingStrike } from "../../../../models/Types";
import { Class } from "../../../../models/Klasse";

export async function listEncounter(): Promise<Encounter[]> {
	return await fetch("gamedata/encounter", "get", {}, false);
}

export async function listEncounterGrouped(): Promise<Encounter[][]> {
	return await fetch("gamedata/encounter", "get", { grouped: 1 }, false);
}

export async function listEncounterGroupedStrikes(): Promise<Encounter[][]> {
	return await fetch("gamedata/encounter/strikes", "get", { grouped: 1 }, false);
}

export async function listEncounterForWing(wing: number): Promise<Encounter[]> {
	return await fetch("gamedata/encounter", "get", { wing }, false);
}

export async function listEncounterForStrike(strike: number): Promise<Encounter[]> {
	return await fetch("gamedata/encounter", "get", { strike }, false);
}

export async function getClassesForBase(base: number): Promise<Class[]> {
	return await fetch("gamedata/classes", "get", { base }, false);
}

export async function getWings(): Promise<any> {
	return await fetch("gamedata/wings", "get", {}, false);
}

export async function getWingsAndStrikes(): Promise<wingStrike[]> {
	return await fetch("gamedata/wingsStrikes", "get", {}, false);
}

export async function getAchievements(): Promise<any> {
	return await fetch("gamedata/achievements", "get", {}, false);
}
